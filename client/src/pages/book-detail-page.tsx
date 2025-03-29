import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatPrice, getRatingStars } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Book, Review } from "@shared/schema";

const BookDetailPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch book details
  const { data: book, isLoading: isLoadingBook } = useQuery<Book>({
    queryKey: [`/api/books/${id}`],
    enabled: !!id,
  });

  // Fetch book reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/books/${id}/reviews`],
    enabled: !!id,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to purchase");
      }
      
      const order = {
        bookIds: [Number(id)],
        total: book?.price || 0
      };
      return navigate("/checkout");
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Proceeding to checkout",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to leave a review");
      }
      
      const review = {
        rating,
        comment,
      };
      
      const res = await apiRequest("POST", `/api/books/${id}/reviews`, review);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/books/${id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingBook) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Book Not Found</h2>
          <p className="mb-4 text-neutral-600">The book you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/bookstore">Return to Bookstore</a>
          </Button>
        </div>
      </div>
    );
  }

  const { title, description, coverImage, price, genre, rating: bookRating, reviewCount } = book;
  const { filled, half, empty } = getRatingStars(bookRating);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewMutation.mutate();
  };

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {/* Book Cover */}
            <div className="p-6 flex justify-center md:justify-start">
              <div className="relative aspect-[2/3] w-full max-w-[250px]">
                <img 
                  src={coverImage} 
                  alt={`Cover of ${title}`} 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            {/* Book Info */}
            <div className="p-6 md:col-span-2 lg:col-span-3">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>{title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-[#E94F37] mr-2">
                  {[...Array(filled)].map((_, i) => (
                    <i key={`filled-${i}`} className="ri-star-fill"></i>
                  ))}
                  {half && <i className="ri-star-half-fill"></i>}
                  {[...Array(empty)].map((_, i) => (
                    <i key={`empty-${i}`} className="ri-star-line"></i>
                  ))}
                </div>
                <span className="text-neutral-600">
                  {bookRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
                  {genre}
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Description</h2>
                <p className="text-neutral-700 leading-relaxed">{description}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-2xl font-bold text-primary">{formatPrice(price)}</div>
                <Button 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="bg-[#E94F37] hover:bg-[#C73623] text-white"
                >
                  {addToCartMutation.isPending ? "Processing..." : "Buy Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs: Reviews, Details */}
        <Tabs defaultValue="reviews">
          <TabsList className="mb-8">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-8">
            {/* Add Review Form */}
            {user && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <div className="flex text-2xl text-[#E94F37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <i className={`${star <= rating ? 'ri-star-fill' : 'ri-star-line'}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      ></textarea>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submitReviewMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {/* Reviews List */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
                Customer Reviews ({reviews.length})
              </h3>
              
              {isLoadingReviews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => {
                    const reviewStars = getRatingStars(review.rating);
                    return (
                      <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">User</div>
                            <div className="text-sm text-neutral-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex text-[#E94F37] mb-2">
                          {[...Array(reviewStars.filled)].map((_, i) => (
                            <i key={`filled-${i}`} className="ri-star-fill"></i>
                          ))}
                          {reviewStars.half && <i className="ri-star-half-fill"></i>}
                          {[...Array(reviewStars.empty)].map((_, i) => (
                            <i key={`empty-${i}`} className="ri-star-line"></i>
                          ))}
                        </div>
                        <p className="text-neutral-700">{review.comment}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-neutral-300 rounded-lg">
                  <div className="text-3xl text-neutral-400 mb-2"><i className="ri-chat-3-line"></i></div>
                  <p className="text-neutral-600">No reviews yet. Be the first to review this book!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Book Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Publication Information</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Genre:</span>
                        <span className="font-medium">{genre}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Published Date:</span>
                        <span className="font-medium">{new Date(book.publishedDate).toLocaleDateString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Format:</span>
                        <span className="font-medium">E-Book</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Additional Information</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Pages:</span>
                        <span className="font-medium">Approx. 300</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Language:</span>
                        <span className="font-medium">English</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">File Size:</span>
                        <span className="font-medium">2.3 MB</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookDetailPage;
