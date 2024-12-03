import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <NavigationMenu className="max-w-screen px-4 py-2 border-b">
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}