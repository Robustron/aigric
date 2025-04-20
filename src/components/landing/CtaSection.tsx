import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export function CtaSection() {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during Google login.",
        variant: "destructive",
      });
    }
  };

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
            <Button
              size="lg"
              className="bg-white text-farmwise-green hover:bg-white/90"
              onClick={handleGoogleLogin}
            >
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
