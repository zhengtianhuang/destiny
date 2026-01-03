import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Star,
  Moon,
  Eye,
  Compass,
  BookOpen,
  ArrowRight,
  Palette,
  Hash,
  User,
  TrendingUp,
  Scroll,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Star,
    title: "西洋星盤",
    description: "根據您的出生時間，解讀太陽、月亮與上升星座的影響",
  },
  {
    icon: Compass,
    title: "人類圖",
    description: "探索您獨特的能量類型、人生策略與內在權威",
  },
  {
    icon: Moon,
    title: "紫微斗數",
    description: "傳統中華命理精髓，分析命宮主星與人生格局",
  },
  {
    icon: Eye,
    title: "面相分析",
    description: "透過 AI 識別面部特徵，解讀您的性格與運勢",
  },
  {
    icon: BookOpen,
    title: "易經卜卦",
    description: "千年智慧指引，為您的當下處境提供啟示",
  },
];

const insights = [
  {
    icon: User,
    title: "個性特質",
    description: "深入了解您與生俱來的性格特點與潛在才能",
  },
  {
    icon: TrendingUp,
    title: "職業方向",
    description: "發現最適合您發展的事業領域與成功策略",
  },
  {
    icon: Palette,
    title: "幸運顏色",
    description: "每日最適合穿著的顏色，提升運勢能量",
  },
  {
    icon: Hash,
    title: "幸運號碼",
    description: "專屬於您的幸運數字組合與樂透建議",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                融合東西方命理智慧
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              探索您的
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                天命軌跡
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              結合星盤、人類圖、紫微斗數、面相與易經，
              為您揭示個性特質、職業方向、運勢走向與專屬幸運號碼
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 px-8 py-6 text-lg rounded-full"
                  data-testid="button-start-analysis"
                >
                  開始解析
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/oracle">
                <Button
                  size="lg"
                  variant="outline"
                  className="group gap-2 px-8 py-6 text-lg rounded-full"
                  data-testid="button-start-oracle"
                >
                  <Scroll className="h-5 w-5" />
                  提問求籤
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              五大命理系統
            </h2>
            <p className="mt-4 text-muted-foreground">
              融會貫通東西方命理精髓，提供全方位的人生洞察
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-border/40 bg-card/50 backdrop-blur-sm hover-elevate"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              您將獲得的洞察
            </h2>
            <p className="mt-4 text-muted-foreground">
              專屬於您的個性化分析結果，指引生活各個層面
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className="border-border/40 hover-elevate"
                data-testid={`card-insight-${index}`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/80 dark:bg-accent">
                    <insight.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-serif text-lg font-medium">
                    {insight.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              準備好探索命運了嗎？
            </h2>
            <p className="mt-4 text-muted-foreground">
              只需幾分鐘，即可獲得專屬於您的完整命理分析報告
            </p>
            <div className="mt-8">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 px-8 py-6 text-lg rounded-full"
                  data-testid="button-cta-analyze"
                >
                  立即開始
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
