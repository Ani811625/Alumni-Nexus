import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole } from "@/types";

export type AuthFormData = {
  name?: string;
  email: string;
  password: string;
};

export type RegisterFormData = AuthFormData & {
  role: UserRole;
  // Additional registration fields
  phone?: string;
  institution?: string;
  course?: string;
  graduationYear?: string;
  enrollmentYear?: string;
  currentCompany?: string;
  designation?: string;
  interests?: string[];
  bio?: string;
  profileImage?: File;
};

export const registerUser = async (data: RegisterFormData, redirectUrl?: string) => {
  try {
    console.log("Starting user registration");
    
    // Use the provided redirectUrl or default to the current origin
    const finalRedirectUrl = redirectUrl || window.location.origin;
    console.log("Using redirect URL:", finalRedirectUrl);
    
    // Step 1: Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
        },
        emailRedirectTo: `${finalRedirectUrl}/auth/callback`,
      },
    });

    if (authError) {
      console.error("Auth error during registration:", authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.error("Registration failed: No user returned");
      throw new Error("Registration failed");
    }

    console.log("Auth signup successful:", authData.user.id);
    
    // Step 2: Insert or update user profile in the public users table
    const userProfile = {
      id: authData.user.id,
      name: data.name || '',
      email: data.email,
      role: data.role,
      profile_image: '',
      cover_image: '',
      location: '',
      bio: data.bio || '',
      join_date: new Date().toISOString()
    };
    
    console.log("Creating user profile:", { ...userProfile, id: "***hidden***" });
    
    try {
      const { error: profileError } = await supabase
        .from('users')
        .insert([userProfile]);
      
      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // We'll continue despite this error since the auth user is created
        toast.error("User created but profile data could not be saved completely");
      } else {
        console.log("User profile created successfully");
      }
    } catch (error) {
      console.error("Error inserting user profile:", error);
      toast.error("User created but profile data could not be saved");
    }

    // Upload profile image if provided
    if (data.profileImage) {
      const fileExt = data.profileImage.name.split('.').pop();
      const fileName = `${authData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
        console.log("Uploading profile image");
        
        try {
          const { data: bucketData, error: bucketError } = await supabase
            .storage.getBucket('alumni-media');
            
          if (bucketError && bucketError.message.includes('does not exist')) {
            console.log("Creating alumni-media bucket");
            await supabase.storage.createBucket('alumni-media', {
              public: true,
              fileSizeLimit: 1024 * 1024 * 2 // 2MB
            });
          }
        } catch (error) {
          console.error("Error checking/creating bucket:", error);
        }
        
        const { error: uploadError } = await supabase.storage
          .from('alumni-media')
          .upload(`profiles/${fileName}`, data.profileImage);
        
        if (uploadError) {
          console.error("Error uploading profile image:", uploadError);
          // Continue with registration even if image upload fails
        } else {
          // Get the public URL
          const { data: imageData } = supabase.storage
            .from('alumni-media')
            .getPublicUrl(`profiles/${fileName}`);
            
          // Update the user profile with the image URL
          if (imageData?.publicUrl) {
            console.log("Updating user profile with image URL");
            try {
              await supabase
                .from('users')
                .update({ profile_image: imageData.publicUrl })
                .eq('id', authData.user.id);
                
              console.log("Profile image uploaded successfully");
            } catch (error) {
              console.error("Error updating profile with image URL:", error);
            }
          }
        }
      } catch (imageError) {
        console.error("Image processing error:", imageError);
        // Continue with registration even if image processing fails
      }
    }
    
    // Store additional user data based on role
    try {
      if (data.role === 'student' && data.institution) {
        console.log("Adding student education data");
        const education = {
          user_id: authData.user.id,
          degree: data.course || '',
          institution: data.institution || '',
          field_of_study: data.course || '',
          start_year: data.enrollmentYear ? parseInt(data.enrollmentYear) : new Date().getFullYear(),
          end_year: data.graduationYear ? parseInt(data.graduationYear) : null,
          is_ongoing: data.graduationYear ? false : true,
        };
        
        try {
          await supabase
            .from('user_education')
            .insert([education]);
        } catch (error) {
          console.error("Error adding education data:", error);
        }
      }
      
      if (data.role === 'alumni' && data.currentCompany) {
        console.log("Adding alumni experience data");
        const experience = {
          user_id: authData.user.id,
          title: data.designation || 'Professional',
          company: data.currentCompany || '',
          location: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: null,
          is_ongoing: true,
          description: ''
        };
        
        try {
          await supabase
            .from('user_experience')
            .insert([experience]);
        } catch (error) {
          console.error("Error adding experience data:", error);
        }
      }
      
      // Store interests
      if (data.interests && data.interests.length > 0) {
        console.log("Adding user interests");
        try {
          const interestsEntries = data.interests.map(interest => ({
            user_id: authData.user.id,
            interests: interest
          }));
          
          await supabase
            .from('user_interests')
            .insert(interestsEntries);
        } catch (error) {
          console.error("Error adding interests:", error);
        }
      }
    } catch (additionalDataError) {
      console.error("Error saving additional user data:", additionalDataError);
      // Continue with registration even if additional data fails
    }
    
    toast.success("Registration successful! Please check your email to verify your account.");
    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const loginUser = async ({ email, password }: AuthFormData) => {
  try {
    console.log("Attempting user login");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful");
    toast.success("Login successful!");
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    console.log("Attempting user logout");
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    
    console.log("Logout successful");
    toast.success("Logged out successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Logout failed";
    toast.error(errorMessage);
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user");
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    console.log("Auth user found, fetching profile data");
    
    // Get the user profile data
    let { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      
      if (profileError.code === 'PGRST116') {
        console.log("User record not found in profiles table, creating from auth data");
        
        // Creating the profile from auth data if it doesn't exist
        const userData = user;
        const userMeta = userData.user_metadata || {};
        
        // Create basic profile
        const newProfile = {
          id: userData.id,
          name: userMeta.name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          role: userMeta.role || 'student',
          profile_image: '',
          cover_image: '',
          location: '',
          bio: '',
          join_date: new Date().toISOString()
        };
        
        console.log("Creating new user profile with data:", {
          ...newProfile,
          id: "***hidden***"
        });
        
        const { data: newProfileData, error: newProfileError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();
          
        if (newProfileError) {
          console.error("Error creating missing profile:", newProfileError);
          toast.error("Error loading user profile");
          return null;
        }
        
        console.log("Created missing user profile successfully");
        profileData = newProfileData;
      } else {
        toast.error("Error loading user profile");
        return null;
      }
    }
      
    if (!profileData) {
      console.log("No profile data found for user");
      toast.error("Could not load user profile");
      return null;
    }
    
    console.log("User profile data retrieved:", profileData);
    
    // Fetch education, experience and skills data
    const [educationResponse, experienceResponse, skillsResponse, interestsResponse] = await Promise.all([
      supabase.from('user_education').select('*').eq('user_id', user.id),
      supabase.from('user_experience').select('*').eq('user_id', user.id),
      supabase.from('user_skills').select('*').eq('user_id', user.id),
      supabase.from('user_interests').select('*').eq('user_id', user.id)
    ]);
    
    // Transform database user to match our User type
    const userProfile: User = {
      id: profileData.id,
      role: profileData.role as UserRole,
      name: profileData.name,
      email: profileData.email,
      profileImage: profileData.profile_image,
      coverImage: profileData.cover_image,
      location: profileData.location || undefined,
      bio: profileData.bio || undefined,
      joinDate: profileData.join_date,
      education: educationResponse.data ? educationResponse.data.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        fieldOfStudy: edu.field_of_study,
        startYear: edu.start_year,
        endYear: edu.end_year,
        isOngoing: edu.is_ongoing
      })) : [],
      experience: experienceResponse.data ? experienceResponse.data.map(exp => ({
        title: exp.title,
        company: exp.company,
        location: exp.location || "",
        startDate: exp.start_date,
        endDate: exp.end_date,
        isOngoing: exp.is_ongoing || false,
        description: exp.description || ""
      })) : [],
      skills: skillsResponse.data ? skillsResponse.data.map(skill => ({
        name: skill.name,
        level: skill.level as "beginner" | "intermediate" | "advanced" | "expert"
      })) : [],
      interests: interestsResponse.data ? interestsResponse.data.map(interest => interest.interests) : []
    };
      
    console.log("User profile constructed successfully:", {
      id: userProfile.id,
      name: userProfile.name,
      role: userProfile.role
    });
    return userProfile;
  } catch (error) {
    console.error("Error fetching current user:", error);
    toast.error("Failed to load user data");
    return null;
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    console.log("Sending password reset email");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    
    console.log("Password reset email sent");
    toast.success("Password reset email sent");
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send password reset email";
    toast.error(errorMessage);
    return { success: false, error };
  }
};
