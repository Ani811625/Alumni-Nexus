
// User types
export type UserRole = "admin" | "student" | "faculty" | "alumni" | "guest";

export type UserEducation = {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number | null;
  isOngoing: boolean;
};

export type UserExperience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  description: string;
};

export type UserSkill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

export type EventType = 'webinar' | 'workshop' | 'meetup' | 'conference' | 'other';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at?: string | null;
  created_by: string | null;
  creator_name?: string;
  participants_count?: number;
  is_joined?: boolean;
};

export type EventParticipant = {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
};

export type User = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  education: UserEducation[];
  experience: UserExperience[];
  skills: UserSkill[];
  interests: string[];
};

// Mentorship types
export type MentorshipStatus = 'pending' | 'active' | 'completed' | 'rejected' | 'cancelled';

export type Mentorship = {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  startDate: string | null;
  endDate: string | null;
  goals: string;
  notes: string;
};

// Event types

export type PostType = 'discussion' | 'question' | 'announcement' | 'success_story';

export type Post = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  type: PostType;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: Comment[];
  tags: string[];
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
};

// Notification types
export type NotificationType = 'message' | 'mentorship_request' | 'event' | 'post_mention' | 'comment';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
  linkTo: string;
};

// Chat types
export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};
