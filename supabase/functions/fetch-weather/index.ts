// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const weatherApiKey = Deno.env.get('WEATHER_API_KEY') as string

serve(async (req) => {
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch all farm locations
  const { data: farmLocations, error: locationError } = await supabase
    .from('farm_locations')
    .select('*')

  if (locationError) {
    console.error('Error fetching farm locations:', locationError.message)
    return new Response(JSON.stringify({ error: `Failed to fetch farm locations: ${locationError.message}` }), {
      headers: { "Content-Type": "application/json" },
      status: 500, // Internal Server Error seems more appropriate
    })
  }

  // Handle case where there are no farm locations
  if (!farmLocations || farmLocations.length === 0) {
    console.log('No farm locations found to process.')
    return new Response(JSON.stringify({ message: 'No farm locations to process.' }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }

  console.log(`Found ${farmLocations.length} farm locations. Fetching weather data...`)

  // Process each location
  const weatherPromises = farmLocations.map(async (location) => {
    // Basic validation for location data
    if (!location.latitude || !location.longitude) {
        console.warn(`Skipping location ${location.id} due to missing coordinates.`)
        return { location_id: location.id, status: 'skipped', reason: 'Missing coordinates' }
    }

    try {
      // Fetch weather data from API (example using OpenWeatherMap)
      // Ensure API key is present
      if (!weatherApiKey) {
          throw new Error('WEATHER_API_KEY environment variable is not set.')
      }
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${weatherApiKey}&units=metric`
      console.log(`Fetching weather for location ${location.id} from ${weatherApiUrl}`)

      const weatherResponse = await fetch(weatherApiUrl)

      if (!weatherResponse.ok) {
        const errorBody = await weatherResponse.text();
        console.error(`Weather API error for location ${location.id}: ${weatherResponse.status} ${weatherResponse.statusText}`, errorBody)
        throw new Error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`)
      }

      const weatherData = await weatherResponse.json()
      console.log(`Received weather data for location ${location.id}:`, weatherData)

      // Prepare data for insertion
      const recordToUpsert = {
        farm_location_id: location.id,
        date: new Date().toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
        temp_high: weatherData.main?.temp_max,
        temp_low: weatherData.main?.temp_min,
        precipitation_mm: weatherData.rain ? weatherData.rain["1h"] || 0 : 0, // Handle potential missing rain data
        humidity_percent: weatherData.main?.humidity,
        wind_speed_kmh: weatherData.wind?.speed ? weatherData.wind.speed * 3.6 : null, // Convert m/s to km/h, handle missing wind data
        soil_moisture_percent: null, // Placeholder - Add actual source if available
        uv_index: null, // Placeholder - Add actual source if available
        data_source: 'OpenWeatherMap',
      };

      // Filter out entries with null essential values if necessary, or handle them in DB schema
      if (recordToUpsert.temp_high == null || recordToUpsert.temp_low == null) {
           console.warn(`Skipping data insertion for location ${location.id} due to missing temperature data.`)
           return { location_id: location.id, status: 'skipped', reason: 'Missing temperature data from API' }
      }


      // Transform and store the data using upsert
      console.log(`Upserting weather data for location ${location.id}:`, recordToUpsert)
      const { error: insertError } = await supabase
        .from('weather_data')
        .upsert(recordToUpsert, {
          onConflict: 'farm_location_id, date', // Ensure this matches your unique constraint
          // Consider returning the record or minimal data for efficiency if needed
          // select: 'id'
        })

      if (insertError) {
        console.error(`Database insert error for location ${location.id}:`, insertError.message)
        throw new Error(`Database insert error: ${insertError.message}`)
      }

      console.log(`Successfully upserted weather data for location ${location.id}`)
      return { location_id: location.id, status: 'success' }
    } catch (error) {
      console.error(`Error processing location ${location.id}:`, error.message)
      return { location_id: location.id, status: 'error', message: error.message }
    }
  })

  const results = await Promise.allSettled(weatherPromises); // Use allSettled to get results even if some promises fail

  // Log final results
  const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
  const failedUpdates = results.filter(r => r.status === 'fulfilled' && r.value.status !== 'success').length;
  const errors = results.filter(r => r.status === 'rejected').length;

  console.log(`Weather fetch summary: ${successfulUpdates} successful, ${failedUpdates} failed/skipped, ${errors} errors.`);

  return new Response(
    JSON.stringify({ results: results.map(r => r.status === 'fulfilled' ? r.value : { status: 'error', message: r.reason?.message }) }), // Provide a consistent structure for results
    {
      headers: { "Content-Type": "application/json" },
      status: 200 // Return 200 even if some individual fetches failed, as the function itself completed
    }
  )
})

console.log("Fetch weather function script loaded.") 