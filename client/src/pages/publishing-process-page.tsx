import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/ui/feature-card";
import { PUBLISHING_STEPS, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

const PublishingProcessPage = () => {
  const { user } = useAuth();

  const detailedSteps = [
    {
      number: 1,
      title: "Upload Your Manuscript",
      description: "Begin your publishing journey by uploading your completed manuscript to our platform.",
      details: [
        "Accept all major file formats (DOC, DOCX, PDF, RTF)",
        "Easy-to-use drag-and-drop interface",
        "Automatic backup of your manuscript",
        "Version control to track changes and revisions"
      ],
      icon: "ri-upload-cloud-line"
    },
    {
      number: 2,
      title: "Professional Editing",
      description: "Our expert editors will review your manuscript to ensure it's polished and error-free.",
      details: [
        "Comprehensive grammar and spelling checks",
        "Content and structural editing",
        "Stylistic consistency review",
        "Author collaboration with direct communication with editors"
      ],
      icon: "ri-edit-2-line"
    },
    {
      number: 3,
      title: "Cover Design & Formatting",
      description: "Create a professional and eye-catching cover design that attracts readers.",
      details: [
        "Professional cover design services",
        "Interior formatting and layout optimization",
        "E-book format conversion (EPUB, MOBI, PDF)",
        "Device-responsive design for all screen sizes"
      ],
      icon: "ri-book-2-line"
    },
    {
      number: 4,
      title: "Publication & Distribution",
      description: "Publish your e-book and make it available to readers worldwide.",
      details: [
        "Global distribution through major e-book retailers",
        "ISBN assignment and cataloging",
        "Metadata optimization for discoverability",
        "Real-time sales tracking and analytics"
      ],
      icon: "ri-global-line"
    },
    {
      number: 5,
      title: "Marketing & Promotion",
      description: "Promote your book to reach a wider audience and maximize sales.",
      details: [
        "Strategic marketing campaign development",
        "Social media promotion and author branding",
        "Email newsletter campaigns",
        "Book review solicitation and management"
      ],
      icon: "ri-megaphone-line"
    },
    {
      number: 6,
      title: "Sales & Royalties",
      description: "Track your e-book's performance and receive royalty payments.",
      details: [
        "Transparent royalty reporting",
        "Monthly payments",
        "Detailed sales analytics by platform and region",
        "Performance insights and optimization recommendations"
      ],
      icon: "ri-money-dollar-circle-line"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Our Publishing Process</h1>
            <p className="text-xl mb-6">
              A streamlined journey from manuscript to published e-book
            </p>
            <Button 
              asChild
              className="px-6 py-3 bg-[#E94F37] rounded-md text-white font-medium hover:bg-[#C73623] transition-colors"
            >
              <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                Start Your Publishing Journey
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>The Path to Publication</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Our simple 4-step process takes your manuscript from draft to published e-book with professional support at every stage
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

      {/* Detailed Process Steps */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Detailed Publishing Process</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              A comprehensive look at each stage of your publishing journey with {APP_NAME}
            </p>
          </div>
          
          <div className="space-y-12">
            {detailedSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="bg-primary text-white p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <i className={`${step.icon} text-3xl`}></i>
                    </div>
                    <div className="text-3xl font-bold mb-2">Step {step.number}</div>
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{step.title}</h3>
                  </div>
                  <div className="md:col-span-3 p-8">
                    <p className="text-lg text-neutral-800 mb-6">{step.description}</p>
                    <h4 className="font-bold mb-3">What to expect:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <Button 
                        asChild
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <Link href="/contact">
                          Have Questions About This Step?
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Publishing Timeline</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              A typical timeline for your book's journey from manuscript to market
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
              
              <div className="relative z-10">
                {/* Timeline items */}
                <div className="mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div className="bg-neutral-100 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Week 1</h3>
                    <p className="text-neutral-700">
                      Manuscript upload and initial review
                    </p>
                  </div>
                </div>
                
                <div className="mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div className="bg-neutral-100 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Weeks 2-3</h3>
                    <p className="text-neutral-700">
                      Professional editing and author revisions
                    </p>
                  </div>
                </div>
                
                <div className="mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div className="bg-neutral-100 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Week 4</h3>
                    <p className="text-neutral-700">
                      Cover design and formatting
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                  </div>
                  <div className="bg-neutral-100 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Weeks 5-6</h3>
                    <p className="text-neutral-700">
                      Final review, publication, and distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-neutral-600 italic mb-4">
                *Timeline may vary based on manuscript length, complexity, and chosen publishing package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Author Success Stories</h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Hear from authors who have successfully published with our platform
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Sarah Johnson" 
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="text-2xl text-primary/30 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>"</div>
                  <p className="text-neutral-800 italic mb-6 text-lg">
                    The publishing process with {APP_NAME} was remarkably smooth. From manuscript upload to seeing my book available in major 
                    stores took just 6 weeks. The editorial feedback dramatically improved my work, and the cover design exceeded my expectations. 
                    I've now published three books through their platform and wouldn't go anywhere else.
                  </p>
                  <div>
                    <p className="font-bold">Sarah Johnson</p>
                    <p className="text-sm text-neutral-600">Bestselling Author of "Beyond the Horizon"</p>
                  </div>
                </div>
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
              Common questions about our publishing process
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How long does the entire publishing process take?</h3>
                <p className="text-neutral-700">
                  The typical timeline from manuscript submission to publication is 4-6 weeks, depending on the length and complexity of your book 
                  and how quickly you respond to editorial feedback. Rush services are available for time-sensitive projects.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Can I make changes to my book after it's published?</h3>
                <p className="text-neutral-700">
                  Yes, you can update your e-book after publication. Updates to the content, cover, or metadata can usually be implemented within 
                  1-2 business days and will be reflected across all distribution channels within a week.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Do I maintain the rights to my book?</h3>
                <p className="text-neutral-700">
                  Absolutely. You retain 100% of the rights to your content. Our platform simply provides the tools and services to help you publish 
                  and distribute your work. You can remove your book from our platform at any time.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Where will my e-book be available for sale?</h3>
                <p className="text-neutral-700">
                  Your e-book will be distributed to all major online retailers including Amazon Kindle, Apple Books, Barnes & Noble Nook, Kobo, 
                  and Google Play Books. The specific platforms depend on your chosen publishing plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Begin Your Publishing Journey Today</h2>
            <p className="text-xl mb-8">
              Transform your manuscript into a professional e-book and share your story with readers worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="px-6 py-3 bg-[#E94F37] rounded-md text-white font-medium hover:bg-[#C73623] transition-colors"
              >
                <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                  Start Publishing Now
                </Link>
              </Button>
              <Button 
                asChild
                variant="secondary"
                className="px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-neutral-100 transition-colors"
              >
                <Link href="/pricing">
                  View Publishing Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublishingProcessPage;