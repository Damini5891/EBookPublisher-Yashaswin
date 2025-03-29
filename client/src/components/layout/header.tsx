import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { APP_NAME } from "@/lib/constants";
import MobileMenu from "./mobile-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Bookstore", path: "/bookstore" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 8H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 2V22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-primary" style={{ fontFamily: "'Merriweather', serif" }}>
                {APP_NAME}
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`${
                  isActive(item.path) 
                    ? "text-primary font-medium" 
                    : "text-neutral-800 hover:text-primary font-medium"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user?.isAuthor && (
              <Link 
                href="/dashboard"
                className={`${
                  isActive("/dashboard") 
                    ? "text-primary font-medium" 
                    : "text-neutral-800 hover:text-primary font-medium"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-neutral-800">
                  Hello, {user.username}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Link href="/auth">Log In</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Link href="/auth?tab=register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              onClick={toggleMobileMenu}
              className="text-primary"
              aria-label="Menu"
            >
              <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          navItems={navItems} 
          user={user} 
          onLoginClick={() => {
            setIsMobileMenuOpen(false);
          }}
          onLogoutClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
    </header>
  );
};

export default Header;
