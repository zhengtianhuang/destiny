import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleContext";
import { BookOpen, Calendar, ChevronRight, Star, Compass, Eye, Sparkles, Hexagon } from "lucide-react";

interface Article {
  id: string;
  icon: typeof Star;
  titleKey: string;
  excerptKey: string;
  contentKey: string;
  date: string;
  category: string;
}

const articles: Article[] = [
  {
    id: "astrology-basics",
    icon: Star,
    titleKey: "articleAstrologyTitle",
    excerptKey: "articleAstrologyExcerpt",
    contentKey: "articleAstrologyContent",
    date: "2024-01-15",
    category: "astrology"
  },
  {
    id: "human-design-intro",
    icon: Compass,
    titleKey: "articleHumanDesignTitle",
    excerptKey: "articleHumanDesignExcerpt",
    contentKey: "articleHumanDesignContent",
    date: "2024-01-12",
    category: "humanDesign"
  },
  {
    id: "ziwei-doushu",
    icon: Hexagon,
    titleKey: "articleZiWeiTitle",
    excerptKey: "articleZiWeiExcerpt",
    contentKey: "articleZiWeiContent",
    date: "2024-01-10",
    category: "ziwei"
  },
  {
    id: "face-reading",
    icon: Eye,
    titleKey: "articleFaceReadingTitle",
    excerptKey: "articleFaceReadingExcerpt",
    contentKey: "articleFaceReadingContent",
    date: "2024-01-08",
    category: "faceReading"
  },
  {
    id: "iching-wisdom",
    icon: Sparkles,
    titleKey: "articleIChingTitle",
    excerptKey: "articleIChingExcerpt",
    contentKey: "articleIChingContent",
    date: "2024-01-05",
    category: "iching"
  }
];

export default function Blog() {
  const { t } = useLocale();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const getArticleText = (key: string) => {
    return (t.blog as Record<string, string>)?.[key] || key;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selected = articles.find(a => a.id === selectedArticle);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-blog-title">
              {t.blog?.title || "命理知識庫"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.blog?.subtitle || "深入了解各種命理系統的原理與智慧，開啟自我探索之旅"}
            </p>
          </div>

          {selectedArticle && selected ? (
            <div>
              <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => setSelectedArticle(null)}
                data-testid="button-back-to-list"
              >
                ← {t.blog?.backToList || "返回文章列表"}
              </Button>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selected.date)}
                  </div>
                  <CardTitle className="text-2xl font-serif">
                    {getArticleText(selected.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getArticleText(selected.contentKey)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <Card 
                  key={article.id} 
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => setSelectedArticle(article.id)}
                  data-testid={`card-article-${article.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <article.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.date)}
                        </div>
                        <h2 className="text-lg font-serif font-semibold mb-2">
                          {getArticleText(article.titleKey)}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {getArticleText(article.excerptKey)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-12">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-semibold mb-4">
                {t.blog?.disclaimerTitle || "內容聲明"}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.blog?.disclaimerContent || "本知識庫的所有文章均為教育和資訊目的而撰寫。命理分析是一門古老的學問，結合了天文、哲學與心理學的智慧。我們鼓勵讀者以開放的心態探索這些知識，但請記住，最終的人生決策應當基於您自己的判斷和實際情況。我們的內容旨在提供啟發和參考，而非絕對的預測或建議。"}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
