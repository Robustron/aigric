
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-farmwise-green to-farmwise-green-dark text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farming Decisions?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of farmers using FarmWise AI Compass to make data-driven decisions and optimize crop yields.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-farmwise-green hover:bg-white/90">
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
