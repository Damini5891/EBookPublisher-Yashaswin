import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ui/service-card";
import BookCard from "@/components/ui/book-card";
import FeatureCard from "@/components/ui/feature-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import sunny from "../../../attached_assets/sunny.png";

import {
  FEATURES,
  PUBLISHING_STEPS,
  TESTIMONIALS,
  FEATURED_AUTHOR,
  APP_NAME,
  APP_TAGLINE,
} from "@/lib/constants";
import { Book } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

const HomePage = () => {
  const { user } = useAuth();

  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const featuredBooks = books.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1
                className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {APP_TAGLINE}
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
                Your one-stop platform for self-publishing, editing, and
                distributing your e-books to readers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
                  <Link href="/bookstore">Explore Bookstore</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Person writing a book on laptop"
                  className="w-full object-cover rounded-lg"
                  style={{ height: "500px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent rounded-lg"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white text-sm font-medium mb-2">
                    FEATURED AUTHOR
                  </p>
                  <p
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "Yashaswin helped me bring my story to life."
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#E94F37] p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                    <i className="ri-book-line text-[#E94F37] text-xl"></i>
                  </div>
                  <div>
                    <p className="text-white font-bold">50+</p>
                    <p className="text-white text-sm">Published Books</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Distribution Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Worldwide Distribution
            </h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Publish your book in multiple formats and reach readers globally
              through our extensive distribution network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-book-open-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Paperback Books</h3>
              <p className="text-neutral-700 mb-4">
                Professional print-on-demand service with global distribution
                through Amazon, Flipkart, eBay, Meesho and more.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Amazon
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Flipkart
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  eBay
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Meesho
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-tablet-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">E-Books</h3>
              <p className="text-neutral-700 mb-4">
                Format your book for all major e-readers and distribute to
                leading online bookstores worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Google Play Books
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Apple Books
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Kindle
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Kobo
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-headphone-line text-amber-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Audiobooks</h3>
              <p className="text-neutral-700 mb-4">
                Professional narration and production with distribution to
                leading audiobook platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Audible
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  iTunes
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Google Play
                </span>
                <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-800 text-xs rounded">
                  Spotify
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/publishing-process">
              <Button className="px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
                Learn More About Our Distribution
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Why Choose {APP_NAME}?
            </h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Our platform offers everything you need to transform your
              manuscript into a professional book in any format.
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
      <section id="services" className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              How It Works
            </h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Our simple 4-step process to take your manuscript from draft to
              published e-book
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

          <div className="mt-12 text-center">
            <Button
              asChild
              className="px-6 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/90 transition-colors"
            >
              <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bookstore Preview */}
      <section id="bookstore" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Featured Books
              </h2>
              <p className="text-lg text-neutral-800">
                Discover the latest publications from our talented authors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="px-6 py-3 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
            >
              <Link href="/bookstore">Browse All Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Author Spotlight
            </h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Meet the successful authors who chose {APP_NAME} for their
              publishing journey
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="text-[#E94F37] font-medium mb-4">
                  FEATURED AUTHOR
                </p>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  {FEATURED_AUTHOR.name}
                </h3>
                <p className="text-neutral-800 mb-6 leading-relaxed">
                  {FEATURED_AUTHOR.bio}
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-700 mb-6">
                  {FEATURED_AUTHOR.quote}
                </blockquote>
                <div className="flex items-center space-x-4">
                  <Button className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary hover:text-white transition-colors"
                  >
                    View Books
                  </Button>
                </div>
              </div>
              <div className="h-64 md:h-auto">
                <img
                  src={sunny}
                  alt={`Author ${FEATURED_AUTHOR.name}`}
                  className="w-2/4 h-3/4 object-cover mx-auto mt-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-neutral-200 border-t border-neutral-200 mt-0">
              {FEATURED_AUTHOR.stats.map((stat, index) => (
                <div key={index} className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              What Our Authors Say
            </h2>
            <p className="text-lg text-neutral-800 max-w-3xl mx-auto">
              Hear from authors who have successfully published with {APP_NAME}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                rating={testimonial.rating}
                text={testimonial.text}
                image={testimonial.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl font-bold mb-4 text-white"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Get the latest publishing tips, author success stories, and
              exclusive offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
              />
              <Button className="px-6 py-3 bg-[#E94F37] text-white rounded-md font-medium hover:bg-[#C73623] transition-colors whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
