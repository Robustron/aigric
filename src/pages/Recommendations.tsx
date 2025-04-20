
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  MapPin,
  Wheat,
  AlertTriangle,
  Check,
  CalendarDays,
  ThermometerSun,
  CloudRain,
  Leaf,
  Wind
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const mockRecommendations = [
  {
    id: 1,
    farmName: "Green Valley Farm",
    date: "April 20, 2025",
    summary: "Optimal planting conditions for wheat and barley this week. Weather patterns favor crop development.",
    crops: ["Wheat", "Barley"],
    riskLevel: "low",
    riskAlerts: [],
    recommendations: [
      "Take advantage of current soil moisture for planting wheat and barley",
      "Apply nitrogen fertilizer early morning for optimal absorption",
      "Current conditions ideal for field preparation and seeding activities"
    ]
  },
  {
    id: 2,
    farmName: "Sunrise Acres",
    date: "April 19, 2025",
    summary: "Possible dry period ahead. Consider adjusting irrigation schedules and selecting drought-tolerant crop varieties.",
    crops: ["Corn", "Alfalfa"],
    riskLevel: "medium",
    riskAlerts: [
      "Forecast shows lower than average rainfall for next 14 days",
      "Potential for minor heat stress on young corn seedlings"
    ],
    recommendations: [
      "Increase irrigation frequency but reduce water volume per session",
      "Apply mulch to retain soil moisture for newly planted crops",
      "Consider planting drought-resistant corn varieties for later plantings"
    ]
  },
  {
    id: 3,
    farmName: "Riverside Fields",
    date: "April 18, 2025",
    summary: "Heavy rain expected in 5-7 days. Risk of flooding in low-lying areas of farm. Prepare drainage systems.",
    crops: ["Berries", "Vegetables"],
    riskLevel: "high",
    riskAlerts: [
      "Heavy precipitation (50-75mm) expected April 23-25",
      "Potential flooding in sectors A3 and B2 of the farm",
      "Risk of fungal disease development in vegetable crops due to high humidity"
    ],
    recommendations: [
      "Clear drainage channels and ensure water diversion systems are operational",
      "Harvest any mature crops in low-lying areas within the next 3 days",
      "Prepare preventive fungicide application before rainfall begins",
      "Delay any planned seeding until after rain event"
    ]
  }
];

const Recommendations = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-slate-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-farmwise-green-dark">AI Recommendations</h1>
              <p className="text-slate-600">Gemini-powered insights for optimal farming decisions</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-full md:w-[200px]">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Farm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Farms</SelectItem>
                    <SelectItem value="green-valley">Green Valley Farm</SelectItem>
                    <SelectItem value="sunrise-acres">Sunrise Acres</SelectItem>
                    <SelectItem value="riverside">Riverside Fields</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-farmwise-green hover:bg-farmwise-green-dark whitespace-nowrap">
                <Brain className="h-4 w-4 mr-2" /> Generate New
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-farmwise-danger"></div>
                <span>High Risk</span>
              </TabsTrigger>
              <TabsTrigger value="medium" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-farmwise-warning"></div>
                <span>Medium Risk</span>
              </TabsTrigger>
              <TabsTrigger value="low" className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-farmwise-success"></div>
                <span>Low Risk</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-6">
            {mockRecommendations.map(rec => (
              <Card key={rec.id} className="overflow-hidden">
                <div className={`h-1 ${
                  rec.riskLevel === 'low' 
                    ? 'bg-farmwise-success' 
                    : rec.riskLevel === 'medium' 
                      ? 'bg-farmwise-warning' 
                      : 'bg-farmwise-danger'
                }`}></div>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Brain className={`h-5 w-5 ${
                          rec.riskLevel === 'low' 
                            ? 'text-farmwise-success' 
                            : rec.riskLevel === 'medium' 
                              ? 'text-farmwise-warning' 
                              : 'text-farmwise-danger'
                        }`} />
                        <CardTitle className="text-xl">{rec.farmName}</CardTitle>
                      </div>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>AI Recommendation • {rec.date}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {rec.crops.map((crop, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-farmwise-green/10 text-farmwise-green-dark px-3 py-1 rounded-full text-xs">
                          <Wheat className="h-3.5 w-3.5" />
                          {crop}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <div className="text-lg font-medium mb-2">Summary</div>
                      <p>{rec.summary}</p>
                    </div>
                    
                    {/* Weather conditions */}
                    <div>
                      <div className="text-lg font-medium mb-3">Current Conditions</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                          <div className="p-2 rounded-full bg-farmwise-sky/10">
                            <ThermometerSun className="h-4 w-4 text-farmwise-sky" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Temperature</div>
                            <div className="font-medium">{20 + Math.floor(Math.random() * 10)}°C</div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                          <div className="p-2 rounded-full bg-farmwise-sky/10">
                            <CloudRain className="h-4 w-4 text-farmwise-sky" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Humidity</div>
                            <div className="font-medium">{50 + Math.floor(Math.random() * 30)}%</div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                          <div className="p-2 rounded-full bg-farmwise-soil/10">
                            <Leaf className="h-4 w-4 text-farmwise-soil" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Soil Moisture</div>
                            <div className="font-medium">{40 + Math.floor(Math.random() * 40)}%</div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border flex items-center gap-3">
                          <div className="p-2 rounded-full bg-farmwise-sky/10">
                            <Wind className="h-4 w-4 text-farmwise-sky" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Wind</div>
                            <div className="font-medium">{Math.floor(Math.random() * 15)} km/h</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Alerts */}
                    {rec.riskAlerts.length > 0 && (
                      <div>
                        <div className="text-lg font-medium mb-3">Risk Alerts</div>
                        <div className={`p-4 rounded-lg border ${
                          rec.riskLevel === 'low' 
                            ? 'bg-farmwise-success/10 border-farmwise-success/20' 
                            : rec.riskLevel === 'medium' 
                              ? 'bg-farmwise-warning/10 border-farmwise-warning/20' 
                              : 'bg-farmwise-danger/10 border-farmwise-danger/20'
                        }`}>
                          {rec.riskAlerts.map((alert, idx) => (
                            <div key={idx} className="flex items-start gap-3 mb-2 last:mb-0">
                              <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                                rec.riskLevel === 'low' 
                                  ? 'text-farmwise-success' 
                                  : rec.riskLevel === 'medium' 
                                    ? 'text-farmwise-warning' 
                                    : 'text-farmwise-danger'
                              }`} />
                              <div>{alert}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Recommendations */}
                    <div>
                      <div className="text-lg font-medium mb-3">Recommended Actions</div>
                      <div className="space-y-3">
                        {rec.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                            <Check className="h-5 w-5 mt-0.5 text-farmwise-green" />
                            <div>{recommendation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>View Historical Data</span>
                      </Button>
                      <Button className="bg-farmwise-green hover:bg-farmwise-green-dark">Apply Recommendations</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;
