
import React from "react";
import AIChatAssistant from "@/components/chat/AIChatAssistant";

export function AIAssistant() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-rajasthan-blue">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get guidance on networking, career development, and more from our AI assistant
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <AIChatAssistant />
      </div>
    </div>
  );
}

export default AIAssistant;
