/**
 * @file RecommendationFinder.tsx
 * @description A React component that provides real-time farming recommendations based on user location and current weather conditions.
 * This component integrates with Supabase Edge Functions, OpenWeatherMap API, and Google Gemini AI to deliver
 * comprehensive farming advice.
 */

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Cloud, Leaf } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { supabase } from '@/lib/supabaseClient'

/**
 * Interface representing geographical coordinates
 * @interface Coordinates
 */
interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Interface representing the current weather data structure
 * @interface WeatherData
 */
interface WeatherData {
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

/**
 * Interface representing the primary crop recommendation structure
 * @interface PrimaryRecommendation
 */
interface PrimaryRecommendation {
  crop: string;
  planting_time: string;
  soil_preparation: string;
  watering_schedule: string;
  fertilizer_needs: string;
  pest_management: string;
  risk_management: string;
}

/**
 * Interface representing an alternative crop suggestion
 * @interface AlternativeRecommendation
 */
interface AlternativeRecommendation {
  crop: string;
  reasoning: string;
}

/**
 * Interface representing the complete recommendation data structure
 * @interface RecommendationData
 */
interface RecommendationData {
  primary_recommendation: PrimaryRecommendation;
  alternative_recommendations: AlternativeRecommendation[];
}

/**
 * RecommendationFinder Component
 * 
 * This component provides a user interface for getting real-time farming recommendations
 * based on the user's current location and weather conditions. It handles:
 * - Location access and coordinate retrieval
 * - API calls to fetch weather data and AI recommendations
 * - Display of recommendations in a structured format
 * - Error handling and loading states
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
export function RecommendationFinder() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const newCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setCoords(newCoords);

      // Call the API endpoint
      const { data, error } = await supabase.functions.invoke('api', {
        body: {
          action: 'recommend-on-the-fly',
          coordinates: newCoords
        }
      });

      if (error) throw error;

      if (data) {
        setWeather(data.weather);
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location or recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get Farming Recommendations</CardTitle>
          <CardDescription>
            Allow location access to get personalized farming advice based on your current weather conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGetLocation} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              'Allow Location Access'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {coords && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Latitude: {coords.latitude}</p>
            <p>Longitude: {coords.longitude}</p>
          </CardContent>
        </Card>
      )}

      {weather && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.windSpeed} m/s</p>
            <p>Conditions: {weather.description}</p>
          </CardContent>
        </Card>
      )}

      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              AI Farming Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Primary Recommendation</h3>
              <p><strong>Crop:</strong> {recommendation.primary_recommendation.crop}</p>
              <p><strong>Planting Time:</strong> {recommendation.primary_recommendation.planting_time}</p>
              <p><strong>Soil Preparation:</strong> {recommendation.primary_recommendation.soil_preparation}</p>
              <p><strong>Watering Schedule:</strong> {recommendation.primary_recommendation.watering_schedule}</p>
              <p><strong>Fertilizer Needs:</strong> {recommendation.primary_recommendation.fertilizer_needs}</p>
              <p><strong>Pest Management:</strong> {recommendation.primary_recommendation.pest_management}</p>
              <p><strong>Risk Management:</strong> {recommendation.primary_recommendation.risk_management}</p>
            </div>

            {recommendation.alternative_recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Alternative Suggestions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {recommendation.alternative_recommendations.map((alt, index) => (
                    <li key={index}>
                      <strong>{alt.crop}:</strong> {alt.reasoning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 