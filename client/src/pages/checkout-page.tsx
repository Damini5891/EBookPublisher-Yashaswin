import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Book } from "@shared/schema";

// Payment form schema
const paymentFormSchema = z.object({
  cardName: z.string().min(3, "Cardholder name is required"),
  cardNumber: z.string().refine(val => /^\d{16}$/.test(val), {
    message: "Card number must be 16 digits"
  }),
  expiryDate: z.string().refine(val => /^\d{2}\/\d{2}$/.test(val), {
    message: "Expiry date must be in MM/YY format"
  }),
  cvv: z.string().refine(val => /^\d{3,4}$/.test(val), {
    message: "CVV must be 3 or 4 digits"
  }),
});

const CheckoutPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  
  // Simple cart - in a real app this would be managed by state management
  const cartItems = [
    { id: 1, quantity: 1 }
  ];
  
  // Fetch books in cart
  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
  
  // Filter books that are in the cart
  const booksInCart = books.filter(book => 
    cartItems.some(item => item.id === book.id)
  );
  
  // Calculate total
  const total = booksInCart.reduce((sum, book) => {
    const item = cartItems.find(item => item.id === book.id);
    return sum + (book.price * (item?.quantity || 1));
  }, 0);
  
  // Create an order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const bookIds = booksInCart.map(book => book.id);
      const res = await apiRequest("POST", "/api/complete-order", {
        bookIds,
        total
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsPaymentSuccessful(true);
      setIsProcessing(false);
      toast({
        title: "Payment successful",
        description: "Your order has been processed successfully.",
      });
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Payment form
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call to the Stripe API
      // For this demo, we'll just simulate a payment
      setTimeout(() => {
        createOrderMutation.mutate();
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: "An error occurred while processing your payment.",
        variant: "destructive",
      });
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return v;
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isPaymentSuccessful ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-green-600 text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Payment Successful!</h1>
            <p className="text-neutral-600 mb-6">
              Thank you for your purchase. Your order has been processed successfully.
            </p>
            <p className="text-neutral-600 mb-8">
              Your e-books are now available in your library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate("/dashboard")}
              >
                Go to Library
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={() => navigate("/bookstore")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cart Summary */}
            <div>
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Order Summary</h1>
              
              {booksInCart.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <div className="space-y-4 mb-6">
                    {booksInCart.map((book) => {
                      const item = cartItems.find(item => item.id === book.id);
                      const quantity = item?.quantity || 1;
                      
                      return (
                        <div key={book.id} className="flex items-center">
                          <img 
                            src={book.coverImage} 
                            alt={`Cover of ${book.title}`} 
                            className="w-16 h-24 object-cover rounded-md mr-4"
                          />
                          <div className="flex-grow">
                            <h3 className="font-bold">{book.title}</h3>
                            <p className="text-sm text-neutral-600">
                              Qty: {quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(book.price * quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Tax</span>
                      <span className="font-medium">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <div className="text-5xl mb-4 text-neutral-400">
                    <i className="ri-shopping-cart-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Your Cart is Empty</h3>
                  <p className="text-neutral-600 mb-6">
                    Add some books to your cart to proceed with checkout.
                  </p>
                  <Button 
                    onClick={() => navigate("/bookstore")}
                    className="bg-primary text-white"
                  >
                    Browse Books
                  </Button>
                </div>
              )}
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Secure Purchase</h2>
                <div className="flex items-center mb-4">
                  <i className="ri-lock-line text-primary mr-2"></i>
                  <p className="text-sm text-neutral-600">
                    Your payment information is securely processed.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div>
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Payment Information</h1>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1234 5678 9012 3456" 
                              maxLength={16}
                              onChange={(e) => {
                                field.onChange(formatCardNumber(e.target.value));
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/YY" 
                                maxLength={5}
                                onChange={(e) => {
                                  field.onChange(formatExpiryDate(e.target.value));
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                maxLength={4}
                                onChange={(e) => {
                                  field.onChange(e.target.value.replace(/[^0-9]/g, ''));
                                }}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-primary text-white"
                      disabled={isProcessing || booksInCart.length === 0}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Pay ${formatPrice(total)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
