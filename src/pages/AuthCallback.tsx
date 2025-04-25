
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log("Processing auth callback", { hash, query });
        
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
        } else {
          console.log("Auth callback successful");
          // Clear any guest user data when a real user logs in
          localStorage.removeItem('guestUser');
          // Redirect to the dashboard
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        setError("An unexpected error occurred during authentication");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-gray-900">
      <div className="text-center">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h1>
            <p className="text-muted-foreground dark:text-gray-400">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-rajasthan-blue text-white rounded-md"
            >
              Return to login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-rajasthan-blue animate-spin" />
            <p className="mt-4 text-lg dark:text-white">Completing authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
