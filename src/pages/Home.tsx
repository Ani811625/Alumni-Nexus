
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Calendar, MessageSquare, Award, TrendingUp, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise py-20 md:py-28 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('/network-pattern.svg')] opacity-10"></div>
        
        {/* Animated shapes */}
        <motion.div
          className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div
          className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-white space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Connect, Share, Grow with Alumni Nexus
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Bridging the gap between alumni and students of Technical Education Department, Rajasthan for mentorship, networking, and career guidance.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button size="lg" className="bg-white text-rajasthan-blue hover:bg-white/90" asChild>
                  <Link to="/register">Join the Network</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <img 
                src="/alumni-connect.jpg" 
                alt="Students and Alumni connecting"
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80";
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="bg-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <motion.div 
              className="text-center p-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">5000+</p>
              <p className="text-sm md:text-base text-muted-foreground">Registered Alumni</p>
            </motion.div>
            <motion.div 
              className="text-center p-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">12000+</p>
              <p className="text-sm md:text-base text-muted-foreground">Current Students</p>
            </motion.div>
            <motion.div 
              className="text-center p-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">800+</p>
              <p className="text-sm md:text-base text-muted-foreground">Mentorship Connections</p>
            </motion.div>
            <motion.div 
              className="text-center p-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-rajasthan-blue">250+</p>
              <p className="text-sm md:text-base text-muted-foreground">Events Organized</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-rajasthan-blue mb-4">How Alumni Nexus Helps You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides tools and resources to foster meaningful connections and professional growth.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="bg-white border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-rajasthan-blue/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-rajasthan-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Networking</h3>
                  <p className="text-muted-foreground">
                    Connect with alumni and peers who share your interests and career goals for valuable professional relationships.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-rajasthan-saffron/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-rajasthan-saffron" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mentorship</h3>
                  <p className="text-muted-foreground">
                    Get guidance from experienced alumni who've walked your path and can offer real-world insights and advice.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="bg-white border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-rajasthan-turquoise/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-rajasthan-turquoise" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
                  <p className="text-muted-foreground">
                    Access resources, job opportunities, and professional development tools to advance your career path.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Events and Forum Preview */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="events" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-rajasthan-blue">Latest Updates</h2>
              <TabsList>
                <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                <TabsTrigger value="discussions">Recent Discussions</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="events" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* The event cards will be dynamically generated in a real application */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-rajasthan-blue/80 to-rajasthan-turquoise/80 relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                        alt="Tech Career Expo" 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">June 15, 2025</div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-rajasthan-saffron mb-1">Virtual</div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-rajasthan-blue transition-colors">Tech Career Expo 2025</h3>
                      <p className="text-sm text-muted-foreground mb-4">Join industry leaders and alumni for discussions on emerging tech careers.</p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-rajasthan-blue/80 to-rajasthan-turquoise/80 relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                        alt="Alumni Meetup" 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">July 8, 2025</div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-rajasthan-saffron mb-1">Jaipur</div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-rajasthan-blue transition-colors">Annual Alumni Meetup</h3>
                      <p className="text-sm text-muted-foreground mb-4">Network with fellow alumni and celebrate achievements from the past year.</p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <div className="aspect-video bg-gradient-to-br from-rajasthan-blue/80 to-rajasthan-turquoise/80 relative overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                        alt="AI & ML Workshop" 
                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">August 22, 2025</div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-rajasthan-saffron mb-1">Virtual</div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-rajasthan-blue transition-colors">AI & ML Workshop Series</h3>
                      <p className="text-sm text-muted-foreground mb-4">Hands-on workshops led by alumni working in artificial intelligence.</p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/events">View All Events</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="discussions" className="mt-0">
              <div className="space-y-4">
                {/* Forum discussions would be dynamically generated in a real application */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-300 hover:border-rajasthan-blue/20">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gradient-to-br from-rajasthan-blue to-rajasthan-turquoise h-10 w-10 flex items-center justify-center text-white">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Transitioning from Academia to Industry</h3>
                          <p className="text-xs text-muted-foreground">Started by Rajat K. • 2d ago • 15 replies</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-300 hover:border-rajasthan-blue/20">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gradient-to-br from-rajasthan-saffron to-rajasthan-maroon h-10 w-10 flex items-center justify-center text-white">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Advice for Internships in Software Development</h3>
                          <p className="text-xs text-muted-foreground">Started by Priya S. • 3d ago • 24 replies</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-300 hover:border-rajasthan-blue/20">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gradient-to-br from-rajasthan-turquoise to-rajasthan-blue h-10 w-10 flex items-center justify-center text-white">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Emerging Tech Opportunities in Rajasthan</h3>
                          <p className="text-xs text-muted-foreground">Started by Amit G. • 4d ago • 8 replies</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </Card>
                </motion.div>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/forum">Visit Forum</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-rajasthan-blue to-rajasthan-turquoise text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/network-pattern.svg')] opacity-5"></div>
        </div>
      
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Hear from students and alumni who have benefited from our platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-none text-white hover:bg-white/15 transition-colors duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="rounded-full bg-white/10 p-1">
                      <img
                        src="https://i.pravatar.cc/100?img=32"
                        alt="Ankit S."
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ankit S.</h3>
                      <p className="text-sm opacity-80">Software Engineer at Google</p>
                      <p className="text-xs opacity-70">Alumni, 2020</p>
                    </div>
                  </div>
                  <p className="italic opacity-90">
                    "The mentorship I received through Alumni Nexus helped me prepare for technical interviews and secure my dream job at Google. I'm now giving back by mentoring current students."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-none text-white hover:bg-white/15 transition-colors duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="rounded-full bg-white/10 p-1">
                      <img
                        src="https://i.pravatar.cc/100?img=26"
                        alt="Meera R."
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Meera R.</h3>
                      <p className="text-sm opacity-80">AI Research Scientist</p>
                      <p className="text-xs opacity-70">Alumni, 2018</p>
                    </div>
                  </div>
                  <p className="italic opacity-90">
                    "The networking events organized through Alumni Nexus connected me with researchers in my field, leading to collaborations that advanced my career in AI research."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-none text-white hover:bg-white/15 transition-colors duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="rounded-full bg-white/10 p-1">
                      <img
                        src="https://i.pravatar.cc/100?img=60"
                        alt="Rahul T."
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Rahul T.</h3>
                      <p className="text-sm opacity-80">Entrepreneur & Founder</p>
                      <p className="text-xs opacity-70">Student, Final Year</p>
                    </div>
                  </div>
                  <p className="italic opacity-90">
                    "As a student, the guidance from alumni entrepreneurs helped me launch my startup. Their experience navigating challenges was invaluable to my success."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-rajasthan-blue mb-4">Ready to Connect?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join our community of alumni and students to network, mentor, and grow together.
              </p>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button size="lg" className="bg-rajasthan-blue hover:bg-rajasthan-blue/90 transition-all duration-300" asChild>
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-muted/50 transition-all duration-300" asChild>
                <Link to="/explore">Explore Platform</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
