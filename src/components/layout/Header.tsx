
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-farmwise-green" />
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-farmwise-green-dark">FarmWise</span>
            <span className="text-xl ml-1 font-medium text-farmwise-soil-dark">AI Compass</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-farmwise-green">Home</Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-farmwise-green">Dashboard</Link>
          <Link to="/farms" className="text-sm font-medium hover:text-farmwise-green">My Farms</Link>
          <Link to="/weather" className="text-sm font-medium hover:text-farmwise-green">Weather</Link>
          <Link to="/recommendations" className="text-sm font-medium hover:text-farmwise-green">AI Recommendations</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex">Sign In</Button>
          <Button className="hidden md:flex bg-farmwise-green hover:bg-farmwise-green-dark">Sign Up</Button>
          <Button variant="ghost" className="md:hidden" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
