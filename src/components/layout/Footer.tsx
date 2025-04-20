
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-farmwise-green-dark text-white py-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">FarmWise AI Compass</span>
            </div>
            <p className="text-sm text-white/80">
              Empowering farmers with AI-powered insights for smarter agricultural decisions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-white/80 hover:text-white">Home</a></li>
              <li><a href="/dashboard" className="text-sm text-white/80 hover:text-white">Dashboard</a></li>
              <li><a href="/farms" className="text-sm text-white/80 hover:text-white">My Farms</a></li>
              <li><a href="/weather" className="text-sm text-white/80 hover:text-white">Weather Data</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/80 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-4 border-t border-white/20 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} FarmWise AI Compass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
