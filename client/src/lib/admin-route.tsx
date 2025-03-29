import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function AdminRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    toast({
      title: "Access Denied",
      description: "Please log in to access the admin panel",
      variant: "destructive",
    });
    return (
      <Route path={path}>
        <Redirect to="/auth?tab=admin" />
      </Route>
    );
  }

  // Check if user has admin privileges
  if (!user.isAdmin) {
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this area",
      variant: "destructive",
    });
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}