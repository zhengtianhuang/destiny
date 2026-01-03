import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleContext";

export function Header() {
  const [location] = useLocation();
  const isHome = location === "/";
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              {t("home.title")}
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {!isHome && (
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back-home">
                {t("result.backHome")}
              </Button>
            </Link>
          )}
          <Link href="/history">
            <Button variant="ghost" size="icon" data-testid="link-history">
              <History className="h-5 w-5" />
            </Button>
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
