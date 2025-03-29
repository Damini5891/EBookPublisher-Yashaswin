import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { CONTACT_INFO, BUSINESS_HOURS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  // Enhanced contact schema with custom error messages
  const contactFormSchema = insertContactSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      form.reset();
      setIsSuccess(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Merriweather', serif" }}>Get In Touch</h1>
            <p className="text-xl mb-0">
              Have questions or need assistance with your publishing journey? We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-100 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {isSuccess ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-check-line text-3xl"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Message Sent!</h3>
                      <p className="text-neutral-700 mb-6">
                        Thank you for reaching out to us. We'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Send Us a Message</h3>
                        
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Publishing Inquiry" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Your message here..." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={contactMutation.isPending}
                        >
                          {contactMutation.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
                
                <div>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <i className="ri-map-pin-line text-primary text-xl mt-1 mr-4"></i>
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-neutral-600">{CONTACT_INFO.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <i className="ri-mail-line text-primary text-xl mt-1 mr-4"></i>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-neutral-600">{CONTACT_INFO.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <i className="ri-phone-line text-primary text-xl mt-1 mr-4"></i>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-neutral-600">{CONTACT_INFO.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Operating Hours</h3>
                    <ul className="space-y-2">
                      {BUSINESS_HOURS.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span className="text-neutral-600">{item.day}</span>
                          <span className="font-medium">{item.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "'Merriweather', serif" }}>Visit Our Office</h2>
            <div className="rounded-lg overflow-hidden shadow-lg h-[400px] bg-white flex items-center justify-center">
              <div className="text-center p-6">
                <i className="ri-map-2-line text-5xl text-neutral-400 mb-3"></i>
                <p className="text-neutral-600">
                  Map integration would be displayed here in a production environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: "'Merriweather', serif" }}>Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How long does the publishing process take?</h3>
                <p className="text-neutral-700">
                  The typical timeline from manuscript submission to publication is 2-4 weeks, depending on the complexity of your book and the services you choose.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How much does it cost to publish my book?</h3>
                <p className="text-neutral-700">
                  We offer various publishing packages starting from $99. Visit our Services page for detailed pricing information.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>Do I retain the rights to my book?</h3>
                <p className="text-neutral-700">
                  Yes, you retain 100% of the rights to your book. Our platform simply provides the tools and distribution channels to help you publish and sell your work.
                </p>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>How are royalties calculated and paid?</h3>
                <p className="text-neutral-700">
                  Royalties are calculated based on your chosen publishing plan (70-85% of the sale price) and are paid monthly for all sales that reach the minimum payout threshold of $50.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
