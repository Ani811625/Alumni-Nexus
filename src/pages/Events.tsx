
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/events/EventForm";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/types";

export default function Events() {
  const { user, isGuest } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, description, date, created_at, created_by')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;
      
      if (!eventsData) {
        setEvents([]);
        return;
      }
      
      // For each event, get the creator's name
      const processedEvents = await Promise.all(eventsData.map(async (event) => {
        // Get creator name
        let creatorName = 'Unknown';
        if (event.created_by) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name')
            .eq('id', event.created_by)
            .single();
            
          if (!userError && userData) {
            creatorName = userData.name;
          }
        }
        
        // Initialize event data
        const enrichedEvent: Event = {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          created_at: event.created_at,
          created_by: event.created_by,
          creator_name: creatorName,
          participants_count: 0,
          is_joined: false
        };
        
        return enrichedEvent;
      }));
      
      // Now get participant counts for all events
      for (const event of processedEvents) {
        // Count participants using the RPC function
        const { data: count, error: countError } = await supabase
          .rpc('count_event_participants', { 
            event_id: event.id 
          } as any);
        
        if (!countError && count !== null) {
          event.participants_count = Number(count);
        }
        
        // Check if current user has joined
        if (user && !isGuest) {
          const { data: participation, error: participationError } = await supabase
            .rpc('check_event_participation', { 
              p_event_id: event.id, 
              p_user_id: user.id 
            } as any);
          
          if (!participationError) {
            event.is_joined = !!participation;
          }
        }
      }
      
      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user || isGuest) {
      toast.error('Please sign in to join events');
      return;
    }
    
    try {
      setJoinLoading(prev => ({ ...prev, [eventId]: true }));
      const event = events.find(e => e.id === eventId);
      
      if (event?.is_joined) {
        // Leave event
        const { error } = await supabase
          .rpc('leave_event', { 
            p_event_id: eventId, 
            p_user_id: user.id 
          } as any);
          
        if (error) throw error;
        
        toast.success('You have left this event');
        setEvents(events.map(e => 
          e.id === eventId 
            ? { ...e, is_joined: false, participants_count: Math.max(0, (e.participants_count || 0) - 1) } 
            : e
        ));
      } else {
        // Join event
        const { error } = await supabase
          .rpc('join_event', { 
            p_event_id: eventId, 
            p_user_id: user.id 
          } as any);
          
        if (error) throw error;
        
        toast.success('You have joined this event');
        setEvents(events.map(e => 
          e.id === eventId 
            ? { ...e, is_joined: true, participants_count: (e.participants_count || 0) + 1 }
            : e
        ));
      }
    } catch (error) {
      console.error('Error joining/leaving event:', error);
      toast.error('Failed to process your request');
    } finally {
      setJoinLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCreateSuccess = () => {
    fetchEvents();
    toast.success('Event created successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const canCreateEvent = user && !isGuest && user.role === 'alumni';

  return (
    <>
      <Helmet>
        <title>Events | ConnectEd</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Join events organized by alumni and faculty
            </p>
          </div>
          {canCreateEvent && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Share your event details. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <EventForm userId={user.id} onSuccess={handleCreateSuccess} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted/20 h-20"></CardHeader>
                <CardContent className="pt-6">
                  <div className="h-5 bg-muted w-3/4 mb-4 rounded"></div>
                  <div className="h-4 bg-muted w-1/2 mb-2 rounded"></div>
                  <div className="h-4 bg-muted w-full mb-2 rounded"></div>
                  <div className="h-4 bg-muted w-2/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {formatDate(event.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {event.participants_count || 0} joined
                    </div>
                    <div>By {event.creator_name || 'Unknown'}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={joinLoading[event.id] || isGuest}
                    variant={event.is_joined ? "outline" : "default"}
                    className="w-full"
                  >
                    {joinLoading[event.id] ? 
                      'Processing...' : 
                      event.is_joined ? 'Leave Event' : 'Join Event'
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full p-6 text-center">
            <p className="text-muted-foreground mb-4">No events found</p>
            {canCreateEvent && (
              <p className="text-sm">
                As an alumni, you can create new events for everyone to join.
              </p>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
