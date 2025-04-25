
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface StoredNotification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
}

export default function NotificationPopover() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notifications_${user.id}`);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    }
  }, [user]);

  // Add a new notification
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return new Date(date).toLocaleDateString();
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications}>
              Clear all
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 hover:bg-muted transition-colors"
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(new Date(notification.timestamp))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
