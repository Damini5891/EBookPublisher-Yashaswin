import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Book } from "@shared/schema";


const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Checkout form component using Stripe Elements
const CheckoutForm = ({ clientSecret, onSuccess, total }: { clientSecret: string, onSuccess: () => void, total: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unknown error occurred");
      toast({
        title: "Payment Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } else {
      setMessage("Payment succeeded!");
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <PaymentElement />
      </div>
      {message && <div className="text-red-500 mb-4">{message}</div>}
      <Button 
        type="submit"
        className="w-full bg-primary text-white"
        disabled={isProcessing || !stripe || !elements}
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
  );
};

const CheckoutPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  
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
  
  // Create Payment Intent when the page loads
  useEffect(() => {
    if (total <= 0 || !booksInCart.length) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Create PaymentIntent on the server
    const createPaymentIntent = async () => {
      try {
        const res = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: total
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not initialize payment system.",
          variant: "destructive",
        });
      }
    };

    // Only create payment intent if Stripe is available
    if (stripePromise) {
      createPaymentIntent();
    }
  }, [total, booksInCart.length, user, navigate, toast]);

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
      toast({
        title: "Order completed",
        description: "Your order has been processed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePaymentSuccess = () => {
    createOrderMutation.mutate();
  };

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isPaymentSuccessful ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
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
                            src={book.coverImage || "https://via.placeholder.com/128x196"} 
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
                    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
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
                  <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
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
                {stripePromise && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      total={total}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    {total <= 0 || !booksInCart.length ? (
                      <p>Add items to your cart to proceed with checkout.</p>
                    ) : (
                      <>
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading payment options...</p>
                        {!stripePromise && (
                          <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                            <p className="text-sm">
                              Stripe API keys not configured. Please add your Stripe keys to enable payment processing.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;