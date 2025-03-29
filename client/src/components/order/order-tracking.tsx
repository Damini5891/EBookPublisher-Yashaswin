import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";
import { Order, Book } from "@shared/schema";
import { Loader2, Package, TruckIcon, ShoppingBag, CheckCircle2, XCircle, Clock, MapPin, Calendar, Download } from "lucide-react";

interface OrderItem {
  book: Book & { authorName: string; isDownloadable: boolean; };
  quantity: number;
}

interface ExtendedOrder extends Order {
  status: string;
  totalAmount: number;
  items: OrderItem[];
  trackingId?: string;
  estimatedDelivery?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  orderNotes?: string;
  statusHistory?: {
    status: string;
    date: string;
    note?: string;
  }[];
}

export const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id, 10);

  const { data: order, isLoading, error } = useQuery<ExtendedOrder>({
    queryKey: ["/api/orders", orderId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!orderId && !isNaN(orderId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription>
            Could not load the order details. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error?.message || "Order not found"}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "shipped":
        return <TruckIcon className="h-6 w-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <ShoppingBag className="h-6 w-6 text-gray-500" />;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Generate steps for status progress
  const getProgressSteps = () => {
    const allSteps = ["pending", "processing", "shipped", "delivered"];
    const currentStepIndex = allSteps.indexOf(order.status);
    
    // If cancelled, show special handling
    if (order.status === "cancelled") {
      return (
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-8 w-8 text-gray-300" />
              <p className="mt-1 text-xs text-gray-500">Ordered</p>
            </div>
            
            <div className="w-full border-t border-dashed border-gray-300 mx-2" />
            
            <div className="flex flex-col items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <p className="mt-1 text-xs text-gray-500">Cancelled</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Normal order progress steps
    return (
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-2">
          {allSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center
                ${index <= currentStepIndex 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-400'}
              `}>
                {index === 0 && <ShoppingBag className="h-5 w-5" />}
                {index === 1 && <Package className="h-5 w-5" />}
                {index === 2 && <TruckIcon className="h-5 w-5" />}
                {index === 3 && <CheckCircle2 className="h-5 w-5" />}
              </div>
              <p className={`mt-1 text-xs ${index <= currentStepIndex ? 'text-primary font-medium' : 'text-gray-500'}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </p>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="absolute top-5 left-0 w-full flex">
          <div className="h-1 bg-primary" style={{ width: `${currentStepIndex * 33.3}%` }} />
          <div className="h-1 bg-gray-200" style={{ width: `${100 - (currentStepIndex * 33.3)}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            Order #{order.id}
            <span className="ml-4 inline-block">
              {getStatusBadge(order.status)}
            </span>
          </h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
          <Button size="sm">
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Order status progress tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getProgressSteps()}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.trackingId && (
              <div>
                <h3 className="text-sm font-medium">Tracking Number</h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <TruckIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {order.trackingId}
                </p>
              </div>
            )}
            
            {order.estimatedDelivery && (
              <div>
                <h3 className="text-sm font-medium">Estimated Delivery</h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
            
            {order.shippingAddress && (
              <div>
                <h3 className="text-sm font-medium">Shipping Address</h3>
                <p className="text-gray-600 flex items-start mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-1 shrink-0" />
                  <span>{order.shippingAddress}</span>
                </p>
              </div>
            )}
            
            {order.paymentMethod && (
              <div>
                <h3 className="text-sm font-medium">Payment Method</h3>
                <p className="text-gray-600 mt-1">
                  {order.paymentMethod}
                </p>
              </div>
            )}
          </div>
          
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Status History</h3>
              <div className="space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(history.date).toLocaleString()}
                      </p>
                      {history.note && (
                        <p className="text-xs text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                  <img 
                    src={item.book.coverImage || "https://placehold.co/200x300?text=Book+Cover"} 
                    alt={item.book.title} 
                    className="w-20 h-28 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold mb-1">{item.book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Author: {item.book.authorName}</p>
                  <div className="flex justify-between text-sm">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.book.price)}</span>
                  </div>
                  
                  {item.book.isDownloadable && (
                    <Button size="sm" className="mt-2" variant="outline">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatPrice(order.totalAmount * 0.1)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount * 1.1)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {order.orderNotes && (
            <div className="w-full text-sm text-gray-600">
              <h4 className="font-medium mb-1">Order Notes:</h4>
              <p>{order.orderNotes}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};