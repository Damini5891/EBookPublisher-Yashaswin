import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>About {APP_NAME}</h1>
            <p className="text-xl mb-0">
              Empowering authors to publish professionally and reach readers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Our Story</h2>
                <p className="text-neutral-700 mb-4 leading-relaxed">
                  Founded in 2018, {APP_NAME} began with a simple mission: to democratize publishing and give authors the tools they need to share their stories with the world.
                </p>
                <p className="text-neutral-700 mb-4 leading-relaxed">
                  What started as a small team of book lovers and tech enthusiasts has grown into a comprehensive publishing platform that has helped thousands of authors publish their work and reach readers globally.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  We believe that every author deserves the opportunity to share their voice, regardless of their background or experience. Our platform is designed to make the publishing process accessible, affordable, and efficient.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1517770413964-df8ca61194a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Team working together" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Our Mission</h2>
            <p className="text-xl text-neutral-700 italic mb-8">
              "To empower authors with the tools, resources, and platform they need to bring their stories to life and connect with readers around the world."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>Innovation</h3>
                <p className="text-neutral-700">
                  We're constantly exploring new technologies and approaches to improve the publishing experience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-heart-line text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>Accessibility</h3>
                <p className="text-neutral-700">
                  We believe publishing should be accessible to everyone, regardless of technical expertise or budget.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-community-line text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>Community</h3>
                <p className="text-neutral-700">
                  We foster a supportive community where authors can connect, learn, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: "'Merriweather', serif" }}>Meet Our Team</h2>
            <p className="text-neutral-700 mb-12 text-center max-w-3xl mx-auto">
              Our diverse team of publishing experts, designers, developers, and book lovers is dedicated to helping authors succeed.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto" style={{ width: "150px", height: "150px" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Michael Thompson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>Michael Thompson</h3>
                <p className="text-primary font-medium mb-2">Founder & CEO</p>
                <p className="text-neutral-600">
                  Former publisher with 15+ years of industry experience.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto" style={{ width: "150px", height: "150px" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>Sarah Johnson</h3>
                <p className="text-primary font-medium mb-2">Head of Editorial</p>
                <p className="text-neutral-600">
                  Editor with experience at major publishing houses.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto" style={{ width: "150px", height: "150px" }}>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="David Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Merriweather', serif" }}>David Rodriguez</h3>
                <p className="text-primary font-medium mb-2">Chief Technology Officer</p>
                <p className="text-neutral-600">
                  Tech innovator with a passion for digital publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-white/80">Published Books</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="text-white/80">Authors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <p className="text-white/80">Monthly Readers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">120+</div>
              <p className="text-white/80">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: "'Merriweather', serif" }}>What Our Authors Say</h2>
            
            <div className="bg-neutral-100 rounded-lg p-8 mb-8 relative">
              <div className="text-6xl text-primary/20 absolute top-4 left-4" style={{ fontFamily: "'Playfair Display', serif" }}>"</div>
              <blockquote className="text-lg text-neutral-700 italic mb-6 relative z-10">
                {APP_NAME} transformed my publishing journey. As a first-time author, I was intimidated by the process, but their platform and support team made it seamless. I've now published three books with them and couldn't be happier with the results.
              </blockquote>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="Emma Davis" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold">Emma Davis</div>
                  <div className="text-sm text-neutral-600">Bestselling Fantasy Author</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                asChild
                className="px-6 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/90 transition-colors"
              >
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
