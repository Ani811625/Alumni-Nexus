
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, BookOpen, MessageSquare, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types";

interface Stats {
  unreadMessages: number;
  connections: number;
  eventsJoined: number;
  mentorshipRelations: number;
}

export default function UserDashboard() {
  const { user, isGuest } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    unreadMessages: 0,
    connections: 0,
    eventsJoined: 0,
    mentorshipRelations: 0
  });

  useEffect(() => {
    if (user && !isGuest) {
      fetchEvents();
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();
      
      // Get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, description, date, created_at, created_by')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;
      
      if (eventsData) {
        // For each event, get the creator's name
        const eventsWithCreatorNames = await Promise.all(
          eventsData.map(async (event) => {
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
            
            return {
              ...event,
              creator_name: creatorName
            };
          })
        );
        
        // Transform events data
        const events: Event[] = eventsWithCreatorNames.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          created_at: event.created_at,
          created_by: event.created_by,
          creator_name: event.creator_name,
        }));
        
        // Split into upcoming and past events
        const upcoming = events.filter(event => event.date >= today);
        const past = events.filter(event => event.date < today);
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      const [messagesResponse, mentorshipsResponse] = await Promise.all([
        supabase.from('messages').select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id).eq('read', false),
        supabase.from('mentorships').select('id', { count: 'exact', head: true })
          .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`).eq('status', 'active')
      ]);
      
      setStats({
        unreadMessages: messagesResponse.count || 0,
        connections: 0,
        eventsJoined: 0,
        mentorshipRelations: mentorshipsResponse.count || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isGuest || !user) {
    return (
      <Card className="border-dashed border-muted">
        <CardHeader className="text-center">
          <CardTitle>Welcome Guest!</CardTitle>
          <CardDescription>
            Sign up to access your personalized dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            Join ConnectEd to connect with alumni, find mentors, and attend exclusive events.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Register Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Messages waiting for your response
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/chat">View Messages</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming events you might be interested in
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/events">Browse Events</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Mentorship Relations
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mentorshipRelations}</div>
            <p className="text-xs text-muted-foreground">
              Active mentorship connections
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/mentorship">View Mentorships</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completeness
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <p className="text-xs text-muted-foreground">
              Add more details to improve visibility
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/profile">Complete Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-9">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Events happening in the future
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="animate-pulse h-16 bg-muted rounded-md" />
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {formatDate(event.date)}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/events?id=${event.id}`}>Details</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No upcoming events</p>
                      <Button asChild className="mt-2" variant="outline">
                        <Link to="/events">Browse Events</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Past Events</CardTitle>
                  <CardDescription>
                    Events that have already happened
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2].map(i => (
                        <div key={i} className="animate-pulse h-16 bg-muted rounded-md" />
                      ))}
                    </div>
                  ) : pastEvents.length > 0 ? (
                    <div className="space-y-4">
                      {pastEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {formatDate(event.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No past events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                <li>Complete your profile for better visibility.</li>
                <li>Check upcoming events and join ones that interest you.</li>
                <li>Connect with mentors or mentees for growth.</li>
                <li>Message alumni or students for networking.</li>
                <li>Stay active and check back often!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
