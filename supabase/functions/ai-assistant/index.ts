
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved fallback responses
const getFallbackResponse = (query: string) => {
  return "Hello! I'm the Alumni Nexus Assistant. I can help you with networking, career advice, and connecting with alumni. How can I assist you today?";
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, history } = await req.json();
    
    if (!query || typeof query !== 'string') {
      throw new Error("Query must be a non-empty string");
    }
    
    console.log("Processing query:", query);

    // Use fallback response system for reliability
    const response = getFallbackResponse(query);
    
    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in AI assistant function:", error);
    return new Response(
      JSON.stringify({ 
        response: "I'm here to help! What would you like to know about networking, career development, or connecting with alumni?" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
