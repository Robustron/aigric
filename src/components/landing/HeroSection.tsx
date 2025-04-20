
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-farmwise-green-light/20 to-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-farmwise-green-dark mb-4">
              Smart Farming with AI-Powered Insights
            </h1>
            <p className="text-lg md:text-xl text-slate-700 mb-6">
              FarmWise AI Compass helps farmers make data-driven decisions by combining weather data, 
              AI recommendations, and crop analytics all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-farmwise-green hover:bg-farmwise-green-dark text-lg px-6 py-6">
                Get Started
              </Button>
              <Button variant="outline" className="text-lg px-6 py-6">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="bg-farmwise-success/20 text-farmwise-success px-3 py-1 rounded-full font-medium text-sm">
                Weather Analysis
              </div>
              <div className="bg-farmwise-sky/20 text-farmwise-sky-dark px-3 py-1 rounded-full font-medium text-sm">
                Crop Insights
              </div>
              <div className="bg-farmwise-soil/20 text-farmwise-soil-dark px-3 py-1 rounded-full font-medium text-sm">
                AI Recommendations
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Aerial view of farmland" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-6">
                <div className="text-white text-sm md:text-base">
                  <div className="font-bold">Green Valley Farm</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-farmwise-success"></div>
                    <span>Optimal growing conditions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-farmwise-sky flex items-center justify-center text-white font-bold">
                28°
              </div>
              <div>
                <div className="text-xs text-slate-500">Current weather</div>
                <div className="font-medium">Sunny, light wind</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border">
              <div className="text-xs text-slate-500">AI Recommendation</div>
              <div className="font-medium text-farmwise-green">Perfect day for planting wheat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
