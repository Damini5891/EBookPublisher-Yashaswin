import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { PUBLISHING_PLANS } from "@/lib/constants";
import { Loader2, CheckIcon, XIcon, BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  recommended: boolean;
}

export const ServiceSelection = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Example publishing plans with various features and pricing
  const publishingPlans = PUBLISHING_PLANS;
  
  // Example additional services that can be added to any plan
  const additionalServices: AdditionalService[] = [
    {
      id: "cover-design-premium",
      name: "Premium Cover Design",
      description: "Professional cover design with 3 custom concepts and unlimited revisions.",
      price: 299,
      recommended: true
    },
    {
      id: "marketing-package",
      name: "Marketing Package",
      description: "Social media promotion, press release, and author website setup.",
      price: 499,
      recommended: true
    },
    {
      id: "editorial-review",
      name: "Editorial Review",
      description: "In-depth manuscript evaluation with detailed feedback from a professional editor.",
      price: 349,
      recommended: false
    },
    {
      id: "audiobook-production",
      name: "Audiobook Production",
      description: "Professional narration and audio production for your book.",
      price: 799,
      recommended: false
    },
    {
      id: "print-distribution",
      name: "Print Distribution",
      description: "Get your book into physical bookstores with our distribution network.",
      price: 249,
      recommended: true
    }
  ];
  
  // Submit selected services to proceed to checkout
  const selectServicesMutation = useMutation({
    mutationFn: async (data: { planId: string; additionalServices: string[] }) => {
      const res = await apiRequest("POST", "/api/publishing/services", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Services Selected",
        description: "Your publishing package has been created",
      });
      navigate("/checkout");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  
  const handleSubmit = () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a publishing plan to continue",
        variant: "destructive",
      });
      return;
    }
    
    selectServicesMutation.mutate({
      planId: selectedPlan,
      additionalServices: selectedServices,
    });
  };
  
  // Calculate total price
  const calculateTotal = () => {
    const selectedPlanPrice = selectedPlan 
      ? publishingPlans.find(plan => plan.id === selectedPlan)?.price || 0
      : 0;
      
    const additionalServicesPrice = selectedServices
      .map(id => additionalServices.find(service => service.id === id)?.price || 0)
      .reduce((a, b) => a + b, 0);
      
    return selectedPlanPrice + additionalServicesPrice;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Publishing Path</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the publishing package that fits your needs and budget. 
          Each plan includes different services to help bring your book to life.
        </p>
      </div>
      
      {/* Publishing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publishingPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative overflow-hidden ${
              selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
            } ${plan.popular ? 'shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{plan.name}</span>
              </CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-sm text-gray-500 ml-1">{plan.priceUnit}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`mr-2 mt-0.5 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                      {feature.included ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <XIcon className="h-5 w-5" />
                      )}
                    </span>
                    <span className={feature.included ? '' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              {plan.timeline && (
                <div className="pt-3 flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Timeline: {plan.timeline}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={selectedPlan === plan.id ? "default" : "outline"}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedPlan && (
        <>
          <Separator className="my-8" />
          
          {/* Additional Services */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Enhance Your Publishing Package</h2>
            <p className="text-gray-600 mb-6">
              Select additional services to maximize the success of your book
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`${
                    selectedServices.includes(service.id) ? 'ring-2 ring-primary' : ''
                  } ${service.recommended ? 'relative overflow-hidden' : ''}`}
                >
                  {service.recommended && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-yellow-500">Recommended</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <div className="mt-1">
                      <span className="text-2xl font-bold">{formatPrice(service.price)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={selectedServices.includes(service.id) ? "default" : "outline"}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      {selectedServices.includes(service.id) ? "Selected" : "Add Service"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Your Publishing Package</h2>
            
            <div className="space-y-4">
              {selectedPlan && (
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{publishingPlans.find(p => p.id === selectedPlan)?.name} Plan</h3>
                    <p className="text-sm text-gray-600">{publishingPlans.find(p => p.id === selectedPlan)?.description}</p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(publishingPlans.find(p => p.id === selectedPlan)?.price || 0)}
                  </span>
                </div>
              )}
              
              {selectedServices.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium">Additional Services</h3>
                    {selectedServices.map((serviceId) => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>{formatPrice(service.price)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </>
              )}
              
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              
              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={handleSubmit}
                disabled={selectServicesMutation.isPending}
              >
                {selectServicesMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};