
export interface MessageType {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConnection {
  id: string;
  name: string;
  profileImage: string | null;
  role: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}
