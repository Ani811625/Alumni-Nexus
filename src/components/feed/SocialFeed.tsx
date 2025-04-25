
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThumbsUp, MessageSquare, Share2, Send, User, Image, Link, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Post type for the feed
type Post = {
  id: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
};

type Comment = {
  id: string;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  content: string;
  createdAt: Date;
};

// Sample data for demonstration
const samplePosts: Post[] = [
  {
    id: "post1",
    author: {
      id: "user1",
      name: "Ananya Sharma",
      profileImage: "https://i.pravatar.cc/150?img=1",
    },
    content: "Just completed my internship at Microsoft! Looking forward to new opportunities in AI development. Anyone hiring in Bangalore?",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    likes: 24,
    comments: [
      {
        id: "comment1",
        author: {
          id: "user2",
          name: "Rahul Patel",
          profileImage: "https://i.pravatar.cc/150?img=2",
        },
        content: "Congratulations! I'm actually looking for AI engineers at my startup. DM me!",
        createdAt: new Date(Date.now() - 60000), // 1 hour ago
      },
    ],
    hasLiked: false,
  },
  {
    id: "post2",
    author: {
      id: "user3",
      name: "Dr. Priya Gupta",
      profileImage: "https://i.pravatar.cc/150?img=3",
    },
    content: "Excited to announce that my research paper on sustainable energy solutions has been accepted at the International Climate Conference 2025! This has been a three-year journey and I'm grateful to all my co-researchers and students who contributed.",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    likes: 57,
    comments: [
      {
        id: "comment2",
        author: {
          id: "user4",
          name: "Amit Kumar",
          profileImage: "https://i.pravatar.cc/150?img=4",
        },
        content: "Congratulations, Professor! Your work is inspiring a new generation of climate scientists.",
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        id: "comment3",
        author: {
          id: "user5",
          name: "Neha Singh",
          profileImage: "https://i.pravatar.cc/150?img=5",
        },
        content: "Will the paper be available in the university repository? Would love to read it.",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
    ],
    hasLiked: true,
  },
];

const SocialFeed = () => {
  const { user, isGuest } = useAuth();
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get data from localStorage on component mount
  useEffect(() => {
    const storedPosts = localStorage.getItem("socialFeedPosts");
    if (storedPosts) {
      try {
        // Parse the stored posts and convert date strings back to Date objects
        const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })),
        }));
        setPosts(parsedPosts);
      } catch (error) {
        console.error("Error parsing stored posts:", error);
        setPosts(samplePosts);
      }
    }
  }, []);

  // Save data to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem("socialFeedPosts", JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    if (!user) {
      toast.error("You need to log in to post");
      return;
    }

    const newPost: Post = {
      id: uuidv4(),
      author: {
        id: user.id,
        name: user.name || "Anonymous User",
        profileImage: user.profileImage,
      },
      content: newPostContent,
      createdAt: new Date(),
      likes: 0,
      comments: [],
      hasLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setDialogOpen(false);
    toast.success("Post created successfully");
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const content = newCommentContent[postId];
    if (!content || !content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!user) {
      toast.error("You need to log in to comment");
      return;
    }

    const newComment: Comment = {
      id: uuidv4(),
      author: {
        id: user.id,
        name: user.name || "Anonymous User",
        profileImage: user.profileImage,
      },
      content: content,
      createdAt: new Date(),
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    // Clear the comment input for this post
    setNewCommentContent({
      ...newCommentContent,
      [postId]: "",
    });
  };

  const toggleComments = (postId: string) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId],
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Create Post Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Avatar>
              {user && user.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.name || "User"} />
              ) : (
                <User className="h-6 w-6" />
              )}
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground bg-muted/50 h-12 px-4"
                >
                  What's on your mind?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a post</DialogTitle>
                  <DialogDescription>
                    Share your thoughts with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-start gap-4 mt-4">
                  <Avatar>
                    {user && user.profileImage ? (
                      <AvatarImage
                        src={user.profileImage}
                        alt={user.name || "User"}
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user?.name || "Guest User"}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                    </div>
                  </div>
                </div>
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={5}
                  className="mt-2"
                />
                <div className="flex items-center justify-between p-2 border rounded-md mt-4">
                  <p className="text-sm">Add to your post</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-green-500">
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-blue-500">
                      <Link className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-rajasthan-blue"
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="border-t flex justify-around py-2">
          <Button
            variant="ghost"
            className="flex-1 gap-1"
            onClick={() => setDialogOpen(true)}
          >
            <Image className="h-5 w-5" />
            <span>Photo</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 gap-1"
            onClick={() => setDialogOpen(true)}
          >
            <Link className="h-5 w-5" />
            <span>Link</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                {post.author.profileImage ? (
                  <AvatarImage
                    src={post.author.profileImage}
                    alt={post.author.name}
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <AvatarFallback>
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.author.id === "user3" ? "Professor • Computer Science" : "Student • Engineering"}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="border-t flex flex-col p-0">
              <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
                <span>{post.likes} likes</span>
                <span>{post.comments.length} comments</span>
              </div>
              <div className="border-t flex justify-around">
                <Button
                  variant="ghost"
                  className={`flex-1 gap-1 ${
                    post.hasLiked ? "text-rajasthan-blue" : ""
                  }`}
                  onClick={() => handleLikePost(post.id)}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>Like</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 gap-1"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Comment</span>
                </Button>
                <Button variant="ghost" className="flex-1 gap-1">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </div>

              {/* Comments section */}
              {showComments[post.id] && (
                <div className="border-t p-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-2 mb-4 last:mb-0"
                    >
                      <Avatar className="h-8 w-8">
                        {comment.author.profileImage ? (
                          <AvatarImage
                            src={comment.author.profileImage}
                            alt={comment.author.name}
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-xl px-4 py-2">
                          <p className="font-medium text-sm">
                            {comment.author.name}
                          </p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1 ml-2">
                          <button>Like</button>
                          <button>Reply</button>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add new comment */}
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      {user && user.profileImage ? (
                        <AvatarImage
                          src={user.profileImage}
                          alt={user.name || "User"}
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={newCommentContent[post.id] || ""}
                        onChange={(e) =>
                          setNewCommentContent({
                            ...newCommentContent,
                            [post.id]: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newCommentContent[post.id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
