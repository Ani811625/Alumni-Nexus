import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEducation } from "@/components/profile/ProfileEducation";
import { ProfileExperience } from "@/components/profile/ProfileExperience";
import { ProfileSkills } from "@/components/profile/ProfileSkills";

interface UserProfileProps {
  // Add props here if needed
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user, isGuest, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);

  const handleSaveProfile = async (updatedData: any) => {
    const success = await updateUserProfile(updatedData);
    if (success) {
      setIsEditing(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-8 space-y-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            {!isEditing && !isGuest && (
              <Button onClick={handleEditProfile}>Edit Profile</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {isEditing ? (
            <ProfileEditForm
              user={user}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.profileImage || ''}
                    alt={user.name || "User Avatar"}
                  />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{user.name || "Guest User"}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.location && (
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <span className="mr-1">📍</span> {user.location}
                    </p>
                  )}
                  {user.role && (
                    <div className="mt-2">
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Joined: {user.joinDate}
                  </p>
                </div>
              </div>
              {user.bio && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{user.bio}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {!isEditing && (
        <Tabs defaultValue="education" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          </TabsList>
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileEducation education={user.education} isOwnProfile={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileExperience experience={user.experience} isOwnProfile={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileSkills skills={user.skills} isOwnProfile={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {isGuest && (
        <div className="w-full max-w-4xl mx-auto text-center">
          <Button asChild size="lg" className="mt-4">
            <Link to="/register">Register to Connect</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
