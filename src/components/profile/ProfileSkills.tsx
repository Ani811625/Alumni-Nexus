
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Pencil } from "lucide-react";
import { UserSkill } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileSkillsProps {
  skills: UserSkill[];
  isOwnProfile: boolean;
  onAddSkill?: (skill: UserSkill) => Promise<void>;
}

export function ProfileSkills({ skills = [], isOwnProfile, onAddSkill }: ProfileSkillsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | "expert">("intermediate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log("ProfileSkills - Rendering with skills:", skills);
  
  const handleAddSkill = async () => {
    if (!onAddSkill || !newSkillName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newSkill: UserSkill = {
        name: newSkillName.trim(),
        level: newSkillLevel
      };
      
      await onAddSkill(newSkill);
      setNewSkillName("");
      setNewSkillLevel("intermediate");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Skills
          </div>
          {isOwnProfile && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Add Skills
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(skills) && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="px-3 py-1 rounded-full bg-muted text-sm flex items-center gap-1"
              >
                {skill.name}
                <span className="text-xs text-muted-foreground">({skill.level})</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No skills added yet</p>
            {isOwnProfile && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                Add Skills
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Add Skills Dialog */}
      {isOwnProfile && onAddSkill && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Skill</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g., JavaScript, Project Management, etc."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="skillLevel">Proficiency Level</Label>
                <Select 
                  value={newSkillLevel} 
                  onValueChange={(value) => setNewSkillLevel(value as any)}
                >
                  <SelectTrigger id="skillLevel">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-2" />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSkill} 
                  disabled={!newSkillName.trim() || isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Skill"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
