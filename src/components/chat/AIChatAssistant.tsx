
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const AIChatAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add a welcome message when the component mounts
    setMessages([
      {
        id: "welcome",
        content: `Hello${user?.name ? ' ' + user.name : ''}! I'm your Alumni Nexus Assistant. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  }, [user?.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare chat history for context
      const history = messages
        .filter((msg) => msg.id !== "welcome")
        .map((msg) => ({
          query: msg.sender === "user" ? msg.content : "",
          response: msg.sender === "ai" ? msg.content : "",
        }))
        .filter((item) => item.query || item.response);

      console.log("Sending request to AI assistant with query:", inputValue);
      
      // Call the AI assistant edge function
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: {
          query: userMessage.content,
          history: history,
        },
      });

      if (error) {
        console.error("Error from edge function:", error);
        throw new Error(error.message || "Failed to get response");
      }

      if (!data || !data.response) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response from AI assistant");
      }

      console.log("AI response received:", data.response);

      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: data.response,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response from AI assistant");
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          content: "I'm having trouble connecting right now. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-3xl mx-auto dark:border-gray-800">
      <CardHeader className="border-b bg-muted/50 dark:bg-gray-800/50">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-rajasthan-blue dark:text-rajasthan-turquoise" />
          Alumni Nexus Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                } animate-fade-in`}
              >
                <Avatar className={message.sender === "user" ? "bg-rajasthan-saffron" : "bg-rajasthan-blue dark:bg-rajasthan-turquoise"}>
                  {message.sender === "user" ? (
                    <UserIcon className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-rajasthan-saffron/10 dark:bg-rajasthan-saffron/20 text-right ml-auto"
                      : "bg-muted dark:bg-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
            autoFocus
          />
          <Button 
            type="submit" 
            className="bg-rajasthan-blue hover:bg-rajasthan-blue/90 dark:bg-rajasthan-turquoise dark:hover:bg-rajasthan-turquoise/90" 
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIChatAssistant;
