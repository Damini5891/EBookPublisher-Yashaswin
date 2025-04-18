import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertManuscriptSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Manuscript, Book } from "@shared/schema";
import { BOOK_GENRES, PUBLISHING_PLANS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manuscripts");
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic-plan");

  // Enhanced manuscript schema
  const manuscriptFormSchema = insertManuscriptSchema.pick({
    title: true,
    content: true,
    status: true,
  }).extend({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
  });

  // Fetch user's manuscripts
  const { data: manuscripts = [], isLoading: isLoadingManuscripts } = useQuery<Manuscript[]>({
    queryKey: ["/api/manuscripts"],
  });

  // Fetch user's published books
  const { data: books = [], isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["/api/author/books"],
  });

  // Form for submitting a new manuscript
  const form = useForm<z.infer<typeof manuscriptFormSchema>>({
    resolver: zodResolver(manuscriptFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  // Submit manuscript mutation
  const submitManuscriptMutation = useMutation({
    mutationFn: async (data: z.infer<typeof manuscriptFormSchema>) => {
      const res = await apiRequest("POST", "/api/manuscripts", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Manuscript submitted",
        description: "Your manuscript has been successfully submitted.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof manuscriptFormSchema>) => {
    submitManuscriptMutation.mutate(data);
  };

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Author Dashboard</h1>
          <p className="text-neutral-600">
            Welcome, {user?.fullName || user?.username}. Manage your manuscripts and publications here.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="manuscripts">My Manuscripts</TabsTrigger>
            <TabsTrigger value="books">Published Books</TabsTrigger>
            <TabsTrigger value="new">New Manuscript</TabsTrigger>
            <TabsTrigger value="publishing-plans">Publishing Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Manuscripts Tab */}
          <TabsContent value="manuscripts">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>My Manuscripts</h2>
            
            {isLoadingManuscripts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : manuscripts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {manuscripts.map((manuscript) => (
                  <Card key={manuscript.id}>
                    <CardHeader>
                      <CardTitle>{manuscript.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            manuscript.status === 'published' ? 'bg-green-500' : 
                            manuscript.status === 'pending' ? 'bg-yellow-500' : 'bg-neutral-400'
                          }`}></span>
                          <span className="capitalize">{manuscript.status}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 mb-4 line-clamp-3">
                        {manuscript.content?.substring(0, 150)}...
                      </p>
                      <div className="text-sm text-neutral-500">
                        <p>Submitted: {new Date(manuscript.submittedAt).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(manuscript.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2">Edit</Button>
                      <Button>Continue Publishing</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-5xl mb-4 text-neutral-400"><i className="ri-draft-line"></i></div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Manuscripts Yet</h3>
                <p className="text-neutral-600 mb-6">
                  You haven't uploaded any manuscripts yet. Click the button below to get started.
                </p>
                <Button onClick={() => setActiveTab("new")}>Create New Manuscript</Button>
              </div>
            )}
          </TabsContent>

          {/* Published Books Tab */}
          <TabsContent value="books">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Published Books</h2>
            
            {isLoadingBooks ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <Card key={book.id}>
                    <div className="p-4 flex">
                      <img 
                        src={book.coverImage} 
                        alt={`Cover of ${book.title}`} 
                        className="w-24 h-36 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h3 className="font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{book.title}</h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Published: {new Date(book.publishedDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-semibold text-primary">{formatPrice(book.price)}</p>
                        <div className="flex items-center text-sm mt-2">
                          <i className="ri-star-fill text-[#E94F37] mr-1"></i>
                          <span>{book.rating.toFixed(1)} ({book.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <CardFooter className="border-t pt-4">
                      <Button variant="outline" className="w-full" size="sm">View Sales & Analytics</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-5xl mb-4 text-neutral-400"><i className="ri-book-open-line"></i></div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Published Books</h3>
                <p className="text-neutral-600 mb-6">
                  You haven't published any books yet. Complete your manuscript submission to get started.
                </p>
                <Button onClick={() => setActiveTab("manuscripts")}>View My Manuscripts</Button>
              </div>
            )}
          </TabsContent>

          {/* New Manuscript Tab */}
          <TabsContent value="new">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Submit New Manuscript</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manuscript Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the title of your book" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Ready for Review</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Genre</FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BOOK_GENRES.map(genre => (
                            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manuscript Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Copy and paste your manuscript text here or provide a brief synopsis" 
                            className="min-h-[300px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <p className="text-sm text-neutral-600 mb-4">
                      You can also upload your manuscript as a file (DOC, DOCX, PDF) for better formatting.
                    </p>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                      <div className="text-3xl mb-2 text-neutral-400"><i className="ri-upload-cloud-line"></i></div>
                      <p className="text-neutral-600 mb-2">Drag and drop your manuscript here or</p>
                      <Button type="button" variant="outline">Browse Files</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                      Clear Form
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submitManuscriptMutation.isPending}
                    >
                      {submitManuscriptMutation.isPending ? "Submitting..." : "Submit Manuscript"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Publishing Plans Tab */}
          <TabsContent value="publishing-plans">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Publishing Plans</h2>
            
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex items-start">
                  <div className="mr-3 text-blue-500">
                    <i className="ri-information-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">Currently Selected Plan</h3>
                    {selectedPlan ? (
                      <p className="text-blue-700">
                        Your selected plan: <Badge className="ml-1 font-medium">{PUBLISHING_PLANS.find(p => p.id === selectedPlan)?.name || "None"}</Badge>
                        <span className="ml-2 text-sm">
                          ({PUBLISHING_PLANS.find(p => p.id === selectedPlan)?.formats.join(", ")})
                        </span>
                      </p>
                    ) : (
                      <p className="text-blue-700">You haven't selected a publishing plan yet. Choose one below to get started.</p>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-neutral-600 mb-8">
                Select the publishing plan that best suits your needs. Each plan offers different formats and distribution channels.
                Once you've selected a plan, we'll guide you through the publishing process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PUBLISHING_PLANS.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs font-semibold">
                      POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-neutral-600">/{plan.priceUnit}</span>
                    </div>
                    
                    <div className="bg-neutral-100 p-3 rounded-md mb-4">
                      <p className="text-sm text-neutral-800 font-medium">Available Formats:</p>
                      <div className="flex gap-2 mt-2">
                        {plan.formats.map((format, i) => (
                          <Badge key={i} variant="secondary" className="bg-white">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-neutral-300 mr-2 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-neutral-800' : 'text-neutral-400'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-4">
                      <i className="ri-time-line mr-1"></i> Estimated timeline: {plan.timeline}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {selectedPlan === plan.id ? (
                      <div className="w-full space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => setSelectedPlan(null)}>
                          Deselect Plan
                        </Button>
                        <Button className="w-full" onClick={() => setActiveTab("manuscripts")}>
                          Continue with This Plan
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        Select Plan
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold mb-3">1</div>
                  <h4 className="text-lg font-semibold mb-2">Upload your manuscript</h4>
                  <p className="text-neutral-600 text-sm">Upload your completed manuscript and provide details about your book.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold mb-3">2</div>
                  <h4 className="text-lg font-semibold mb-2">Production process</h4>
                  <p className="text-neutral-600 text-sm">Our team works on formatting, cover design, and preparing your book for publication.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold mb-3">3</div>
                  <h4 className="text-lg font-semibold mb-2">Distribution & sales</h4>
                  <p className="text-neutral-600 text-sm">Your book gets distributed to selected platforms and starts selling globally.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                size="lg" 
                onClick={() => selectedPlan ? setActiveTab("manuscripts") : null}
                disabled={!selectedPlan}
              >
                {selectedPlan ? "Continue with Selected Plan" : "Please Select a Plan to Continue"}
              </Button>
              {selectedPlan && (
                <p className="mt-2 text-sm text-neutral-600">
                  You're selecting the {PUBLISHING_PLANS.find(p => p.id === selectedPlan)?.name} plan for ${PUBLISHING_PLANS.find(p => p.id === selectedPlan)?.price}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Sales & Analytics</h2>
            
            {books.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl text-neutral-400 mb-2">
                        <i className="ri-book-open-line"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>{books.length}</h3>
                      <p className="text-neutral-600">Published Books</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl text-neutral-400 mb-2">
                        <i className="ri-download-line"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>1,234</h3>
                      <p className="text-neutral-600">Total Sales</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl text-neutral-400 mb-2">
                        <i className="ri-money-dollar-circle-line"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>$4,321</h3>
                      <p className="text-neutral-600">Total Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl text-neutral-400 mb-2">
                        <i className="ri-star-line"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>4.5</h3>
                      <p className="text-neutral-600">Average Rating</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center border border-dashed border-neutral-300 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl mb-2 text-neutral-400"><i className="ri-line-chart-line"></i></div>
                        <p className="text-neutral-600">Sales chart would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {books.slice(0, 3).map((book) => (
                          <div key={book.id} className="flex items-center">
                            <img 
                              src={book.coverImage} 
                              alt={`Cover of ${book.title}`} 
                              className="w-12 h-18 object-cover rounded-md mr-3"
                            />
                            <div className="flex-grow">
                              <p className="font-medium">{book.title}</p>
                              <div className="flex items-center text-sm">
                                <i className="ri-star-fill text-[#E94F37] mr-1"></i>
                                <span>{book.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatPrice(book.price)}</p>
                              <p className="text-sm text-neutral-600">632 sales</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-3xl mb-2 text-neutral-400"><i className="ri-chat-3-line"></i></div>
                        <p className="text-neutral-600">Recent reviews would be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-5xl mb-4 text-neutral-400"><i className="ri-line-chart-line"></i></div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Analytics Available</h3>
                <p className="text-neutral-600 mb-6">
                  You need to publish books to see sales analytics. Start by completing your manuscript submission.
                </p>
                <Button onClick={() => setActiveTab("new")}>Create New Manuscript</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthorDashboard;
