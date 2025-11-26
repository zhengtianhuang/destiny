import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-medium">天命解析</span>
          </div>
          
          <p className="max-w-md text-sm text-muted-foreground">
            結合星盤、人類圖、紫微斗數、面相、易經等多種命理系統，
            為您提供專屬的運勢分析與生活指引。
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>以</span>
            <Heart className="h-3 w-3 text-primary" />
            <span>製作</span>
          </div>

          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} 天命解析。本服務僅供娛樂參考。
          </p>
        </div>
      </div>
    </footer>
  );
}
