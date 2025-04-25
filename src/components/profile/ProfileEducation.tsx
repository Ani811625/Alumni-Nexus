
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Pencil } from "lucide-react";
import { UserEducation } from "@/types";

interface ProfileEducationProps {
  education: UserEducation[];
  isOwnProfile: boolean;
  onAddEducation?: (education: UserEducation) => Promise<void>;
}

export function ProfileEducation({ education, isOwnProfile, onAddEducation }: ProfileEducationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </div>
          {isOwnProfile && (
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-1" />
              Add Education
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {education.length > 0 ? (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startYear} - {edu.isOngoing ? 'Present' : edu.endYear}
                    </p>
                    <p className="text-sm">{edu.fieldOfStudy}</p>
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
            <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No education added yet</p>
            {isOwnProfile && (
              <Button variant="outline" className="mt-4">
                Add Education
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
