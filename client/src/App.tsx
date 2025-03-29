import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/admin-route";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut, ChevronLeft } from "lucide-react";

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
import AdminPanel from "@/pages/admin-panel";
import NotFound from "@/pages/not-found";
import UserDashboard from "@/pages/user-dashboard-new";

// Admin Header Component
function AdminHeader() {
  const { logoutMutation } = useAuth();
  
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-gray-800">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Site
              </Button>
            </Link>
            <h1 className="text-xl font-bold">PageCraft Admin</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-gray-800"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

// User Account Header Component
function UserAccountHeader() {
  const { logoutMutation } = useAuth();
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-primary/80">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Site
              </Button>
            </Link>
            <h1 className="text-xl font-bold">My Account</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-primary/80"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes with Admin Layout */}
      <Route path="/admin-panel">
        <div className="flex flex-col min-h-screen bg-gray-100">
          <AdminHeader />
          <main className="flex-grow container mx-auto px-4 py-6">
            <AdminPanel />
          </main>
        </div>
      </Route>
      
      {/* User Dashboard Route with User Account Layout */}
      <Route path="/user-dashboard">
        <div className="flex flex-col min-h-screen bg-gray-50">
          <UserAccountHeader />
          <main className="flex-grow container mx-auto px-4 py-6">
            <UserDashboard />
          </main>
        </div>
      </Route>
      
      {/* Author Dashboard Route with User Account Layout */}
      <Route path="/author-dashboard">
        <div className="flex flex-col min-h-screen bg-gray-50">
          <UserAccountHeader />
          <main className="flex-grow container mx-auto px-4 py-6">
            <AuthorDashboard />
          </main>
        </div>
      </Route>
      
      {/* Standard Website Routes with Header and Footer */}
      <Route>
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
              <AdminRoute path="/admin" component={AdminPanel} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
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
