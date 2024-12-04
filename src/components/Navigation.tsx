import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const { logout } = useAuth();

  return (
    <NavigationMenu className="max-w-screen px-4 py-2 border-b flex justify-between items-center">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md">
            Schedule Generator
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/preview" className="px-4 py-2 hover:bg-accent rounded-md">
            Schedule Preview
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/editor" className="px-4 py-2 hover:bg-accent rounded-md">
            Schedule Editor
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </NavigationMenu>
  );
}