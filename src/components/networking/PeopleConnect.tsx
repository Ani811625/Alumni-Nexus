
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, MessageSquare, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

type ConnectionStatus = "none" | "pending" | "connected";

type NetworkUser = {
  id: string;
  name: string;
  role: string;
  profile_image?: string;
  connectionStatus: ConnectionStatus;
  connectionId?: string;
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const PeopleConnect = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch user connections
  const { data: connectionsData, isLoading: loadingConnections, refetch: refetchConnections } = useQuery({
    queryKey: ['my-connections', user?.id],
    queryFn: async () => {
      if (!user?.id) return { connections: [] };
      
      try {
        // Get outgoing connections (where user is mentee)
        const { data: outgoingConnections, error: outError } = await supabase
          .from('mentorships')
          .select('id, status, mentor_id')
          .eq('mentee_id', user.id);
          
        if (outError) throw outError;
        
        // Get incoming connections (where user is mentor)
        const { data: incomingConnections, error: inError } = await supabase
          .from('mentorships')
          .select('id, status, mentee_id')
          .eq('mentor_id', user.id);
          
        if (inError) throw inError;
        
        // Get user details for outgoing connections
        const outgoingUserIds = outgoingConnections?.map(conn => conn.mentor_id) || [];
        const { data: outgoingUsers, error: outUsersError } = outgoingUserIds.length > 0 
          ? await supabase.from('users').select('id, name, role, profile_image').in('id', outgoingUserIds)
          : { data: [], error: null };
          
        if (outUsersError) throw outUsersError;
        
        // Get user details for incoming connections
        const incomingUserIds = incomingConnections?.map(conn => conn.mentee_id) || [];
        const { data: incomingUsers, error: inUsersError } = incomingUserIds.length > 0
          ? await supabase.from('users').select('id, name, role, profile_image').in('id', incomingUserIds)
          : { data: [], error: null };
          
        if (inUsersError) throw inUsersError;
        
        // Format outgoing connections
        const formattedOutgoing = outgoingConnections?.map(conn => {
          const userData = outgoingUsers?.find(u => u.id === conn.mentor_id);
          if (!userData) return null;
          
          return {
            id: userData.id,
            name: userData.name,
            role: userData.role,
            profile_image: userData.profile_image,
            connectionStatus: conn.status === 'active' ? 'connected' as ConnectionStatus : 'pending' as ConnectionStatus,
            connectionId: conn.id
          };
        }).filter(Boolean) || [];
        
        // Format incoming connections
        const formattedIncoming = incomingConnections?.map(conn => {
          const userData = incomingUsers?.find(u => u.id === conn.mentee_id);
          if (!userData) return null;
          
          return {
            id: userData.id,
            name: userData.name,
            role: userData.role,
            profile_image: userData.profile_image,
            connectionStatus: conn.status === 'active' ? 'connected' as ConnectionStatus : 'pending' as ConnectionStatus,
            connectionId: conn.id
          };
        }).filter(Boolean) || [];
        
        // Combine connections
        const allConnections = [...formattedOutgoing, ...formattedIncoming];
        
        return { connections: allConnections };
      } catch (error) {
        console.error("Error fetching connections:", error);
        toast.error("Failed to load connections");
        return { connections: [] };
      }
    },
    enabled: !!user?.id
  });
  
  // Filter connections based on search term
  const filteredConnections = searchTerm.trim() === ''
    ? connectionsData?.connections || []
    : (connectionsData?.connections || []).filter(
        connection => connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     connection.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const handleConnectionAction = async (networkUser: NetworkUser) => {
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return;
    }
    
    try {
      switch (networkUser.connectionStatus) {
        case "pending":
          // Accept connection request
          if (networkUser.connectionId) {
            const { error } = await supabase
              .from('mentorships')
              .update({ status: 'active' })
              .eq('id', networkUser.connectionId);
              
            if (error) throw error;
            
            // Create notification
            await supabase
              .from('notifications')
              .insert({
                user_id: networkUser.id,
                type: 'connection_accepted',
                content: `${user.name || 'A user'} accepted your connection request`,
                link_to: `/profile/${user.id}`
              });
              
            toast.success(`You are now connected with ${networkUser.name}`);
            refetchConnections();
          }
          break;
          
        case "connected":
          // Open chat
          toast.success(`Opening chat with ${networkUser.name}`);
          break;
          
        default:
          toast.error("Invalid connection status");
          break;
      }
    } catch (error) {
      console.error("Error managing connection:", error);
      toast.error("Failed to perform action");
    }
  };

  const getConnectionButtonText = (status: ConnectionStatus) => {
    switch (status) {
      case "none":
        return (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </>
        );
      case "pending":
        return "Accept Request";
      case "connected":
        return "Message";
      default:
        return "Connect";
    }
  };

  const getConnectionButtonVariant = (status: ConnectionStatus): "default" | "outline" | "secondary" => {
    switch (status) {
      case "none":
        return "default";
      case "pending":
        return "secondary";
      case "connected":
        return "outline";
      default:
        return "default";
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Sign in to view connections</h2>
        <p className="text-muted-foreground mb-4">You need to be logged in to see your connections.</p>
        <Button asChild>
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Connections</h1>
        <p className="text-muted-foreground">
          View and manage your connections with alumni, students, and faculty
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search connections..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loadingConnections ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading connections...</p>
        </div>
      ) : filteredConnections.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredConnections.map((connection) => (
            <motion.div key={connection.id} variants={item}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      {connection.profile_image ? (
                        <AvatarImage src={connection.profile_image} alt={connection.name} />
                      ) : (
                        <AvatarFallback>
                          {connection.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <Link to={`/profile/${connection.id}`} className="font-semibold hover:text-rajasthan-blue transition-colors">
                        {connection.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{connection.role}</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {connection.connectionStatus === 'pending' ? 'Request Pending' : connection.connectionStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="border-t flex justify-between p-3">
                  <Button
                    variant={getConnectionButtonVariant(connection.connectionStatus)}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleConnectionAction(connection)}
                  >
                    {getConnectionButtonText(connection.connectionStatus)}
                  </Button>
                  {connection.connectionStatus === "connected" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      asChild
                    >
                      <Link to={`/chat?userId=${connection.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium">No connections yet</h3>
          <p className="text-muted-foreground mb-4">Start connecting with others to build your network</p>
          <Button asChild>
            <Link to="/network?tab=search">Find People</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PeopleConnect;
