
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Check, X, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from 'react-router-dom';

type SearchUser = {
  id: string;
  name: string;
  role: string;
  email: string;
  profile_image: string;
  bio: string;
  connectionStatus?: 'none' | 'pending' | 'connected' | 'outgoing';
};

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  // Load users matching search term
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        // Search for users by name or email
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`name.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) {
          throw error;
        }

        if (data) {
          // Filter out current user
          const filteredUsers = data.filter(
            (user) => user.id !== currentUser?.id
          );

          // Check connection status for each user
          const usersWithConnectionStatus = await Promise.all(
            filteredUsers.map(async (user) => {
              // Check if there's a connection request from current user to this user
              const { data: outgoingRequest } = await supabase
                .from('mentorships')
                .select('*')
                .eq('mentor_id', user.id)
                .eq('mentee_id', currentUser?.id)
                .maybeSingle();

              // Check if there's a connection request from this user to current user
              const { data: incomingRequest } = await supabase
                .from('mentorships')
                .select('*')
                .eq('mentor_id', currentUser?.id)
                .eq('mentee_id', user.id)
                .maybeSingle();

              let connectionStatus: 'none' | 'pending' | 'connected' | 'outgoing' = 'none';
              
              if (outgoingRequest) {
                connectionStatus = outgoingRequest.status === 'active' 
                  ? 'connected' 
                  : 'outgoing';
              } else if (incomingRequest) {
                connectionStatus = incomingRequest.status === 'active' 
                  ? 'connected' 
                  : 'pending';
              }

              return {
                ...user,
                connectionStatus
              };
            })
          );

          setUsers(usersWithConnectionStatus);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentUser]);

  const handleConnection = async (targetUser: SearchUser) => {
    if (!currentUser) {
      toast.error('You need to be logged in to connect with users');
      return;
    }

    try {
      switch (targetUser.connectionStatus) {
        case 'none':
          // Send connection request
          const { error: requestError } = await supabase
            .from('mentorships')
            .insert({
              mentor_id: targetUser.id,
              mentee_id: currentUser.id,
              goals: `I would like to connect with you`,
              status: 'pending'
            });

          if (requestError) throw requestError;

          // Create notification for the target user
          await supabase
            .from('notifications')
            .insert({
              user_id: targetUser.id,
              type: 'mentorship_request',
              content: `${currentUser.name} would like to connect with you`,
              link_to: `/profile/${currentUser.id}`
            });

          toast.success(`Connection request sent to ${targetUser.name}`);
          
          // Update the user's connection status in the UI
          setUsers(users.map(user => 
            user.id === targetUser.id 
              ? { ...user, connectionStatus: 'outgoing' } 
              : user
          ));
          break;

        case 'pending':
          // Accept connection request
          const { error: acceptError } = await supabase
            .from('mentorships')
            .update({ status: 'active' })
            .eq('mentor_id', currentUser.id)
            .eq('mentee_id', targetUser.id);

          if (acceptError) throw acceptError;

          // Create notification for the accepted user
          await supabase
            .from('notifications')
            .insert({
              user_id: targetUser.id,
              type: 'mentorship_request',
              content: `${currentUser.name} accepted your connection request`,
              link_to: `/profile/${currentUser.id}`
            });

          toast.success(`You are now connected with ${targetUser.name}`);
          
          // Update the user's connection status in the UI
          setUsers(users.map(user => 
            user.id === targetUser.id 
              ? { ...user, connectionStatus: 'connected' } 
              : user
          ));
          break;

        case 'outgoing':
          // Cancel outgoing request
          const { error: cancelError } = await supabase
            .from('mentorships')
            .delete()
            .eq('mentor_id', targetUser.id)
            .eq('mentee_id', currentUser.id)
            .eq('status', 'pending');

          if (cancelError) throw cancelError;
          
          toast.success(`Connection request to ${targetUser.name} cancelled`);
          
          // Update the user's connection status in the UI
          setUsers(users.map(user => 
            user.id === targetUser.id 
              ? { ...user, connectionStatus: 'none' } 
              : user
          ));
          break;

        case 'connected':
          // Go to chat - we'll implement the navigation later
          toast.success(`Redirecting to chat with ${targetUser.name}...`);
          // For now, just inform the user
          break;
      }
    } catch (error) {
      console.error('Error handling connection:', error);
      toast.error('Failed to process your connection request');
    }
  };

  const renderConnectionButton = (targetUser: SearchUser) => {
    switch (targetUser.connectionStatus) {
      case 'none':
        return (
          <Button 
            onClick={() => handleConnection(targetUser)} 
            size="sm" 
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </Button>
        );
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleConnection(targetUser)} 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        );
      case 'outgoing':
        return (
          <Button 
            onClick={() => handleConnection(targetUser)} 
            variant="secondary" 
            size="sm"
            className="w-full"
          >
            Cancel Request
          </Button>
        );
      case 'connected':
        return (
          <Button 
            onClick={() => handleConnection(targetUser)} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Find People</h1>
        <p className="text-muted-foreground">
          Search for alumni, students, and faculty to connect with
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-opacity-50 border-t-primary rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14">
                    {user.profile_image ? (
                      <AvatarImage src={user.profile_image} alt={user.name} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Link to={`/profile/${user.id}`} className="font-semibold hover:underline">
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <p className="text-sm line-clamp-2">
                  {user.bio || "No bio available"}
                </p>
              </CardContent>
              <CardFooter className="border-t p-3">
                {renderConnectionButton(user)}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : searchTerm.length > 1 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found. Try a different search term.</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Start typing to search for users</p>
        </div>
      )}
    </div>
  );
}
