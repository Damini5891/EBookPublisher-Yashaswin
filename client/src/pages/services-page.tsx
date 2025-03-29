import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ui/service-card";
import FeatureCard from "@/components/ui/feature-card";
import PricingCard from "@/components/ui/pricing-card";
import { 
  FEATURES, 
  PUBLISHING_STEPS, 
  PUBLISHING_PLANS 
} from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const ServicesPage = () => {
  const { user } = useAuth();

  const handleSelectPlan = (planName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to select a publishing plan.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${planName} plan selected`,
      description: "You can now start publishing your book.",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Our Publishing Services</h1>
            <p className="text-xl mb-8">
              Comprehensive e-book publishing solutions to help you bring your manuscript to life
            </p>
            <Button 
              asChild
              className="px-6 py-3 bg-[#E94F37] rounded-md text-white font-medium hover:bg-[#C73623] transition-colors"
            >
              <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Comprehensive Publishing Services</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Everything you need to transform your manuscript into a successful e-book
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <ServiceCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Publishing Process */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Our Publishing Process</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              A simple, streamlined journey from manuscript to published e-book
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PUBLISHING_STEPS.map((step, index) => (
              <FeatureCard 
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                isLast={index === PUBLISHING_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Choose Your Publishing Plan</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Select the plan that best fits your publishing needs and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PUBLISHING_PLANS.map((plan, index) => (
              <PricingCard 
                key={index}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                priceUnit={plan.priceUnit}
                features={plan.features}
                popular={plan.popular}
                onSelect={() => handleSelectPlan(plan.name)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-600 mb-4">
              Not sure which plan is right for you? 
            </p>
            <Button 
              asChild
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Link href="/contact">
                Contact Us for Custom Solutions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Ready to Start Your Publishing Journey?</h2>
            <p className="text-xl mb-8">
              Join thousands of authors who have successfully published their books with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="px-6 py-3 bg-[#E94F37] rounded-md text-white font-medium hover:bg-[#C73623] transition-colors"
              >
                <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                  Start Publishing
                </Link>
              </Button>
              <Button 
                asChild
                variant="secondary"
                className="px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-neutral-100 transition-colors"
              >
                <Link href="/contact">
                  Get a Free Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
