import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart as ShoppingCartIcon, Plus, Minus, X, CreditCard, BookOpen, Info } from "lucide-react";
import { Book } from "@shared/schema";

interface CartItem {
  bookId: number;
  book: Book & { authorName: string };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const ShoppingCart = ({ onClose }: { onClose?: () => void }) => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const discountAmount = isCouponApplied ? 10 : 0; // 10% discount

  const { data: cart = { items: [], totalAmount: 0 }, isLoading } = useQuery<CartState>({
    queryKey: ["/api/cart"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ bookId, quantity }: { bookId: number, quantity: number }) => {
      const res = await apiRequest("PATCH", "/api/cart/item", { bookId, quantity });
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

  const removeFromCartMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await apiRequest("DELETE", `/api/cart/item/${bookId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
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

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/cart");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart Cleared",
        description: "Your shopping cart has been cleared.",
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

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/cart/coupon", { code });
      return await res.json();
    },
    onSuccess: () => {
      setIsCouponApplied(true);
      setCouponCode("");
      toast({
        title: "Coupon Applied",
        description: "Your discount has been applied to the order.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid Coupon",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (bookId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemMutation.mutate({ bookId, quantity: newQuantity });
  };

  const handleRemoveItem = (bookId: number) => {
    removeFromCartMutation.mutate(bookId);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }
    
    applyCouponMutation.mutate(couponCode);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const handleCheckout = () => {
    if (onClose) onClose();
    navigate("/checkout");
  };

  // Calculate cart totals
  const subtotal = cart.totalAmount;
  const shipping = 0; // Free shipping
  const discount = isCouponApplied ? (subtotal * discountAmount / 100) : 0;
  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal - discount + tax + shipping;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">
          Browse our bookstore to find your next favorite read
        </p>
        <Button onClick={() => navigate("/bookstore")}>
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-medium flex items-center">
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          Shopping Cart ({cart.items.length})
        </h2>
        <Button variant="outline" size="sm" onClick={handleClearCart}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>
      
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div 
              key={item.bookId} 
              className="flex items-start space-x-4 py-4 border-b last:border-b-0"
            >
              <div className="flex-shrink-0">
                <img 
                  src={item.book.coverImage || "https://placehold.co/200x300?text=Book+Cover"} 
                  alt={item.book.title} 
                  className="w-16 h-24 object-cover rounded"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-medium line-clamp-1">{item.book.title}</h3>
                  <button 
                    onClick={() => handleRemoveItem(item.bookId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">By {item.book.authorName}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md">
                    <button 
                      className="px-2 py-1 text-gray-500 hover:text-gray-700"
                      onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 py-1 text-sm">{item.quantity}</span>
                    <button 
                      className="px-2 py-1 text-gray-500 hover:text-gray-700"
                      onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-medium">
                      {formatPrice(item.book.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Input 
            placeholder="Enter coupon code" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isCouponApplied}
          />
          <Button 
            variant="outline" 
            onClick={handleApplyCoupon}
            disabled={isCouponApplied}
          >
            Apply
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {isCouponApplied && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountAmount}%)</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={handleCheckout}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Checkout
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-2">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
};