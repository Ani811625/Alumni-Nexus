
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { user } = useAuth();

  return (
    <Avatar className={className}>
      {user && user.profileImage ? (
        <AvatarImage src={user.profileImage} alt={user.name || 'User'} />
      ) : (
        <AvatarFallback>
          {user && user.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
