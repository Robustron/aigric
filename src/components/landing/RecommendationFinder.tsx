// src/components/landing/RecommendationFinder.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, CloudSun, BrainCircuit } from 'lucide-react'; // Icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Define interfaces for the data we expect
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  description: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  location_name?: string; // Optional: API might return location name
}

// --- UPDATED RecommendationData Interface ---
interface PrimaryRecommendation {
  crop: string;
  reasoning: string;
  planting_time: string;
  soil_preparation: string;
  watering_schedule: string;
  fertilizer_needs: string;
  pest_disease_watch: string;
  risk_management: string;
}

interface AlternativeRecommendation {
  crop: string;
  reasoning: string;
}

interface RecommendationData {
  primary_recommendation: PrimaryRecommendation;
  alternative_recommendations: AlternativeRecommendation[];
}
// --- END UPDATED INTERFACE ---

export function RecommendationFinder() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false); // To control result visibility

  // Get Supabase Function URL from environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apiFunctionUrl = `${supabaseUrl}/functions/v1/api/recommend-on-the-fly`;

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCoords(null);
    setWeather(null);
    setRecommendations(null);
    setShowResults(false); // Hide previous results

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        try {
          // --- Replace MOCK DATA with API call --- 
          console.log(`Calling backend: ${apiFunctionUrl}`);
          const response = await fetch(apiFunctionUrl, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // NOTE: No Authorization header needed here as the endpoint itself doesn't require user auth
              // If it *did* require auth, you'd get the token from supabase.auth.getSession()
              // 'Authorization': `Bearer ${session.access_token}` 
            },
            body: JSON.stringify({ latitude, longitude })
          });
          
          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json(); // Try to parse error response from backend
            } catch (e) {
              errorData = { error: `HTTP error ${response.status}: ${response.statusText}` }; // Fallback error
            }
             console.error("Backend API error response:", errorData);
            throw new Error(errorData.error || 'Failed to fetch recommendations from server.');
          }
          
          const data = await response.json();
          console.log("Received data from backend:", data);

          // Validate received data structure (basic check)
          if (!data.weather || !data.recommendations) {
             throw new Error("Received invalid data structure from the server.");
          }
          
          setWeather(data.weather);
          setRecommendations(data.recommendations);
          // --- END API call --- 

          setShowResults(true); // Show results once data is fetched
        } catch (err) {
           console.error("Error during fetch or data processing:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred while fetching data.");
           setShowResults(false); // Ensure results are hidden on error
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enable location services in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while getting location.");
            break;
        }
        setIsLoading(false);
      },
      { timeout: 10000 } // Set a timeout for the request
    );
  };

  return (
    <section id="recommendation-finder" className="py-16 md:py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-farmwise-green-dark">
              Get Instant Crop Recommendations
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Allow location access to get personalized crop suggestions based on your current weather conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            {!showResults && (
              <Button
                size="lg"
                className="bg-farmwise-green hover:bg-farmwise-green-dark text-lg px-8 py-6"
                onClick={handleLocationRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Getting Location & Data...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-5 w-5" /> Allow Location Access
                  </>
                )}
              </Button>
            )}

            {error && !isLoading && (
              <Alert variant="destructive" className="w-full">
                 <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showResults && (
                <div className="w-full space-y-6 animate-fade-in">
                   {/* Coordinates Display */}
                  {coords && (
                    <Card className="bg-sky-50 border-sky-200">
                        <CardHeader>
                            <CardTitle className="flex items-center text-sky-800">
                                <MapPin className="mr-2 h-5 w-5"/> Your Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-sky-700">
                                Latitude: {coords.latitude.toFixed(4)}, Longitude: {coords.longitude.toFixed(4)}
                            </p>
                        </CardContent>
                    </Card>
                  )}

                  {/* Weather Display */}
                  {weather && (
                     <Card className="bg-amber-50 border-amber-200">
                        <CardHeader>
                             <CardTitle className="flex items-center text-amber-800">
                                <CloudSun className="mr-2 h-5 w-5"/> Current Weather {weather.location_name ? `in ${weather.location_name}` : ''}
                            </CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-1 text-sm text-amber-700">
                            <p><strong>Condition:</strong> {weather.description}</p>
                            <p><strong>Temperature:</strong> {weather.temp}°C (Feels like {weather.feels_like}°C)</p>
                            <p><strong>Humidity:</strong> {weather.humidity}%</p>
                            <p><strong>Wind:</strong> {weather.wind_speed.toFixed(1)} km/h</p>
                        </CardContent>
                    </Card>
                  )}

                  {/* --- UPDATED Recommendations Display --- */}
                  {recommendations?.primary_recommendation && (
                     <Card className="bg-emerald-50 border-emerald-200">
                         <CardHeader>
                             <CardTitle className="flex items-center text-emerald-800">
                                <BrainCircuit className="mr-2 h-5 w-5"/> AI Farming Recommendations
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-3 text-sm text-emerald-700">
                             {/* Primary Recommendation Details */}
                             <div className="p-3 border border-emerald-300 rounded-md bg-white/50">
                                <h4 className="font-semibold text-base mb-2 text-emerald-900">Primary Suggestion: {recommendations.primary_recommendation.crop}</h4>
                                <p><strong className="text-emerald-800">Reasoning:</strong> {recommendations.primary_recommendation.reasoning}</p>
                                <p><strong className="text-emerald-800">Planting Time:</strong> {recommendations.primary_recommendation.planting_time}</p>
                                <p><strong className="text-emerald-800">Soil Prep:</strong> {recommendations.primary_recommendation.soil_preparation}</p>
                                <p><strong className="text-emerald-800">Watering:</strong> {recommendations.primary_recommendation.watering_schedule}</p>
                                <p><strong className="text-emerald-800">Fertilizer:</strong> {recommendations.primary_recommendation.fertilizer_needs}</p>
                                <p><strong className="text-emerald-800">Pest/Disease Watch:</strong> {recommendations.primary_recommendation.pest_disease_watch}</p>
                                <p><strong className="text-emerald-800">Risk Management:</strong> {recommendations.primary_recommendation.risk_management}</p>
                            </div>
                            
                            {/* Alternative Recommendations */}    
                            {recommendations.alternative_recommendations && recommendations.alternative_recommendations.length > 0 && (
                                <div className="mt-4">
                                     <h5 className="font-medium text-emerald-900 mb-2">Alternative Suggestions:</h5>
                                     <ul className="list-disc list-inside space-y-1">
                                         {recommendations.alternative_recommendations.map((alt, index) => (
                                             <li key={index}>
                                                 <span className="font-semibold">{alt.crop}:</span> {alt.reasoning}
                                             </li>
                                         ))}
                                    </ul>
                                 </div>
                            )}
                         </CardContent>
                     </Card>
                  )}
                  {/* --- END UPDATED DISPLAY --- */}

                   {/* Button to try again */}
                   <Button
                        variant="outline"
                        onClick={handleLocationRequest}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                         {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Refreshing...
                            </>
                            ) : (
                             "Get New Recommendation for Current Location"
                        )}
                    </Button>
                </div>
            )}

          </CardContent>
        </Card>
      </div>
       {/* Basic fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </section>
  );
}

// Make sure to export the component
export default RecommendationFinder; 