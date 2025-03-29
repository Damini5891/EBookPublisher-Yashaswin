import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Order, Book } from "@shared/schema";
import { formatPrice, getBookCoverFallback } from "@/lib/utils";

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile update schema
  const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    fullName: z.string().optional(),
    bio: z.string().optional(),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      bio: user?.bio || "",
    },
  });

  // Define the order item type
  type OrderItem = {
    book: Book & { authorName: string; isDownloadable: boolean; };
    quantity: number;
  };

  // Define the extended order type
  type ExtendedOrder = Order & {
    status: string;
    totalAmount: number;
    items: OrderItem[];
  };
  
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<ExtendedOrder[]>({
    queryKey: ["/api/orders"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const res = await apiRequest("PATCH", "/api/user", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
    await updateProfileMutation.mutateAsync(values);
  };

  // Password update schema
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const res = await apiRequest("PATCH", "/api/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    await updatePasswordMutation.mutateAsync(values);
  };

  // Helper function to render order status badges
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Dashboard</h1>
        <p className="text-neutral-600">
          Welcome back, {user?.fullName || user?.username}. Manage your account details and orders.
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user?.avatarUrl || undefined} />
                  <AvatarFallback className="text-4xl">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-1">
                  {user?.fullName || user?.username}
                </h3>
                <p className="text-neutral-600 text-center mb-4">{user?.bio || "No bio available"}</p>
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">Member since:</span>
                    <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Books purchased:</span>
                    <span className="font-medium">{orders.length || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setActiveTab("settings")}>
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order: ExtendedOrder) => (
                      <div key={order.id} className="flex items-center p-3 bg-neutral-100 rounded-lg">
                        <div className="text-2xl mr-3 text-primary">
                          <i className="ri-shopping-bag-line"></i>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-neutral-600">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} · {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <div>{getOrderStatusBadge(order.status)}</div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => setActiveTab("orders")}
                    >
                      View All Orders
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 text-neutral-400"><i className="ri-shopping-bag-line"></i></div>
                    <h3 className="text-lg font-bold mb-2">No Orders Yet</h3>
                    <p className="text-neutral-600 mb-4">You haven't made any purchases yet.</p>
                    <Button asChild>
                      <Link href="/bookstore">Explore Books</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <h2 className="text-2xl font-bold mb-6">My Orders</h2>
          
          {isLoadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order: ExtendedOrder) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center space-x-3">
                        {getOrderStatusBadge(order.status)}
                        <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item: OrderItem, index: number) => (
                        <div key={index} className="flex flex-col md:flex-row border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                            <img 
                              src={item.book.coverImage || getBookCoverFallback(item.book.title)} 
                              alt={item.book.title} 
                              className="w-20 h-28 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-bold mb-1">{item.book.title}</h3>
                            <p className="text-sm text-neutral-600 mb-2">Author: {item.book.authorName}</p>
                            <div className="flex justify-between text-sm">
                              <span>Qty: {item.quantity}</span>
                              <span className="font-semibold">{formatPrice(item.book.price)}</span>
                            </div>
                            
                            {item.book.isDownloadable && (
                              <Button size="sm" className="mt-2" variant="outline">
                                <i className="ri-download-line mr-1"></i> Download
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-between">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button size="sm">
                        View Order Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
              <div className="text-5xl mb-4 text-neutral-400"><i className="ri-shopping-bag-line"></i></div>
              <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
              <p className="text-neutral-600 mb-6">
                You haven't made any purchases yet. Explore our bookstore to find your next favorite read.
              </p>
              <Button asChild>
                <Link href="/bookstore">Browse Books</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updatePasswordMutation.isPending}
                    >
                      {updatePasswordMutation.isPending ? "Updating..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;