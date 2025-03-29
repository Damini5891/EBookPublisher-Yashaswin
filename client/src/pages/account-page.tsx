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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Order, Book } from "@shared/schema";
import { formatPrice } from "@/lib/utils";

const AccountPage = () => {
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

  // Define proper types for our cart and orders
  type CartItem = {
    book: Book & { authorName: string; };
    quantity: number;
  };

  type CartType = {
    items: CartItem[];
    total: number;
  };

  type OrderItem = {
    book: Book & { authorName: string; isDownloadable: boolean; };
    quantity: number;
  };

  type ExtendedOrder = Order & {
    status: string;
    totalAmount: number;
    items: OrderItem[];
  };

  // Fetch user's orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<ExtendedOrder[]>({
    queryKey: ["/api/orders"],
  });

  // Fetch user's cart
  const { data: cart = { items: [], total: 0 }, isLoading: isLoadingCart } = useQuery<CartType>({
    queryKey: ["/api/cart"],
  });

  // Profile form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      bio: user?.bio || "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await apiRequest("DELETE", `/api/cart/${bookId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "The book has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update cart quantity mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ bookId, quantity }: { bookId: number, quantity: number }) => {
      const res = await apiRequest("PATCH", `/api/cart/${bookId}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(data);
  };

  const getOrderStatusBadge = (status: string | null) => {
    if (!status) return <Badge className="bg-gray-500">Pending</Badge>;
    
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>My Account</h1>
          <p className="text-neutral-600">
            Welcome back, {user?.fullName || user?.username}. Manage your profile, orders, and more.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
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
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>
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
                      {orders.slice(0, 3).map((order) => (
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
                      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Orders Yet</h3>
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
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>My Orders</h2>
            
            {isLoadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
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
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex flex-col md:flex-row border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                              <img 
                                src={item.book.coverImage || undefined} 
                                alt={item.book.title} 
                                className="w-20 h-28 object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>{item.book.title}</h3>
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
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Orders Yet</h3>
                <p className="text-neutral-600 mb-6">
                  You haven't made any purchases yet. Explore our bookstore to find your next favorite read.
                </p>
                <Button asChild>
                  <Link href="/bookstore">Browse Books</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Shopping Cart Tab */}
          <TabsContent value="cart">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Shopping Cart</h2>
            
            {isLoadingCart ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : cart.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cart Items ({cart.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cart.items.map((item, index) => (
                          <div key={index} className="flex flex-col md:flex-row border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                              <img 
                                src={item.book.coverImage || undefined} 
                                alt={item.book.title} 
                                className="w-20 h-28 object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                <div>
                                  <h3 className="font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>{item.book.title}</h3>
                                  <p className="text-sm text-neutral-600 mb-2">Author: {item.book.authorName}</p>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 w-8 p-0" 
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          updateCartMutation.mutate({ bookId: item.book.id, quantity: item.quantity - 1 });
                                        }
                                      }}
                                      disabled={item.quantity <= 1}
                                    >
                                      -
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => updateCartMutation.mutate({ bookId: item.book.id, quantity: item.quantity + 1 })}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-2 md:mt-0 flex flex-col items-end">
                                  <p className="font-semibold">{formatPrice(item.book.price)}</p>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-red-500 h-8 px-2 mt-2"
                                    onClick={() => removeFromCartMutation.mutate(item.book.id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatPrice(cart.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatPrice(cart.total * 0.1)}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatPrice(cart.total * 1.1)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href="/checkout">Proceed to Checkout</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="mt-4">
                    <Button variant="link" asChild className="w-full">
                      <Link href="/bookstore">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-5xl mb-4 text-neutral-400"><i className="ri-shopping-cart-line"></i></div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Your Cart is Empty</h3>
                <p className="text-neutral-600 mb-6">
                  Add books to your cart to start your reading journey.
                </p>
                <Button asChild>
                  <Link href="/bookstore">Explore Bookstore</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>My Wishlist</h2>
            
            <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
              <div className="text-5xl mb-4 text-neutral-400"><i className="ri-heart-line"></i></div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Your Wishlist is Empty</h3>
              <p className="text-neutral-600 mb-6">
                Save your favorite books to purchase later.
              </p>
              <Button asChild>
                <Link href="/bookstore">Discover Books</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Account Settings</h2>
            
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-6">
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
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" />
                      </FormControl>
                    </FormItem>
                    <div className="flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;