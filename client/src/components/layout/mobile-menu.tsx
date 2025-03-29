import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: { name: string; path: string }[];
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  user, 
  onLoginClick, 
  onLogoutClick 
}: MobileMenuProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden pb-4 animate-accordion-down">
      <div className="flex flex-col space-y-2 pt-2 pb-3">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={onLoginClick}
            className="px-3 py-2 text-neutral-800 hover:text-primary font-medium"
          >
            {item.name}
          </Link>
        ))}
        {user?.isAuthor && (
          <Link 
            href="/dashboard"
            onClick={onLoginClick}
            className="px-3 py-2 text-neutral-800 hover:text-primary font-medium"
          >
            Dashboard
          </Link>
        )}
      </div>
      <div className="flex flex-col space-y-2 pt-2">
        {user ? (
          <>
            <div className="px-3 py-2 text-neutral-800">
              Hello, {user.username}
            </div>
            <Button 
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary hover:text-white mb-2"
              onClick={onLoginClick}
            >
              <Link href="/account">My Account</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogoutClick}
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
              onClick={onLoginClick}
            >
              <Link href="/auth">Log In</Link>
            </Button>
            <Button 
              asChild
              className="bg-primary text-white hover:bg-primary/90"
              onClick={onLoginClick}
            >
              <Link href="/auth?tab=register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
