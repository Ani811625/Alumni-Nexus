
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import MentorshipRequest from "@/components/mentorship/MentorshipRequest";
import { Mentorship, User, UserRole, MentorshipStatus } from "@/types";

interface MentorshipWithUser extends Mentorship {
  mentor?: User;
  mentee?: User;
}

export default function MentorshipPage() {
  const { user } = useAuth();
  const [mentorships, setMentorships] = useState<MentorshipWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    async function fetchMentorships() {
      setLoading(true);
      
      try {
        // Get all mentorships where user is either mentor or mentee
        const { data, error } = await supabase
          .from('mentorships')
          .select('*')
          .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`);
          
        if (error) throw error;
        
        // Transform data to match our type
        const transformedMentorships: MentorshipWithUser[] = await Promise.all(
          (data || []).map(async (mentorship) => {
            // Fetch mentor and mentee user info
            const [mentorRes, menteeRes] = await Promise.all([
              supabase.from('users').select('*').eq('id', mentorship.mentor_id).single(),
              supabase.from('users').select('*').eq('id', mentorship.mentee_id).single()
            ]);
            
            return {
              id: mentorship.id,
              mentorId: mentorship.mentor_id,
              menteeId: mentorship.mentee_id,
              status: mentorship.status as MentorshipStatus, // Cast to MentorshipStatus type
              startDate: mentorship.start_date,
              endDate: mentorship.end_date,
              goals: mentorship.goals,
              notes: mentorship.notes,
              mentor: mentorRes.data ? {
                id: mentorRes.data.id,
                name: mentorRes.data.name,
                email: mentorRes.data.email,
                profileImage: mentorRes.data.profile_image,
                role: mentorRes.data.role as UserRole, // Cast to UserRole type
                joinDate: mentorRes.data.join_date,
                education: [],
                experience: [],
                skills: [],
                interests: []
              } : undefined,
              mentee: menteeRes.data ? {
                id: menteeRes.data.id,
                name: menteeRes.data.name,
                email: menteeRes.data.email,
                profileImage: menteeRes.data.profile_image,
                role: menteeRes.data.role as UserRole, // Cast to UserRole type
                joinDate: menteeRes.data.join_date,
                education: [],
                experience: [],
                skills: [],
                interests: []
              } : undefined
            };
          })
        );
        
        setMentorships(transformedMentorships);
      } catch (error) {
        console.error("Error fetching mentorships:", error);
        toast.error("Failed to load mentorship data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchMentorships();
  }, [user]);
  
  const updateMentorshipStatus = async (mentorshipId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('mentorships')
        .update({ status: newStatus })
        .eq('id', mentorshipId);
        
      if (error) throw error;
      
      // Update local state
      setMentorships(prev => 
        prev.map(m => m.id === mentorshipId ? {...m, status: newStatus as any} : m)
      );
      
      toast.success(`Mentorship ${newStatus}`);
    } catch (error) {
      console.error("Error updating mentorship:", error);
      toast.error("Failed to update mentorship");
    }
  };
  
  // Filter mentorships based on role
  const pendingRequests = mentorships.filter(m => 
    m.status === 'pending' && m.mentorId === user?.id
  );
  
  const activeMentorships = mentorships.filter(m => 
    m.status === 'active'
  );
  
  const sentRequests = mentorships.filter(m => 
    m.status === 'pending' && m.menteeId === user?.id
  );

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to access mentorship features.
              </p>
              <Button>Log In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Mentorship</h1>
      
      <Tabs defaultValue={user.role === 'alumni' ? "mentor" : "mentee"} className="space-y-8">
        <TabsList className="mb-2">
          {user.role === 'alumni' && <TabsTrigger value="mentor">As Mentor</TabsTrigger>}
          <TabsTrigger value="mentee">As Mentee</TabsTrigger>
        </TabsList>
        
        {user.role === 'alumni' && (
          <TabsContent value="mentor">
            <div className="space-y-8">
              {/* Pending Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Requests</CardTitle>
                  <CardDescription>Students who have requested your mentorship</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map(request => (
                        <Card key={request.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={request.mentee?.profileImage} />
                                <AvatarFallback>{request.mentee?.name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold">{request.mentee?.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{request.mentee?.email}</p>
                                <p className="text-sm font-medium">Goals:</p>
                                <p className="text-sm mb-2">{request.goals}</p>
                                {request.notes && (
                                  <>
                                    <p className="text-sm font-medium">Notes:</p>
                                    <p className="text-sm">{request.notes}</p>
                                  </>
                                )}
                                <div className="flex gap-2 mt-4">
                                  <Button onClick={() => updateMentorshipStatus(request.id, 'active')}>Accept</Button>
                                  <Button variant="outline" onClick={() => updateMentorshipStatus(request.id, 'rejected')}>Decline</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No pending mentorship requests.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Active Mentorships */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Mentorships</CardTitle>
                  <CardDescription>Students you are currently mentoring</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading mentorships...</p>
                    </div>
                  ) : activeMentorships.filter(m => m.mentorId === user.id).length > 0 ? (
                    <div className="space-y-4">
                      {activeMentorships
                        .filter(m => m.mentorId === user.id)
                        .map(mentorship => (
                          <Card key={mentorship.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarImage src={mentorship.mentee?.profileImage} />
                                  <AvatarFallback>{mentorship.mentee?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{mentorship.mentee?.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">{mentorship.mentee?.email}</p>
                                  <p className="text-sm font-medium">Goals:</p>
                                  <p className="text-sm">{mentorship.goals}</p>
                                  <div className="flex gap-2 mt-4">
                                    <Button variant="outline">Message</Button>
                                    <Button variant="outline" onClick={() => updateMentorshipStatus(mentorship.id, 'completed')}>End Mentorship</Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You are not mentoring any students at the moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="mentee">
          <div className="space-y-8">
            {/* Find Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Find a Mentor</CardTitle>
                <CardDescription>Connect with alumni who can guide you in your career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* These would be real mentors fetched from your database */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                          <AvatarFallback>RK</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">Rahul Kumar</h3>
                        <p className="text-sm text-muted-foreground">Software Architect at Google</p>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" asChild>
                            <a href="/mentorship/request/mentor-id-1">Request Mentorship</a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href="/profile/mentor-id-1">View Profile</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage src="https://i.pravatar.cc/150?img=26" />
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">Priya Sharma</h3>
                        <p className="text-sm text-muted-foreground">UX Designer at Amazon</p>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" asChild>
                            <a href="/mentorship/request/mentor-id-2">Request Mentorship</a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href="/profile/mentor-id-2">View Profile</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* Sent Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Sent Requests</CardTitle>
                <CardDescription>Mentorship requests you have sent</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading requests...</p>
                  </div>
                ) : sentRequests.length > 0 ? (
                  <div className="space-y-4">
                    {sentRequests.map(request => (
                      <Card key={request.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={request.mentor?.profileImage} />
                              <AvatarFallback>{request.mentor?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{request.mentor?.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">Request sent on {new Date(request.startDate || Date.now()).toLocaleDateString()}</p>
                              <p className="text-sm font-medium">Status: <span className="capitalize">{request.status}</span></p>
                              <div className="flex gap-2 mt-4">
                                <Button variant="outline" onClick={() => updateMentorshipStatus(request.id, 'cancelled')}>Cancel Request</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't sent any mentorship requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Active Mentorships */}
            <Card>
              <CardHeader>
                <CardTitle>My Mentors</CardTitle>
                <CardDescription>Your active mentorships</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 border-4 border-rajasthan-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading mentorships...</p>
                  </div>
                ) : activeMentorships.filter(m => m.menteeId === user.id).length > 0 ? (
                  <div className="space-y-4">
                    {activeMentorships
                      .filter(m => m.menteeId === user.id)
                      .map(mentorship => (
                        <Card key={mentorship.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={mentorship.mentor?.profileImage} />
                                <AvatarFallback>{mentorship.mentor?.name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold">{mentorship.mentor?.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{mentorship.mentor?.email}</p>
                                <div className="flex gap-2 mt-4">
                                  <Button variant="outline">Message</Button>
                                  <Button variant="outline" onClick={() => updateMentorshipStatus(mentorship.id, 'completed')}>End Mentorship</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You don't have any active mentors at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
