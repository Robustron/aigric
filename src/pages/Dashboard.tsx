
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Cloud, MapPin, Thermometer, CloudRain, Wind, AlertTriangle } from "lucide-react";

const mockFarmData = {
  name: "Green Valley Farm",
  location: "California, USA",
  coordinates: "37.7749° N, 122.4194° W",
  currentWeather: {
    temperature: 24,
    humidity: 65,
    rainfall: 0,
    windSpeed: 8,
    forecast: "Sunny with scattered clouds"
  },
  recommendations: [
    {
      type: "success",
      title: "Optimal Planting Conditions",
      description: "Current weather is perfect for planting wheat and barley."
    },
    {
      type: "warning",
      title: "Potential Dry Period",
      description: "Plan for irrigation as forecasts show limited rainfall next week."
    }
  ],
  crops: [
    { name: "Wheat", status: "Excellent", plannedHarvest: "4 weeks" },
    { name: "Corn", status: "Good", plannedHarvest: "8 weeks" },
    { name: "Soybeans", status: "Needs attention", plannedHarvest: "12 weeks" }
  ]
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-slate-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-farmwise-green-dark">Farm Dashboard</h1>
              <p className="text-slate-600">Overview of your farm's current status and recommendations</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex gap-2 items-center">
                <MapPin className="h-4 w-4" />
                <span>Add New Farm Location</span>
              </Button>
              <Button className="bg-farmwise-green hover:bg-farmwise-green-dark">View All Farms</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-farmwise-soil" />
                    {mockFarmData.name}
                  </CardTitle>
                  <CardDescription>{mockFarmData.location} • {mockFarmData.coordinates}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Thermometer className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Temperature</div>
                        <div className="font-medium">{mockFarmData.currentWeather.temperature}°C</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <CloudRain className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Humidity</div>
                        <div className="font-medium">{mockFarmData.currentWeather.humidity}%</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Cloud className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Rainfall</div>
                        <div className="font-medium">{mockFarmData.currentWeather.rainfall} mm</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Wind className="h-5 w-5 text-farmwise-sky" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Wind Speed</div>
                        <div className="font-medium">{mockFarmData.currentWeather.windSpeed} km/h</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-farmwise-sky/10 p-4 rounded-lg border border-farmwise-sky/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="h-5 w-5 text-farmwise-sky" />
                      <span className="font-medium">Today's Forecast</span>
                    </div>
                    <p>{mockFarmData.currentWeather.forecast}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Brain className="h-5 w-5 text-farmwise-green" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>
                    Insights generated based on current and forecasted conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockFarmData.recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg border ${
                        rec.type === 'success' 
                          ? 'bg-farmwise-success/10 border-farmwise-success/20' 
                          : 'bg-farmwise-warning/10 border-farmwise-warning/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          rec.type === 'success' 
                            ? 'bg-farmwise-success/20' 
                            : 'bg-farmwise-warning/20'
                        }`}>
                          {rec.type === 'success' 
                            ? <Brain className={`h-5 w-5 text-farmwise-success`} /> 
                            : <AlertTriangle className={`h-5 w-5 text-farmwise-warning`} />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{rec.title}</div>
                          <p className="text-sm">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-2">View All Recommendations</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Forecast</CardTitle>
                  <CardDescription>5-day forecast for your farm</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Weather forecast placeholder - would be replaced with actual chart */}
                  <div className="space-y-3">
                    {[...Array(5)].map((_, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-farmwise-sky/10">
                            <Cloud className="h-4 w-4 text-farmwise-sky" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{
                              new Date(Date.now() + (idx * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            }</div>
                            <div className="text-xs text-slate-500">Partly Cloudy</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{Math.round(20 + Math.random() * 8)}°</span>
                          <span className="text-slate-500 ml-1">{Math.round(12 + Math.random() * 5)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">View Detailed Forecast</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Crop Status</CardTitle>
                  <CardDescription>Current status of your crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Crops</TabsTrigger>
                      <TabsTrigger value="issues">Needs Attention</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="space-y-3">
                      {mockFarmData.crops.map((crop, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{crop.name}</div>
                            <div className={`text-xs ${
                              crop.status === 'Excellent' 
                                ? 'text-farmwise-success' 
                                : crop.status === 'Good' 
                                  ? 'text-farmwise-sky' 
                                  : 'text-farmwise-warning'
                            }`}>
                              {crop.status}
                            </div>
                          </div>
                          <div className="text-xs">
                            Harvest in <span className="font-medium">{crop.plannedHarvest}</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="issues" className="space-y-3">
                      {mockFarmData.crops
                        .filter(crop => crop.status === 'Needs attention')
                        .map((crop, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{crop.name}</div>
                              <div className="text-xs text-farmwise-warning">{crop.status}</div>
                            </div>
                            <div className="text-xs">
                              Harvest in <span className="font-medium">{crop.plannedHarvest}</span>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
