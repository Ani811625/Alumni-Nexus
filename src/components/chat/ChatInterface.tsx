import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MessageType, ChatConnection } from "@/types/messages";

export default function ChatInterface() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<ChatConnection[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeChatUser, setActiveChatUser] = useState<ChatConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Subscribe to real-time updates for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as unknown as MessageType;
          // Add the new message to the messages array if it's for the active chat
          if (activeChat === newMessage.sender_id) {
            setMessages(prev => [...prev, newMessage]);
            // Mark message as read immediately if the chat is active
            supabase.from('messages')
              .update({ read: true })
              .eq('id', newMessage.id)
              .then(() => {
                console.log("Message marked as read:", newMessage.id);
              }, (err) => {
                console.error("Error marking message as read:", err);
              });
          } else {
            setConnections(prev =>
              prev.map(conn =>
                conn.id === newMessage.sender_id
                  ? {
                    ...conn,
                    unreadCount: conn.unreadCount + 1,
                    lastMessage: newMessage.content,
                    lastMessageTime: newMessage.timestamp
                  }
                  : conn
              )
            );
            toast.info(`New message from ${
              connections.find(c => c.id === newMessage.sender_id)?.name || 'Contact'
            }`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeChat, connections]);

  // Load user connections
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get all active mentor/mentee connections
        const { data: mentorships, error: mentorshipsError } = await supabase
          .from('mentorships')
          .select(`
            id,
            mentor_id,
            mentee_id,
            status
          `)
          .eq('status', 'active')
          .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`);
          
        if (mentorshipsError) throw mentorshipsError;
        
        if (!mentorships || mentorships.length === 0) {
          setLoading(false);
          return;
        }
        
        // Extract connection user IDs (the other user in each connection)
        const connectionIds = mentorships.map(m => 
          m.mentor_id === user.id ? m.mentee_id : m.mentor_id
        );

        // Fetch user details for each connection
        const { data: connectionUsers, error: usersError } = await supabase
          .from('users')
          .select('id, name, profile_image, role')
          .in('id', connectionIds);
          
        if (usersError) throw usersError;
        
        // Get last messages for each connection
        const connectionsWithMessages = await Promise.all(connectionUsers.map(async (connUser) => {
          // Get last message between users (sent by either one)
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${connUser.id}),and(sender_id.eq.${connUser.id},receiver_id.eq.${user.id})`)
            .order('timestamp', { ascending: false })
            .limit(1) as { data: MessageType[] | null };
            
          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', connUser.id)
            .eq('receiver_id', user.id)
            .eq('read', false);
            
          const lastMessage = lastMessageData && lastMessageData.length > 0 ? lastMessageData[0] : null;
          
          return {
            id: connUser.id,
            name: connUser.name,
            profileImage: connUser.profile_image,
            role: connUser.role,
            lastMessage: lastMessage ? lastMessage.content : null,
            lastMessageTime: lastMessage ? lastMessage.timestamp : null,
            unreadCount: unreadCount || 0
          };
        }));
        
        // Sort connections by last message time
        const sortedConnections = connectionsWithMessages.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });
        
        setConnections(sortedConnections);
        
        // If there are connections but no active chat, set the first one as active
        if (sortedConnections.length > 0 && !activeChat) {
          setActiveChat(sortedConnections[0].id);
          setActiveChatUser(sortedConnections[0]);
        }
        
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load your connections');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user, activeChat]);

  // Load messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !activeChat) return;
      
      try {
        // Get messages between the current user and the active chat user
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat}),and(sender_id.eq.${activeChat},receiver_id.eq.${user.id})`)
          .order('timestamp', { ascending: true }) as { data: MessageType[] | null, error: any };
          
        if (error) throw error;
        
        if (data) {
          setMessages(data);
          
          // Mark all unread messages from the active chat user as read
          const unreadMessages = data.filter(msg => 
            msg.sender_id === activeChat && 
            msg.receiver_id === user.id && 
            !msg.read
          );
          
          if (unreadMessages.length > 0) {
            console.log(`Marking ${unreadMessages.length} messages as read`);
            
            const { error: updateError } = await supabase
              .from('messages')
              .update({ read: true })
              .in('id', unreadMessages.map(msg => msg.id));
              
            if (updateError) {
              console.error("Error marking messages as read:", updateError);
            } else {
              console.log("Successfully marked messages as read");
              
              // Update the unread count for this connection to zero
              setConnections(prev => 
                prev.map(conn => 
                  conn.id === activeChat 
                    ? { ...conn, unreadCount: 0 }
                    : conn
                )
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };
    
    fetchMessages();
  }, [user, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeChat || !messageInput.trim()) return;
    
    setSendingMessage(true);
    
    try {
      // Insert the message into the database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeChat,
          content: messageInput.trim(),
          read: false
        })
        .select() as { data: MessageType[] | null, error: any };
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Add the new message to the messages array
        setMessages(prev => [...prev, data[0]]);
        setMessageInput('');
        
        // Update the last message for this connection
        setConnections(prev => 
          prev.map(conn => 
            conn.id === activeChat 
              ? { 
                  ...conn, 
                  lastMessage: messageInput.trim(),
                  lastMessageTime: new Date().toISOString()
                }
              : conn
          )
        );
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const selectChat = (connectionId: string) => {
    setActiveChat(connectionId);
    const selectedUser = connections.find(conn => conn.id === connectionId) || null;
    setActiveChatUser(selectedUser);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[80vh] flex">
      {/* Left sidebar - connections list */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        
        <ScrollArea className="h-[calc(80vh-57px)]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-opacity-50 border-t-primary rounded-full"></div>
            </div>
          ) : connections.length > 0 ? (
            <div className="divide-y">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 flex items-center ${activeChat === connection.id ? 'bg-muted' : ''}`}
                  onClick={() => selectChat(connection.id)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    {connection.profileImage ? (
                      <AvatarImage src={connection.profileImage} alt={connection.name} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{connection.name}</h3>
                      {connection.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(connection.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {connection.lastMessage || "No messages yet"}
                      </p>
                      {connection.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                          {connection.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">No connections yet</p>
              <p className="text-sm mt-2">
                Connect with alumni and students to start chatting
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right side - chat area */}
      <div className="hidden md:flex md:flex-col md:w-2/3 lg:w-3/4">
        {activeChat && activeChatUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                {activeChatUser.profileImage ? (
                  <AvatarImage src={activeChatUser.profileImage} alt={activeChatUser.name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="font-semibold">{activeChatUser.name}</h2>
                <p className="text-xs text-muted-foreground capitalize">{activeChatUser.role}</p>
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {messages.length > 0 ? (
                  <>
                    {messages.map((message, index) => {
                      // Check if date changed compared to previous message
                      const showDateDivider = index === 0 || 
                        formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showDateDivider && (
                            <div className="flex justify-center my-4">
                              <div className="px-3 py-1 bg-muted rounded-full text-xs">
                                {formatDate(message.timestamp)}
                              </div>
                            </div>
                          )}
                          <div className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div 
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === user.id 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div 
                                className={`text-xs mt-1 ${
                                  message.sender_id === user.id 
                                    ? 'text-primary-foreground/70' 
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm mt-2">Send a message to start the conversation</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                  disabled={sendingMessage}
                />
                <Button type="submit" size="icon" disabled={!messageInput.trim() || sendingMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">Choose a connection from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
