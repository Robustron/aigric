import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const geminiApiKey = Deno.env.get('GEMINI_API_KEY') as string
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`;

// Helper function to safely parse JSON
const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON:", text, e);
    return null;
  }
};

serve(async (req) => {
  console.log("Generate recommendations function invoked.");

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const todayDate = new Date().toISOString().split('T')[0];
  console.log(`Fetching data for date: ${todayDate}`);

  // Fetch farm locations with their active crops and recent weather data
  const { data: farmLocations, error: locationError } = await supabase
    .from('farm_locations')
    .select(`
      id,
      location_name,
      latitude,
      longitude,
      farm_crops!inner (
        id,
        crop_id,
        planting_date,
        expected_harvest_date,
        status,
        crops!inner (
          id,
          name,
          scientific_name,
          growing_season,
          ideal_temp_min,
          ideal_temp_max,
          ideal_rainfall_min,
          ideal_rainfall_max
        )
      ),
      weather_data!inner (
        date,
        temp_high,
        temp_low,
        precipitation_mm,
        humidity_percent,
        wind_speed_kmh
      )
    `)
    .eq('farm_crops.status', 'active') // Only get locations with active crops
    .eq('weather_data.date', todayDate) // Only get today's weather data

  if (locationError) {
    console.error('Error fetching farm locations/crops/weather:', locationError.message)
    return new Response(JSON.stringify({ error: `Failed to fetch data: ${locationError.message}` }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }

  if (!farmLocations || farmLocations.length === 0) {
    console.log('No farm locations with active crops and current weather data found.')
    return new Response(JSON.stringify({ message: 'No applicable farm data found for recommendations.' }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }

  console.log(`Found ${farmLocations.length} farm locations with active crops and weather data.`)

  // Ensure Gemini API key is available
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY environment variable is not set.')
    return new Response(JSON.stringify({ error: 'Gemini API key is missing.' }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }

  // Process each location
  const recommendationPromises = farmLocations.map(async (location) => {
    console.log(`Processing location: ${location.location_name} (${location.id})`);
    const weatherData = location.weather_data[0] // We know there's weather data due to the inner join

    // Process each active crop at this location
    const cropPromises = location.farm_crops.map(async (farmCrop) => {
      const crop = farmCrop.crops
      console.log(`Processing crop: ${crop.name} for location ${location.id}`);

      // Prepare context for Gemini
      // Simplified prompt structure for clarity
      const prompt = `
Farm Location: ${location.location_name} (Lat: ${location.latitude}, Lon: ${location.longitude})
Crop: ${crop.name} (${crop.scientific_name})
  - Ideal Temp: ${crop.ideal_temp_min}-${crop.ideal_temp_max}°C
  - Ideal Monthly Rainfall: ${crop.ideal_rainfall_min}-${crop.ideal_rainfall_max}mm
  - Planted: ${farmCrop.planting_date}, Expected Harvest: ${farmCrop.expected_harvest_date}

Today's Weather (${weatherData.date}):
  - Temp: ${weatherData.temp_low}°C - ${weatherData.temp_high}°C
  - Precipitation: ${weatherData.precipitation_mm}mm
  - Humidity: ${weatherData.humidity_percent}%
  - Wind: ${weatherData.wind_speed_kmh} km/h

Task: Based ONLY on the provided data, generate a single, concise, actionable recommendation for the farmer related to this specific crop and today's weather. Categorize the recommendation (e.g., Irrigation, Pest Alert, Nutrient Management, Planting, Harvesting, Frost Warning) and assign a priority (High, Medium, Low). 

Output Format: Respond ONLY with a valid JSON object containing three fields: "recommendation" (string), "category" (string), and "priority" (string: High, Medium, or Low).

Example:
{
  "recommendation": "Light irrigation needed due to high temperatures and no rainfall.",
  "category": "Irrigation",
  "priority": "Medium"
}
`

      try {
        console.log(`Calling Gemini API for crop ${crop.id} at location ${location.id}`);
        // Call Gemini API
        const geminiResponse = await fetch(
          geminiApiUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              // Add safety settings and generation config if needed
              // safetySettings: [...],
              // generationConfig: { temperature: 0.7, ... }
            }),
          }
        )

        if (!geminiResponse.ok) {
          const errorBody = await geminiResponse.text();
          console.error(`Gemini API error for crop ${crop.id}: ${geminiResponse.status} ${geminiResponse.statusText}`, errorBody)
          throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText}`)
        }

        const geminiData = await geminiResponse.json()

        // Safely access the response text
        const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            console.error("Invalid or empty response structure from Gemini API:", JSON.stringify(geminiData));
            throw new Error("Invalid response structure from Gemini API.");
        }

        console.log(`Raw Gemini response for crop ${crop.id}: ${responseText}`);
        const aiResponse = safeJsonParse(responseText);

        if (!aiResponse || !aiResponse.recommendation || !aiResponse.category || !aiResponse.priority) {
          console.error("Failed to parse Gemini JSON response or missing required fields:", responseText)
          throw new Error("Invalid JSON format or missing fields in Gemini response.")
        }

        // Map priority to numeric value
        const priorityMap: { [key: string]: number } = {
          'high': 1,
          'medium': 2,
          'low': 3
        }
        const priorityLevel = priorityMap[aiResponse.priority.toLowerCase()] || 3;

        // Store recommendation in database
        const recommendationRecord = {
          farm_location_id: location.id,
          crop_id: crop.id,
          date: todayDate,
          recommendation_text: aiResponse.recommendation,
          category: aiResponse.category.toLowerCase(), // Ensure category is lowercase
          priority: priorityLevel,
          is_read: false // Default to unread
        };

        console.log(`Inserting recommendation for crop ${crop.id}:`, recommendationRecord)
        const { error: insertError } = await supabase
          .from('ai_recommendations')
          .insert(recommendationRecord)
          // Consider adding an ON CONFLICT clause if needed, e.g., if you only want one recommendation per crop per day
          // .upsert(recommendationRecord, { onConflict: 'farm_location_id, crop_id, date' })

        if (insertError) {
          console.error(`Database insert error for recommendation (crop ${crop.id}):`, insertError.message)
          throw new Error(`Database insert error: ${insertError.message}`)
        }

        console.log(`Successfully inserted recommendation for crop ${crop.id}`);
        return { crop_id: crop.id, status: 'success' }
      } catch (error) {
        console.error(`Error processing crop ${crop.id} at location ${location.id}:`, error.message)
        return { crop_id: crop.id, status: 'error', message: error.message }
      }
    })

    const cropResults = await Promise.allSettled(cropPromises);
    return { location_id: location.id, results: cropResults.map(r => r.status === 'fulfilled' ? r.value : { status: 'error', message: r.reason?.message }) };
  })

  const results = await Promise.allSettled(recommendationPromises);

  // Log final summary
  const successfulRecs = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.results?.filter(cr => cr.status === 'success') ?? []).length;
  const failedRecs = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.results?.filter(cr => cr.status !== 'success') ?? []).length;
  const errors = results.filter(r => r.status === 'rejected').length;

  console.log(`Recommendation generation summary: ${successfulRecs} successful, ${failedRecs} failed/skipped, ${errors} function errors.`);

  return new Response(
    JSON.stringify({ results: results.map(r => r.status === 'fulfilled' ? r.value : { status: 'error', message: r.reason?.message }) }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200 // Function completed, even if individual recommendations failed
    }
  )
})

console.log("Generate recommendations function script loaded.") 