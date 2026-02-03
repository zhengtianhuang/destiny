import { Link } from "wouter";
import { Sparkles, Heart } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

export function Footer() {
  const { t } = useLocale();
  
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-medium">{t.home.title}</span>
          </div>
          
          <p className="max-w-md text-sm text-muted-foreground">
            {t.home.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-privacy">
              {t.footer.privacy}
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-terms">
              {t.footer.terms}
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
              {t.footer.contact}
            </Link>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{t.footer.madeWith}</span>
            <Heart className="h-3 w-3 text-primary" />
          </div>

          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {t.home.title}. {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
