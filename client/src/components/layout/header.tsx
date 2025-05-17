import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { APP_NAME } from "@/lib/constants";
import MobileMenu from "./mobile-menu";
import logoimage from "../../../../attached_assets/logoimage.svg";
import logoname from "../../../../attached_assets/logoname.svg";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => location === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Publishing Process", path: "/publishing-process" },
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
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src={logoimage}
                alt="Logo Image"
                style={{ width: "50px", height: "80px" }}
              />
              <img
                src={logoname}
                alt="Logo Name"
                style={{ width: "200px", height: "150px" }}
              />
            </Link>
          </div>

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
                <span className="text-neutral-800">Hello, {user.username}</span>
                <Button
                  variant="outline"
                  asChild
                  className="border-primary text-primary hover:bg-primary hover:text-white mr-2"
                >
                  <Link href="/account">My Account</Link>
                </Button>
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
              <i
                className={`ri-${
                  isMobileMenuOpen ? "close" : "menu"
                }-line text-2xl`}
              ></i>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          navItems={navItems}
          user={user}
          onLoginClick={() => setIsMobileMenuOpen(false)}
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
