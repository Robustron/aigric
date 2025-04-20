
import { 
  Cloud, 
  Brain, 
  Map, 
  ChartArea, 
  Wheat, 
  AlertCircle 
} from "lucide-react";

const features = [
  {
    icon: <Cloud className="h-6 w-6 text-farmwise-sky" />,
    title: "Real-time Weather Tracking",
    description: "Access accurate, up-to-date weather forecasts specifically for your farm locations."
  },
  {
    icon: <Brain className="h-6 w-6 text-farmwise-green" />,
    title: "AI Crop Recommendations",
    description: "Get personalized crop suggestions based on weather patterns, soil conditions, and historical data."
  },
  {
    icon: <Map className="h-6 w-6 text-farmwise-soil" />,
    title: "Farm Location Management",
    description: "Add and manage multiple farm locations with precise geolocation tracking."
  },
  {
    icon: <ChartArea className="h-6 w-6 text-farmwise-sky-dark" />,
    title: "Data Visualization",
    description: "View interactive charts and graphs to understand weather trends and forecasts."
  },
  {
    icon: <Wheat className="h-6 w-6 text-farmwise-green-dark" />,
    title: "Crop Database",
    description: "Access information on various crops, their ideal conditions, and growing seasons."
  },
  {
    icon: <AlertCircle className="h-6 w-6 text-farmwise-warning" />,
    title: "Weather Alerts",
    description: "Receive timely alerts about extreme weather conditions that might affect your crops."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-farmwise-green-dark mb-4">
            Smart Features for Modern Farming
          </h2>
          <p className="text-slate-600">
            FarmWise AI Compass combines cutting-edge technology with agricultural expertise to help you make informed decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="mb-4 p-3 rounded-full bg-slate-100 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
