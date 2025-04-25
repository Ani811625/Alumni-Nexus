
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Pencil } from "lucide-react";
import { UserExperience } from "@/types";

interface ProfileExperienceProps {
  experience: UserExperience[];
  isOwnProfile: boolean;
  onAddExperience?: (experience: UserExperience) => Promise<void>;
}

export function ProfileExperience({ experience, isOwnProfile, onAddExperience }: ProfileExperienceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experience
          </div>
          {isOwnProfile && (
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Add Experience
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {experience.length > 0 ? (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.startDate).toLocaleDateString()} - 
                      {exp.isOngoing ? ' Present' : ` ${new Date(exp.endDate!).toLocaleDateString()}`}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-sm">{exp.description}</p>
                    )}
                  </div>
                  {isOwnProfile && (
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No experience added yet</p>
            {isOwnProfile && (
              <Button variant="outline" className="mt-4">
                Add Experience
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
