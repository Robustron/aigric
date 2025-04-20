
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search, Wheat, Cloud, ThermometerSun } from "lucide-react";

const mockFarms = [
  {
    id: 1,
    name: "Green Valley Farm",
    location: "California, USA",
    coordinates: "37.7749° N, 122.4194° W",
    crops: ["Wheat", "Corn", "Soybeans"],
    weather: "Sunny, 24°C",
    lastUpdated: "10 minutes ago",
    status: "optimal"
  },
  {
    id: 2,
    name: "Sunrise Acres",
    location: "Iowa, USA",
    coordinates: "41.8780° N, 93.0977° W",
    crops: ["Corn", "Alfalfa"],
    weather: "Partly Cloudy, 22°C",
    lastUpdated: "25 minutes ago",
    status: "good"
  },
  {
    id: 3,
    name: "Riverside Fields",
    location: "Oregon, USA",
    coordinates: "43.8041° N, 120.5542° W",
    crops: ["Berries", "Vegetables"],
    weather: "Light Rain, 18°C",
    lastUpdated: "5 minutes ago",
    status: "attention"
  }
];

const Farms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-slate-50 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-farmwise-green-dark">My Farms</h1>
              <p className="text-slate-600">Manage your farm locations and view their status</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search farms..."
                  className="pl-9 w-full md:w-[250px]"
                />
              </div>
              <Button className="bg-farmwise-green hover:bg-farmwise-green-dark whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" /> Add Farm
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFarms.map(farm => (
              <Card key={farm.id} className="overflow-hidden">
                <div className={`h-2 ${
                  farm.status === 'optimal' 
                    ? 'bg-farmwise-success' 
                    : farm.status === 'good' 
                      ? 'bg-farmwise-sky' 
                      : 'bg-farmwise-warning'
                }`}></div>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl">{farm.name}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  </CardTitle>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {farm.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {farm.crops.map((crop, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-farmwise-green/10 text-farmwise-green-dark px-2 py-0.5 rounded-full text-xs">
                        <Wheat className="h-3.5 w-3.5" />
                        {crop}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-farmwise-sky/10">
                        <Cloud className="h-4 w-4 text-farmwise-sky" />
                      </div>
                      <div className="text-sm">{farm.weather}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Updated {farm.lastUpdated}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">View Details</Button>
                    <Button variant="outline" className="flex-1">Weather Data</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add new farm card */}
            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center">
              <div className="p-3 rounded-full bg-farmwise-green/10 mb-4">
                <Plus className="h-6 w-6 text-farmwise-green" />
              </div>
              <h3 className="font-medium mb-2">Add New Farm</h3>
              <p className="text-sm text-slate-500 mb-4">
                Track weather and get recommendations for a new location
              </p>
              <Button className="bg-farmwise-green hover:bg-farmwise-green-dark">
                Add Farm Location
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Farms;
