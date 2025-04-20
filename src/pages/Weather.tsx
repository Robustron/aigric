
import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  Wind, 
  Droplets, 
  CalendarDays,
  ChartLine,
  ChartBar,
  MapPin
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Weather = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-slate-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-farmwise-green-dark">Weather Data</h1>
              <p className="text-slate-600">Monitor weather conditions for your farm locations</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-full md:w-[200px]">
                <Select defaultValue="green-valley">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Farm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green-valley">Green Valley Farm</SelectItem>
                    <SelectItem value="sunrise-acres">Sunrise Acres</SelectItem>
                    <SelectItem value="riverside">Riverside Fields</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[150px]">
                <Select defaultValue="today">
                  <SelectTrigger>
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Card className="bg-gradient-to-br from-farmwise-sky-light/50 to-farmwise-sky/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Sun className="h-16 w-16 text-farmwise-warning mr-4" />
                    <div>
                      <div className="text-4xl font-bold">24°C</div>
                      <div className="text-slate-700">Sunny with scattered clouds</div>
                      <div className="text-sm text-slate-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        Green Valley Farm • Updated just now
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Droplets className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Humidity</div>
                        <div className="font-medium">65%</div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Wind className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Wind</div>
                        <div className="font-medium">8 km/h</div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <CloudRain className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Rainfall</div>
                        <div className="font-medium">0 mm</div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Thermometer className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Feels Like</div>
                        <div className="font-medium">26°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="forecast" className="mb-8">
            <TabsList>
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Forecast</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <ChartLine className="h-4 w-4" />
                <span>Weather Trends</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                <span>Historical Comparison</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">7-Day Weather Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    {[...Array(7)].map((_, idx) => {
                      const isToday = idx === 0;
                      const date = new Date();
                      date.setDate(date.getDate() + idx);
                      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const dateNum = date.getDate();
                      
                      // Generate random weather data for the mockup
                      const weatherIcons = [<Sun />, <Cloud />, <CloudRain />];
                      const weatherTypes = ["Sunny", "Cloudy", "Rainy"];
                      const weatherIndex = Math.floor(Math.random() * 3);
                      const maxTemp = Math.round(20 + Math.random() * 10);
                      const minTemp = Math.round(maxTemp - (5 + Math.random() * 5));
                      
                      return (
                        <div 
                          key={idx} 
                          className={`p-4 rounded-lg text-center ${
                            isToday ? 'bg-farmwise-green-light/20 border border-farmwise-green' : 'border'
                          }`}
                        >
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-farmwise-green-dark' : ''}`}>
                            {day}
                          </div>
                          <div className="text-xs text-slate-500 mb-3">{dateNum}</div>
                          <div className="flex justify-center mb-2">
                            {React.cloneElement(weatherIcons[weatherIndex], { 
                              className: `h-7 w-7 ${
                                weatherIndex === 0 ? 'text-farmwise-warning' : 
                                weatherIndex === 1 ? 'text-slate-400' : 'text-farmwise-sky'
                              }`
                            })}
                          </div>
                          <div className="text-xs mb-1">{weatherTypes[weatherIndex]}</div>
                          <div>
                            <span className="text-base font-medium">{maxTemp}°</span>
                            <span className="text-slate-500 text-xs ml-1">{minTemp}°</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Weather Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-[300px] bg-slate-100 rounded-lg border border-dashed">
                    <div className="text-center text-slate-500">
                      <ChartLine className="h-10 w-10 mx-auto mb-2" />
                      <p>Weather trend charts will be displayed here.</p>
                      <p className="text-xs">Connect to Supabase to enable weather data collection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Historical Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-[300px] bg-slate-100 rounded-lg border border-dashed">
                    <div className="text-center text-slate-500">
                      <ChartBar className="h-10 w-10 mx-auto mb-2" />
                      <p>Historical weather comparison charts will be displayed here.</p>
                      <p className="text-xs">Connect to Supabase to enable historical data analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(6)].map((_, idx) => {
                    const hour = new Date();
                    hour.setHours(hour.getHours() + idx);
                    
                    // Generate random weather data for the mockup
                    const weatherIcons = [<Sun />, <Cloud />, <CloudRain />];
                    const weatherTypes = ["Sunny", "Partly Cloudy", "Light Rain"];
                    const weatherIndex = Math.floor(Math.random() * 3);
                    const temp = Math.round(22 + Math.random() * 6 - idx * 0.5);
                    
                    return (
                      <div key={idx} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 text-sm font-medium">
                            {hour.getHours()}:00
                          </div>
                          {React.cloneElement(weatherIcons[weatherIndex], { 
                            className: `h-5 w-5 ${
                              weatherIndex === 0 ? 'text-farmwise-warning' : 
                              weatherIndex === 1 ? 'text-slate-400' : 'text-farmwise-sky'
                            }`
                          })}
                          <span className="text-sm">{weatherTypes[weatherIndex]}</span>
                        </div>
                        <div className="text-base font-medium">{temp}°C</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Agricultural Weather Advisory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-farmwise-green/10 border border-farmwise-green/20 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-5 w-5 text-farmwise-green" />
                    <span className="font-medium">Ideal Growing Conditions</span>
                  </div>
                  <p className="text-sm">
                    Current weather conditions are optimal for crop growth. Make the most of these conditions for planting or field work.
                  </p>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-farmwise-success/10 text-farmwise-success mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="text-sm">Good irrigation conditions for the next 24 hours</div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-farmwise-success/10 text-farmwise-success mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="text-sm">Low disease pressure expected this week</div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-farmwise-warning/10 text-farmwise-warning mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div className="text-sm">Potential dry period expected next week - plan irrigation accordingly</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Weather;
