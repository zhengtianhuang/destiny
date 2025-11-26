import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              天命解析
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {!isHome && (
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back-home">
                返回首頁
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
