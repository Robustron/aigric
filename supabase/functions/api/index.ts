// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

// Define CORS headers for preflight and actual requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow requests from any origin (adjust for production)
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' // Explicitly allow methods
}

// Helper function to get user-specific client
// We initialize the client *without* the global Authorization header initially
const getSupabaseClient = (req: Request, supabaseUrl: string, supabaseAnonKey: string): SupabaseClient => {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization') ?? '' }, // Pass auth header if present
      }
    }
  );
};

serve(async (req) => {
  console.log(`API function invoked. Method: ${req.method}, URL: ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request.");
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key missing in environment variables.");
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  // Parse URL and path
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const endpoint = pathParts.pop() || pathParts.pop(); // Handle potential trailing slash

  console.log(`Routing request for endpoint: ${endpoint}`);

  try {
    // Route API requests based on the last part of the path
    switch (endpoint) {
      case 'dashboard': {
        // Initialize client *with* Auth header for this protected endpoint
        const supabaseClient = getSupabaseClient(req, supabaseUrl, supabaseAnonKey);
        
        // --- Authentication Check Moved Here ---
        console.log("[Dashboard] Attempting to get user...");
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError) {
          console.error("[Dashboard] Error getting user:", userError.message);
          const status = userError.message === 'Invalid Refresh Token' || userError.message.includes('JWT') ? 401 : 500;
          return new Response(JSON.stringify({ error: `Authentication error: ${userError.message}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: status });
        }
        if (!user) {
          console.log("[Dashboard] No authenticated user found.");
          return new Response(JSON.stringify({ error: 'Not authorized.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
        }
        console.log(`[Dashboard] Authenticated user: ${user.id}`);
        // --- End Authentication Check ---
        
        console.log("Handling /dashboard endpoint");
        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Get dashboard data: recent weather and top recommendations for user's locations
        // Use RLS implicitly by using the user-authenticated client
        const { data: locationsData, error: dashboardError } = await supabaseClient
          .from('farm_locations')
          .select(`
            id,
            location_name,
            weather_data (
              date,
              temp_high,
              temp_low,
              precipitation_mm,
              humidity_percent,
              wind_speed_kmh
            ),
            ai_recommendations (
              id,
              recommendation_text,
              category,
              priority,
              date,
              is_read
            )
          `)
          // Ensures we only fetch data for the authenticated user due to RLS
          // .eq('user_id', user.id) // RLS makes this redundant but could be explicit
          .order('date', { foreignTable: 'weather_data', ascending: false })
          .order('priority', { foreignTable: 'ai_recommendations', ascending: true })
          .order('created_at', { foreignTable: 'ai_recommendations', ascending: false })
          .limit(1, { foreignTable: 'weather_data' }) // Get latest weather
          .limit(5, { foreignTable: 'ai_recommendations' }); // Get top 5 recommendations

        if (dashboardError) {
          console.error("[Dashboard] Error fetching dashboard data:", dashboardError.message);
          throw new Error(`Failed to fetch dashboard data: ${dashboardError.message}`);
        }

        console.log(`[Dashboard] Fetched dashboard data for ${locationsData?.length || 0} locations.`);
        return new Response(JSON.stringify({ locations: locationsData || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      case 'forecast': {
        console.log("Handling /forecast endpoint");
         if (req.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Get 5-day forecast for a specific location ID from query params
        const locationId = url.searchParams.get('locationId'); // Changed param name for clarity
        const latitude = url.searchParams.get('lat');
        const longitude = url.searchParams.get('lon');

        if (!locationId && (!latitude || !longitude)) {
           console.log("Missing required parameters for forecast (locationId or lat/lon).");
           return new Response(JSON.stringify({ error: 'Either locationId or both lat and lon parameters are required for forecast.' }), {
             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
             status: 400, // Bad Request
           });
        }

        // --- Placeholder for actual forecast API call --- 
        // You would typically fetch coordinates for the locationId first if only ID is provided,
        // then call a weather forecast API (e.g., OpenWeatherMap One Call API).
        console.log(`Fetching forecast for: ${locationId ? `ID ${locationId}` : `Lat ${latitude}, Lon ${longitude}`}`);
        // Example: const forecastData = await fetchForecast(latitude, longitude);

        // Returning mock data as per the guide
        const mockForecast = {
          forecast: [
            { date: '2024-07-28', temp_high: 28, temp_low: 15, precipitation: 0, condition: 'Sunny' },
            { date: '2024-07-29', temp_high: 30, temp_low: 16, precipitation: 5, condition: 'Partly Cloudy' },
            { date: '2024-07-30', temp_high: 29, temp_low: 17, precipitation: 10, condition: 'Showers' },
            { date: '2024-07-31', temp_high: 25, temp_low: 14, precipitation: 2, condition: 'Cloudy' },
            { date: '2024-08-01', temp_high: 24, temp_low: 13, precipitation: 0, condition: 'Sunny' },
          ]
        };
        // --- End Placeholder --- 

        return new Response(JSON.stringify(mockForecast), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      // --- Add other endpoints here as needed ---
      // Example: Endpoint to mark a recommendation as read
      case 'mark-recommendation-read': {
         // Initialize client *with* Auth header for this protected endpoint
        const supabaseClient = getSupabaseClient(req, supabaseUrl, supabaseAnonKey);

        // --- Authentication Check Moved Here ---
         console.log("[MarkRead] Attempting to get user...");
        const { data: { user: markReadUser }, error: markReadUserError } = await supabaseClient.auth.getUser(); // Renamed user var to avoid conflict
        if (markReadUserError) {
          console.error("[MarkRead] Error getting user:", markReadUserError.message);
          const status = markReadUserError.message === 'Invalid Refresh Token' || markReadUserError.message.includes('JWT') ? 401 : 500;
          return new Response(JSON.stringify({ error: `Authentication error: ${markReadUserError.message}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: status });
        }
        if (!markReadUser) {
           console.log("[MarkRead] No authenticated user found.");
          return new Response(JSON.stringify({ error: 'Not authorized.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
        }
        console.log(`[MarkRead] Authenticated user: ${markReadUser.id}`);
        // --- End Authentication Check ---
        
          console.log("Handling /mark-recommendation-read endpoint");
           if (req.method !== 'POST') {
              return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
          const { recommendationId } = await req.json();
          if (!recommendationId) {
              return new Response(JSON.stringify({ error: 'recommendationId is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }

          // Update the recommendation. RLS should prevent users from updating others' recommendations.
          const { error: updateError } = await supabaseClient
              .from('ai_recommendations')
              .update({ is_read: true })
              .match({ id: recommendationId }); // Ensure RLS policy allows this

          if (updateError) {
              console.error(`Error marking recommendation ${recommendationId} as read:`, updateError.message);
              throw new Error(`Failed to update recommendation: ${updateError.message}`);
          }
          
          console.log(`[MarkRead] Marked recommendation ${recommendationId} as read.`);
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // --- NEW ENDPOINT --- 
      case 'recommend-on-the-fly': {
        console.log("Handling /recommend-on-the-fly endpoint");
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        let latitude: number | null = null;
        let longitude: number | null = null;

        try {
          const body = await req.json();
          latitude = body.latitude;
          longitude = body.longitude;
          if (latitude == null || longitude == null || typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new Error("Invalid or missing latitude/longitude in request body.");
          }
        } catch (parseError) {
          console.error("Error parsing request body:", parseError.message);
          return new Response(JSON.stringify({ error: `Bad Request: ${parseError.message}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Get API keys from environment
        const weatherApiKey = Deno.env.get('WEATHER_API_KEY');
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

        if (!weatherApiKey || !geminiApiKey) {
          console.error("Missing WEATHER_API_KEY or GEMINI_API_KEY environment variable.");
          return new Response(JSON.stringify({ error: 'Server configuration error: Missing API keys.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 1. Fetch Current Weather from OpenWeatherMap
        let currentWeatherData: any = null; // Using 'any' for simplicity with external API
        try {
          const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;
          console.log(`Fetching current weather from: ${weatherApiUrl}`);
          const weatherResponse = await fetch(weatherApiUrl);
          if (!weatherResponse.ok) {
            const errorText = await weatherResponse.text();
            throw new Error(`OpenWeatherMap API Error (${weatherResponse.status}): ${errorText}`);
          }
          currentWeatherData = await weatherResponse.json();
          console.log("Received weather data:", currentWeatherData);
        } catch (weatherError) {
          console.error("Error fetching weather data:", weatherError.message);
          return new Response(JSON.stringify({ error: `Failed to fetch weather data: ${weatherError.message}` }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); // Bad Gateway
        }

        // Format weather data for response and Gemini prompt
        const formattedWeather = {
            description: currentWeatherData.weather?.[0]?.description || 'N/A',
            temp: currentWeatherData.main?.temp,
            feels_like: currentWeatherData.main?.feels_like,
            humidity: currentWeatherData.main?.humidity,
            wind_speed: currentWeatherData.wind?.speed ? currentWeatherData.wind.speed * 3.6 : null, // m/s to km/h
            location_name: currentWeatherData.name || 'N/A'
        };

        // 2. Call Gemini API for Recommendations
        let recommendationsData: any = null;
        try {
          const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
          
          // --- UPDATED DETAILED PROMPT --- 
          const prompt = `Given the current weather conditions at latitude ${latitude.toFixed(4)}, longitude ${longitude.toFixed(4)} (${formattedWeather.location_name}): 
- Condition: ${formattedWeather.description}
- Temperature: ${formattedWeather.temp}°C (Feels like ${formattedWeather.feels_like}°C)
- Humidity: ${formattedWeather.humidity}%
- Wind Speed: ${formattedWeather.wind_speed?.toFixed(1) ?? 'N/A'} km/h

Based *only* on this real-time weather data and location, provide DETAILED farming recommendations suitable for a small-scale or hobbyist farmer. Respond ONLY in JSON format with the following structure: 
{
  "primary_recommendation": {
    "crop": "<Best primary crop suggestion>",
    "reasoning": "<Detailed explanation for the primary crop choice based on weather and location context>",
    "planting_time": "<Recommended planting time, e.g., 'Ideal within the next 3-5 days', 'Wait for upcoming rain'>",
    "soil_preparation": "<Specific soil preparation tips, e.g., 'Ensure good drainage, mix in compost', 'Check pH if possible'>",
    "watering_schedule": "<Specific watering advice based on current weather, e.g., 'Water deeply every 2 days due to heat', 'Morning watering preferred'>",
    "fertilizer_needs": "<Initial fertilizer guidance, e.g., 'Use a balanced starter fertilizer', 'Side-dress with nitrogen in 4 weeks'>",
    "pest_disease_watch": "<List specific pests/diseases relevant to the crop AND current weather, e.g., 'Aphids, Powdery Mildew (due to humidity)'>",
    "risk_management": "<Overall risks based on weather/crop and mitigation, e.g., 'Risk of sun scorch on young plants, provide afternoon shade if possible.'>"
  },
  "alternative_recommendations": [
    {
      "crop": "<Alternative crop suggestion 1>",
      "reasoning": "<Brief reason why it's also suitable, considering weather>"
    },
    {
      "crop": "<Alternative crop suggestion 2>",
      "reasoning": "<Brief reason why it's also suitable, considering weather>"
    }
  ]
}
Do not include any introductory text, markdown formatting, code fences, or explanations outside the exact JSON structure requested.`;
          // --- END UPDATED DETAILED PROMPT ---

          const geminiRequestBody = {
            contents: [
              { parts: [{ text: prompt }] }
            ],
             generationConfig: {
                // "responseMimeType": "application/json", // Keep commented unless model/API version explicitly supports it
                temperature: 0.7, // Slightly higher temp might encourage more detail
                maxOutputTokens: 800, // Increase token limit for more detail
            },
          };

          console.log("Sending request to Gemini API...");
          const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiRequestBody)
          });

          if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API Error (${geminiResponse.status}): ${errorText}`);
          }

          const geminiResult = await geminiResponse.json();
          console.log("Received raw Gemini result:", JSON.stringify(geminiResult)); // Log the raw result

          // Extract the text content and attempt to parse it as JSON
          const textContent = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!textContent) {
            throw new Error("No content found in Gemini response.");
          }

          try {
             // More robust cleaning: Find JSON block within potential markdown fences
             const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```|({[\s\S]*})/);
             const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[2]).trim() : textContent.trim(); // Extract block or assume it's plain JSON

             if (!jsonString || !jsonString.startsWith('{') || !jsonString.endsWith('}')) {
                 console.error("Extracted text does not look like valid JSON object:", jsonString);
                 throw new Error("AI response content could not be parsed as JSON object.");
             }

             recommendationsData = JSON.parse(jsonString); // Attempt to parse the extracted/cleaned string
             console.log("Parsed recommendations:", recommendationsData);
          } catch (jsonParseError) {
             console.error("Failed to parse Gemini response as JSON:", jsonParseError.message);
             console.error("Raw text content from Gemini:", textContent);
             // Fallback: Return the raw text if JSON parsing fails but content exists
             recommendationsData = { 
                 crop: "N/A", 
                 planting_time: "N/A", 
                 risk_management: "AI failed to generate structured data.", 
                 reasoning: `Raw AI response: ${textContent}`
              }; 
          }

        } catch (geminiError) {
          console.error("Error calling Gemini API:", geminiError.message);
          // Don't fail the whole request, return weather data + error indicator for recommendations
          recommendationsData = { 
              crop: "N/A", 
              planting_time: "N/A", 
              risk_management: `Error fetching AI recommendations: ${geminiError.message}`,
              reasoning: "AI suggestion could not be generated."
           }; 
        }

        // 3. Return Combined Data
        return new Response(JSON.stringify({
          weather: formattedWeather,
          recommendations: recommendationsData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      // --- END NEW ENDPOINT --- 

      default:
        console.log(`Endpoint not found: ${endpoint}`);
        return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404, // Not Found
        });
    }
  } catch (error) {
    console.error("An unexpected error occurred in API function:", error.message, error.stack);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

console.log("API function script loaded."); 