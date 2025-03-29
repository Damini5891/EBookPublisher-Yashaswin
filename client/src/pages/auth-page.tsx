import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const AuthPage = () => {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const params = new URLSearchParams(search);
  const initialTab = params.get("tab");

  useEffect(() => {
    if (initialTab === "register") {
      setActiveTab("register");
    } else if (initialTab === "admin") {
      setActiveTab("admin");
    }
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Enhanced login schema with custom error messages
  const loginFormSchema = loginSchema.extend({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  // Enhanced register schema with validation and confirmPassword
  const registerFormSchema = insertUserSchema.extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginFormSchema>) => {
    await loginMutation.mutateAsync(values);
  };

  // Register form
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: undefined, // Make this undefined instead of empty string to match the schema
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (values: z.infer<typeof registerFormSchema>) => {
    await registerMutation.mutateAsync(values);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
          {/* Auth Forms */}
          <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Welcome Back</CardTitle>
                    <CardDescription>
                      Sign in to your account to continue your publishing journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-white"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center text-sm text-neutral-600">
                    <p>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-primary hover:underline font-medium"
                      >
                        Register
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>Create an Account</CardTitle>
                    <CardDescription>
                      Join our community of authors and readers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  {...field} 
                                  value={field.value || ''} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary text-white"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center text-sm text-neutral-600">
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Sign In
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Admin Login Tab */}
              <TabsContent value="admin">
                <Card className="border-2 border-gray-800">
                  <CardHeader className="bg-gray-900 text-white">
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                    <CardDescription className="text-gray-300">
                      Secure access for administrators only
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admin Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter admin username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admin Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter admin password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Authenticating..." : "Admin Login"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-sm text-amber-800">
                        <b>Note:</b> This area is restricted to platform administrators. 
                        If you're looking to publish or purchase books, please use the regular login.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center text-sm text-neutral-600 bg-gray-50">
                    <p>
                      Need a regular account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Go to User Login
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Hero Section */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg shadow-lg p-8 hidden md:block">
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>{APP_NAME}</h1>
              <p className="text-xl md:text-2xl mb-6 font-light">
                {APP_TAGLINE}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="ri-check-line text-[#E94F37] mt-1 mr-3 text-lg"></i>
                  <span>Publish your e-book in minutes</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#E94F37] mt-1 mr-3 text-lg"></i>
                  <span>Professional editing and design tools</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#E94F37] mt-1 mr-3 text-lg"></i>
                  <span>Global distribution to major bookstores</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#E94F37] mt-1 mr-3 text-lg"></i>
                  <span>Real-time sales tracking and analytics</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-[#E94F37] mt-1 mr-3 text-lg"></i>
                  <span>Join a community of 50,000+ authors</span>
                </li>
              </ul>
              <div className="mt-8 py-4 border-t border-white/20">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Author" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Author" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=40&h=40&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Author" />
                  </div>
                  <p className="ml-4 text-sm">
                    Join thousands of authors who have successfully published with us
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
