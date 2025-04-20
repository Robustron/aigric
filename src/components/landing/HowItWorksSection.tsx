
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add Your Farm Locations",
    description: "Enter your farm location details or use our interactive map to pinpoint your fields accurately."
  },
  {
    number: "02",
    title: "Get Weather Data",
    description: "We automatically collect real-time and historical weather data specific to your farm locations."
  },
  {
    number: "03",
    title: "AI Analysis",
    description: "Our AI system analyzes weather patterns, soil data, and crop requirements to generate insights."
  },
  {
    number: "04",
    title: "Receive Recommendations",
    description: "Access personalized recommendations for crop selection, planting times, and risk management."
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-farmwise-green-dark mb-4">
            How FarmWise AI Compass Works
          </h2>
          <p className="text-slate-600">
            A simple process to transform how you make farming decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-farmwise-green/10 rounded-lg p-6 h-full">
                <div className="text-3xl font-bold text-farmwise-green mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="text-farmwise-green h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
