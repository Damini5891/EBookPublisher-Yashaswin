import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { User, Book, Manuscript, Order, Contact, Review, Notification, InsertBook, InsertUser } from '@shared/schema';
import { 
  Loader2, Users, BookOpen, FileText, ShoppingCart, MessageSquare, Bell, CheckCircle, 
  AlertCircle, Settings, PlusCircle, Edit, Trash, Eye, Send, UserCog, DollarSign,
  Package, BarChart4, Zap, BookMarked, ShieldAlert, BookCheck, CalendarDays, Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { formatPrice, truncateText } from '@/lib/utils';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BOOK_GENRES } from '@/lib/constants';
import { Redirect } from 'wouter';

// Book Form component for add/edit book functionality
interface BookFormProps {
  book: Book | null;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

function BookForm({ book, onSubmit, isPending }: BookFormProps) {
  // Create book form schema with validation
  const bookFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    authorId: z.coerce.number().int().positive("Author ID is required"),
    coverImage: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    genre: z.string().min(1, "Genre is required"),
    pageCount: z.coerce.number().int().positive("Page count must be a positive number").optional(),
    language: z.string().optional(),
    isPublished: z.boolean().default(true),
    publicationDate: z.string().optional(),
    isbn: z.string().optional(),
    tags: z.string().optional(),
  });

  // Initialize form with default values from book or empty values
  const form = useForm<z.infer<typeof bookFormSchema>>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book ? {
      title: book.title,
      description: book.description || "",
      authorId: book.authorId || 0,
      coverImage: book.coverImage || "",
      price: book.price,
      genre: book.genre || "",
      // Add extra fields needed for the form but not in the DB schema
      pageCount: 0, 
      language: "English",
      isPublished: true,
      publicationDate: "",
      isbn: "",
      tags: "",
    } : {
      title: "",
      description: "",
      authorId: 0,
      coverImage: "",
      price: 0,
      genre: "",
      pageCount: 0,
      language: "English",
      isPublished: true,
      publicationDate: new Date().toISOString().split("T")[0],
      isbn: "",
      tags: "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author ID</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>ID of the author in the system</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BOOK_GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>Direct link to cover image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Count</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input placeholder="ISBN-13" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated tags" {...field} />
                </FormControl>
                <FormDescription>Separate tags with commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Make this book visible in the store
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Book description" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {book ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function AdminPanel() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);

  // Redirect non-admin users
  if (!isAuthLoading && (!user || !user.isAdmin)) {
    toast({
      title: 'Access Denied',
      description: 'You need admin privileges to access this page',
      variant: 'destructive',
    });
    return <Redirect to="/" />;
  }

  // Dashboard stats
  const { data: users, isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: books, isLoading: isBooksLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: manuscripts, isLoading: isManuscriptsLoading } = useQuery<Manuscript[]>({
    queryKey: ['/api/admin/manuscripts'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: contacts, isLoading: isContactsLoading } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PATCH', `/api/admin/orders/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: 'Order Updated',
        description: 'The order status has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Approve manuscript mutation
  const approveManuscriptMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PATCH', `/api/admin/manuscripts/${id}/approve`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/manuscripts'] });
      toast({
        title: 'Manuscript Approved',
        description: 'The manuscript has been approved and is ready for publishing',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/contacts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      toast({
        title: 'Contact Deleted',
        description: 'The contact message has been deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // User Management Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: Partial<User> }) => {
      const res = await apiRequest('PATCH', `/api/admin/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User Updated',
        description: 'The user information has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/users/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User Deleted',
        description: 'The user account has been permanently deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Book Management Mutations
  const createBookMutation = useMutation({
    mutationFn: async (bookData: Partial<InsertBook>) => {
      const res = await apiRequest('POST', '/api/admin/books', bookData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: 'Book Created',
        description: 'The book has been successfully added to the store',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, bookData }: { id: number; bookData: Partial<Book> }) => {
      const res = await apiRequest('PATCH', `/api/admin/books/${id}`, bookData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: 'Book Updated',
        description: 'The book information has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/books/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: 'Book Deleted',
        description: 'The book has been permanently removed from the store',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteManuscriptMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/manuscripts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/manuscripts'] });
      toast({
        title: 'Manuscript Deleted',
        description: 'The manuscript has been permanently deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Order Management Mutations
  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/orders/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: 'Order Deleted',
        description: 'The order has been permanently deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Notification Management
  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: { userId: number; title: string; message: string; type: string }) => {
      const res = await apiRequest('POST', '/api/admin/notifications', {
        ...notificationData,
        isRead: false
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Notification Sent',
        description: 'The notification has been sent to the user',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Sending Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isAuthLoading || isUsersLoading || isBooksLoading || isManuscriptsLoading || isOrdersLoading || isContactsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalAuthors = users?.filter(u => u.isAuthor).length || 0;
  const totalBooks = books?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingManuscripts = manuscripts?.filter(m => m.status === 'pending').length || 0;
  const totalRevenue = orders?.reduce((acc, order) => acc + (order.totalAmount || 0), 0) || 0;
  const unreadContacts = contacts?.length || 0; // All contacts are considered unread

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform, users, and content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback>{(user?.fullName ? user.fullName.substring(0, 2) : user?.username ? user.username.substring(0, 2) : 'AD')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.fullName || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="books">Books & Manuscripts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="contacts">Messages</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{totalAuthors} authors</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Published Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalBooks}</div>
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{pendingManuscripts} pending approvals</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{formatPrice(totalRevenue)} revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Support Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{contacts?.length || 0}</div>
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{unreadContacts} unresolved</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest book purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders && orders.length > 0 ? (
                        orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.userId}</TableCell>
                            <TableCell>{formatPrice(order.totalAmount || 0)}</TableCell>
                            <TableCell>
                              <Badge variant={order.status === 'completed' ? 'default' : 'outline'}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">No orders yet</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                  View all orders
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Manuscripts</CardTitle>
                <CardDescription>Manuscripts awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {manuscripts && manuscripts.filter(m => m.status === 'pending').length > 0 ? (
                    manuscripts.filter(m => m.status === 'pending').slice(0, 5).map((manuscript) => (
                      <div key={manuscript.id} className="flex items-start justify-between mb-4 pb-4 border-b">
                        <div>
                          <h4 className="font-medium">{manuscript.title}</h4>
                          <p className="text-sm text-muted-foreground">Author ID: {manuscript.authorId}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(manuscript.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => approveManuscriptMutation.mutate(manuscript.id)}
                          disabled={approveManuscriptMutation.isPending}
                        >
                          {approveManuscriptMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Approve
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No pending manuscripts</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('books')}>
                  View all manuscripts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl || undefined} />
                                <AvatarFallback>{(user.fullName ? user.fullName.substring(0, 2) : user.username ? user.username.substring(0, 2) : "US")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.fullName || user.username}</p>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge>Admin</Badge>
                            ) : user.isAuthor ? (
                              <Badge variant="outline">Author</Badge>
                            ) : (
                              <Badge variant="secondary">User</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">No users found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Books & Manuscripts Tab */}
        <TabsContent value="books" className="py-4">
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Published Books</CardTitle>
                <CardDescription>Books available in the store</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books && books.length > 0 ? (
                        books.map((book) => (
                          <TableRow key={book.id}>
                            <TableCell>{book.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-12 bg-muted rounded overflow-hidden">
                                  <img 
                                    src={book.coverImage || `/placeholder-cover-${(book.id % 5) + 1}.jpg`} 
                                    alt={book.title} 
                                    className="h-full w-full object-cover" 
                                    onError={(e) => {
                                      e.currentTarget.src = `/placeholder-cover-${(book.id % 5) + 1}.jpg`;
                                    }}
                                  />
                                </div>
                                <span className="font-medium">{book.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>ID: {book.authorId}</TableCell>
                            <TableCell>{book.genre}</TableCell>
                            <TableCell>{formatPrice(book.price)}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Published</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No books published yet</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manuscript Submissions</CardTitle>
                <CardDescription>Review and approve author submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {manuscripts && manuscripts.length > 0 ? (
                        manuscripts.map((manuscript) => (
                          <TableRow key={manuscript.id}>
                            <TableCell>{manuscript.id}</TableCell>
                            <TableCell className="font-medium">{manuscript.title}</TableCell>
                            <TableCell>ID: {manuscript.authorId}</TableCell>
                            <TableCell>{new Date(manuscript.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={manuscript.status === 'approved' ? 'default' : 
                                        manuscript.status === 'rejected' ? 'destructive' : 'outline'}
                              >
                                {manuscript.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {manuscript.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => approveManuscriptMutation.mutate(manuscript.id)}
                                    disabled={approveManuscriptMutation.isPending}
                                  >
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No manuscript submissions yet</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders && orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>User ID: {order.userId}</TableCell>
                          <TableCell>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                          <TableCell>{order.bookIds?.length || 1} items</TableCell>
                          <TableCell className="font-medium">{formatPrice(order.totalAmount || 0)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === 'completed' ? 'default' : 
                                order.status === 'cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Order #{order.id}</DialogTitle>
                                  <DialogDescription>
                                    Change the status of this order
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Button
                                      className="col-span-2"
                                      onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'processing' })}
                                    >
                                      Mark as Processing
                                    </Button>
                                    <Button
                                      className="col-span-2"
                                      onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'shipped' })}
                                    >
                                      Mark as Shipped
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Button
                                      className="col-span-2"
                                      variant="default"
                                      onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'completed' })}
                                    >
                                      Mark as Completed
                                    </Button>
                                    <Button
                                      className="col-span-2"
                                      variant="destructive"
                                      onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                                    >
                                      Cancel Order
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">No orders found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Messages Tab */}
        <TabsContent value="contacts" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>Support and inquiry messages from users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {contacts && contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact.id} className="mb-6 p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <Badge variant="outline">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm mb-4">{contact.message}</p>
                      <div className="text-xs text-muted-foreground mb-4">
                        Received: {new Date(contact.createdAt || Date.now()).toLocaleDateString()} at {
                          new Date(contact.createdAt || Date.now()).toLocaleTimeString()
                        }
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          Mark as Resolved
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteContactMutation.mutate(contact.id)}
                          disabled={deleteContactMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}