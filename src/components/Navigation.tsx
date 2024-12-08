import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  const { logout } = useAuth();

  return (
    <NavigationMenu className="max-w-screen px-4 py-2 border-b flex justify-between items-center bg-background">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md">
            Generator Grafiku
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/preview" className="px-4 py-2 hover:bg-accent rounded-md">
            Podgląd Grafiku
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/editor" className="px-4 py-2 hover:bg-accent rounded-md">
            Edytor Grafiku
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="outline" onClick={logout}>
          Wyloguj
        </Button>
      </div>
    </NavigationMenu>
  );
}