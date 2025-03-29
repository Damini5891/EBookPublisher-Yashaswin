import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/ui/pricing-card";
import { PUBLISHING_PLANS, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const PricingPage = () => {
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

  const additionalFeatures = [
    { name: "Dedicated Support Agent", description: "Get personalized assistance from our experts" },
    { name: "Professional Editing", description: "Specialized editing services for various genres" },
    { name: "Custom Marketing Strategy", description: "Tailored promotional plans for your target readers" },
    { name: "Interactive Book Features", description: "Add multimedia elements to your e-books" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Publishing Plans & Pricing</h1>
            <p className="text-xl mb-0">
              Flexible options to fit your publishing goals and budget
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Choose Your Publishing Plan</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Select the plan that best matches your publishing needs, budget, and goals
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
                Request a Custom Quote
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Plan Comparison */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Detailed Plan Comparison</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Compare all features to find the perfect fit for your publishing project
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-6 py-4 text-left">Features</th>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <th key={index} className="px-6 py-4 text-center">
                        {plan.name}
                        {plan.popular && <div className="text-xs mt-1 font-normal">(Most Popular)</div>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Price</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        ${plan.price} <span className="text-xs text-neutral-500">/ {plan.priceUnit}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">E-Book Format Conversion</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? 'Standard' : plan.name === 'Professional' ? 'Enhanced' : 'Premium'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Distribution Channels</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? '3 Channels' : plan.name === 'Professional' ? '10+ Channels' : '30+ Channels'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Royalty Rate</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? '70%' : plan.name === 'Professional' ? '80%' : '85%'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Cover Design</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? 'Template' : plan.name === 'Professional' ? 'Custom' : 'Premium Custom'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Marketing Support</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? 'Basic' : plan.name === 'Professional' ? 'Advanced' : 'Comprehensive'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Support Response Time</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? '48 hours' : plan.name === 'Professional' ? '24 hours' : 'Priority (4 hours)'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">ISBN</td>
                    {PUBLISHING_PLANS.map((plan, index) => (
                      <td key={index} className="px-6 py-4 text-center">
                        {plan.name === 'Basic' ? 
                          <i className="ri-check-line text-green-500"></i> : 
                          <i className="ri-check-line text-green-500"></i>}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Additional Services</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Enhance your publishing experience with our premium add-on services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg p-6 flex">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-add-line text-xl text-primary"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>{feature.name}</h3>
                  <p className="text-neutral-700 mb-4">{feature.description}</p>
                  <Button variant="link" className="text-primary p-0">Learn more</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-white rounded-lg p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Enterprise Solutions</h2>
                <p className="text-lg mb-0">
                  Custom publishing solutions for publishers, institutions, and organizations with 
                  multiple titles or special requirements.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  asChild
                  className="bg-white text-primary hover:bg-neutral-100 px-6 py-3 font-medium transition-colors whitespace-nowrap"
                >
                  <Link href="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Answers to common questions about our publishing plans and services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How do I choose the right plan?</h3>
                <p className="text-neutral-700">
                  Consider your publishing goals, budget, and the level of service you require. Our Basic plan is perfect for first-time authors, 
                  Professional is ideal for established authors looking for wider reach, and Premium offers the most comprehensive support.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Can I upgrade my plan later?</h3>
                <p className="text-neutral-700">
                  Yes, you can upgrade your plan at any time. We'll prorate the cost based on your current plan's remaining time.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Are there any hidden fees?</h3>
                <p className="text-neutral-700">
                  No, the prices listed include all the features stated. Additional services are clearly marked and only charged if you choose to add them.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How are royalties calculated and paid?</h3>
                <p className="text-neutral-700">
                  Royalties are calculated based on the net revenue from each sale. Your plan determines your royalty percentage (70%, 80%, or 85%). 
                  Payments are made monthly for all sales once you reach the $50 minimum payout threshold.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-neutral-700 mb-4">Have more questions about our plans?</p>
              <Button 
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/contact">
                  Contact Our Support Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Ready to Publish Your Book?</h2>
            <p className="text-xl mb-8">
              Join thousands of authors who have successfully published with {APP_NAME}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="px-6 py-3 bg-[#E94F37] rounded-md text-white font-medium hover:bg-[#C73623] transition-colors"
              >
                <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                  Start Publishing Today
                </Link>
              </Button>
              <Button 
                asChild
                variant="secondary"
                className="px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-neutral-100 transition-colors"
              >
                <Link href="/publishing-process">
                  Learn About Our Process
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;