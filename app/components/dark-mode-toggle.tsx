import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "./ui/button";

export function DarkModeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        theme === Theme.LIGHT ? setTheme(Theme.DARK) : setTheme(Theme.LIGHT)
      }
    >
      <Sun className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
      <Moon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
