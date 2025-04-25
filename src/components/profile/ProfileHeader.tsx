
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, MapPin, Mail, Calendar, User } from "lucide-react";
import { User as UserType } from "@/types";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: UserType;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

export function ProfileHeader({ user, isOwnProfile, onEditClick }: ProfileHeaderProps) {
  // Add console log to debug user data
  console.log("ProfileHeader - Rendering with user:", user);
  
  if (!user) {
    console.error("No user data provided to ProfileHeader");
    return null;
  }

  return (
    <div className="relative h-48 md:h-64 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise rounded-t-xl overflow-hidden">
      {user.coverImage ? (
        <motion.img 
          src={user.coverImage} 
          alt="Cover"
          className="w-full h-full object-cover rounded-t-xl"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="absolute inset-0 bg-[url('/network-pattern.svg')] bg-repeat opacity-10"></div>
      )}
      
      {isOwnProfile && (
        <Button 
          size="sm" 
          variant="secondary"
          className="absolute top-4 right-4 z-10"
          onClick={onEditClick}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      )}
      
      <motion.div 
        className="absolute -bottom-12 left-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage src={user.profileImage} />
          <AvatarFallback className="text-xl">
            {user.name ? user.name.charAt(0) : <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 left-40 text-white z-10"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
        <div className="flex items-center gap-4 text-sm mt-1 flex-wrap">
          {user.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{user.location}</span>
            </div>
          )}
          {user.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>{user.email}</span>
            </div>
          )}
          {user.joinDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Dark overlay at the bottom for better text readability */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}
