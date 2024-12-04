import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 transition-all duration-300 hover:bg-accent"
    >
      <Sun className={`h-5 w-5 transition-all duration-300 ${
        theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
      } absolute`} />
      <Moon className={`h-5 w-5 transition-all duration-300 ${
        theme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      } absolute`} />
    </Button>
  );
}