import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/lib/protected-route";

// Layout components
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ServicesPage from "@/pages/services-page";
import BookstorePage from "@/pages/bookstore-page";
import BookDetailPage from "@/pages/book-detail-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import AuthorDashboard from "@/pages/author-dashboard";
import AccountPage from "@/pages/account-page";
import CheckoutPage from "@/pages/checkout-page";
import PricingPage from "@/pages/pricing-page";
import PublishingProcessPage from "@/pages/publishing-process-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/bookstore" component={BookstorePage} />
          <Route path="/book/:id" component={BookDetailPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/publishing-process" component={PublishingProcessPage} />
          <ProtectedRoute path="/dashboard" component={AuthorDashboard} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
