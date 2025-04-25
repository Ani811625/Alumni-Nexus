
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home page
    navigate('/home');
  }, [navigate]);

  // This content will only be visible briefly before the redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-rajasthan-blue">Welcome to Alumni Nexus</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect with alumni, find mentors, and grow your professional network
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">For Students</h2>
            <p className="mb-4 text-muted-foreground">Connect with alumni who can guide you in your career journey.</p>
            <Button variant="outline" asChild>
              <Link to="/register">Join as Student</Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-3">For Alumni</h2>
            <p className="mb-4 text-muted-foreground">Give back to your alma mater by mentoring the next generation.</p>
            <Button className="bg-rajasthan-blue hover:bg-rajasthan-blue/90" asChild>
              <Link to="/register">Join as Alumni</Link>
            </Button>
          </div>
        </div>
        
        <p className="mb-6">
          Already a member? <Link to="/login" className="text-rajasthan-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Index;
