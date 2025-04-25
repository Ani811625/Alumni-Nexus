
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/context/AuthContext';

export default function Chat() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto my-6 px-4">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Sign in to chat</h2>
            <p className="text-muted-foreground">You need to be logged in to access your messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-6 px-4">
      <ChatInterface />
    </div>
  );
}
