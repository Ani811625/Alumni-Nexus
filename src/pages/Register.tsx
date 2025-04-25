
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { UserRole } from "@/types";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    institution: "",
    course: "",
    enrollmentYear: "",
    graduationYear: "",
    currentCompany: "",
    designation: "",
    bio: "",
    profileImage: null as File | null,
    interests: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, id } = e.target;
    const interest = id.replace('interest-', '');
    
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.name.trim()) {
        toast.error("Please enter your full name");
        return;
      }
      if (!formData.email.trim()) {
        toast.error("Please enter your email");
        return;
      }
      if (!formData.password) {
        toast.error("Please enter a password");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { success, error } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
        phone: formData.phone,
        institution: formData.institution,
        course: formData.course,
        enrollmentYear: formData.enrollmentYear,
        graduationYear: formData.graduationYear,
        currentCompany: formData.currentCompany,
        designation: formData.designation,
        bio: formData.bio,
        profileImage: formData.profileImage || undefined,
        interests: formData.interests,
      });

      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join Alumni Nexus to connect with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <RadioGroup 
                    defaultValue={userType} 
                    className="grid grid-cols-2 gap-4" 
                    onValueChange={(value) => setUserType(value as UserRole)}
                  >
                    <div>
                      <RadioGroupItem 
                        value="student" 
                        id="student" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="student"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-rajasthan-blue [&:has([data-state=checked])]:border-rajasthan-blue"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                        Student
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="alumni" 
                        id="alumni" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="alumni"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-rajasthan-blue [&:has([data-state=checked])]:border-rajasthan-blue"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-3 h-6 w-6"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                          <path d="m9 16 2 2 4-4" />
                        </svg>
                        Alumni
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                
                {userType === "student" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution/College</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="Rajasthan Technical University"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Course/Program</Label>
                      <Input
                        id="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="B.Tech Computer Science"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                        <Select onValueChange={(value) => handleSelectChange("enrollmentYear", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Expected Graduation</Label>
                        <Select onValueChange={(value) => handleSelectChange("graduationYear", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Graduated From</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="Rajasthan Technical University"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Degree/Program</Label>
                      <Input
                        id="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="B.Tech Computer Science"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Select onValueChange={(value) => handleSelectChange("graduationYear", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentCompany">Current Company</Label>
                        <Input
                          id="currentCompany"
                          value={formData.currentCompany}
                          onChange={handleInputChange}
                          placeholder="Company name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="designation">Current Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="Software Engineer"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interests">Areas of Interest</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select areas you're interested in to help us match you with relevant connections and content.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Artificial Intelligence",
                      "Web Development",
                      "Mobile Apps",
                      "Data Science",
                      "Cybersecurity",
                      "Cloud Computing",
                      "Blockchain",
                      "IoT",
                      "Machine Learning",
                      "Robotics"
                    ].map(interest => (
                      <div key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                          className="rounded border-gray-300"
                          onChange={handleInterestChange}
                          checked={formData.interests.includes(interest.toLowerCase().replace(/\s+/g, '-'))}
                        />
                        <label htmlFor={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm">
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Brief Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </form>
          
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} type="button" disabled={loading}>Previous</Button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <Button 
                className="bg-rajasthan-blue hover:bg-rajasthan-blue/90" 
                onClick={nextStep}
                type="button"
              >
                Continue
              </Button>
            ) : (
              <Button 
                className="bg-rajasthan-blue hover:bg-rajasthan-blue/90"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-${s === step ? "8" : "4"} rounded-full ${
                    s === step ? "bg-rajasthan-blue" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={loading}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" disabled={loading}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M9.37,17.51c-3.52,0-6.37-2.89-6.37-6.46c0-3.56,2.85-6.46,6.37-6.46c1.69,0,3.19,0.65,4.33,1.71l-1.77,1.81C11,7.38,10.22,7.03,9.37,7.03c-2.18,0-3.96,1.8-3.96,4.03c0,2.23,1.78,4.03,3.96,4.03c1.21,0,2.08-0.42,2.73-1.07c0.58-0.59,0.93-1.39,1.05-2.44H9.37V9.91h5.23c0.07,0.34,0.11,0.73,0.11,1.17c0,1.19-0.33,2.65-1.4,3.69C12.31,16.04,11.07,17.51,9.37,17.51z M20.71,12.01c0.65,0,1.17-0.53,1.17-1.18C21.88,10.18,21.35,9.66,20.71,9.66C20.06,9.66,19.54,10.18,19.54,10.83c0,0,0,0,0,0C19.54,11.48,20.06,12.01,20.71,12.01z M15.76,12.01c0.65,0,1.17-0.53,1.17-1.18c0-0.65-0.53-1.17-1.17-1.17c-0.65,0-1.17,0.53-1.17,1.17c0,0,0,0,0,0C14.58,11.48,15.11,12.01,15.76,12.01z"
                  fill="#000000"
                />
              </svg>
              Aadhaar
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-rajasthan-blue hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
