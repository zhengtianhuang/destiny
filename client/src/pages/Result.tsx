import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Star,
  Compass,
  Moon,
  Eye,
  BookOpen,
  Briefcase,
  Palette,
  Hash,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Heart,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Play,
} from "lucide-react";
import type { FortuneResult } from "@shared/schema";

const colorMap: Record<string, string> = {
  紅色: "bg-red-500",
  橙色: "bg-orange-500",
  黃色: "bg-yellow-400",
  綠色: "bg-green-500",
  藍色: "bg-blue-500",
  紫色: "bg-purple-500",
  粉色: "bg-pink-400",
  白色: "bg-white border border-border",
  黑色: "bg-gray-900",
  金色: "bg-amber-400",
  銀色: "bg-gray-300",
  米色: "bg-amber-100",
  棕色: "bg-amber-700",
  灰色: "bg-gray-500",
};

const genderLabel: Record<string, string> = {
  male: "男",
  female: "女",
  other: "其他",
};

export default function Result() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<FortuneResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("fortuneResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        setLocation("/analyze");
      }
    } else {
      setLocation("/analyze");
    }
  }, [setLocation]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  const { input, personality, career, dailyFortune, ziWei, humanDesign, astrology, iChing, lifeCoach, guardianRole } = result;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* User Summary Header */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 md:h-24 md:w-24">
                <User className="h-10 w-10 text-primary md:h-12 md:w-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-serif text-3xl font-semibold md:text-4xl" data-testid="text-user-name">
                  {input.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {input.birthYear}/{input.birthMonth}/{input.birthDay}
                  </Badge>
                  <Badge variant="secondary">
                    {genderLabel[input.gender]}
                  </Badge>
                  {input.birthPlace && (
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {input.birthPlace}
                    </Badge>
                  )}
                </div>
                <p className="mt-4 text-muted-foreground">
                  {astrology.zodiacSign} · {humanDesign.type} · {ziWei.mainStar}
                </p>
              </div>
              <Link href="/analyze">
                <Button variant="outline" className="gap-2 rounded-full" data-testid="button-reanalyze">
                  <RefreshCw className="h-4 w-4" />
                  重新分析
                </Button>
              </Link>
            </div>
          </div>

          {/* Daily Fortune Section */}
          <section className="mb-8">
            <Card className="overflow-hidden border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                  今日運勢
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground" data-testid="text-daily-fortune">
                  {dailyFortune.overallFortune}
                </p>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Lucky Colors */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">今日幸運色</span>
                    </div>
                    <div className="flex flex-wrap gap-3" data-testid="colors-lucky">
                      {dailyFortune.luckyColors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-full ${colorMap[color] || "bg-primary"}`}
                          />
                          <span className="text-sm">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lucky Numbers */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">幸運號碼</span>
                    </div>
                    <div className="flex flex-wrap gap-2" data-testid="numbers-lucky">
                      {dailyFortune.luckyNumbers.map((num, index) => (
                        <div
                          key={index}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono font-semibold text-primary"
                        >
                          {num.toString().padStart(2, "0")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-accent-foreground" />
                    <p className="text-sm text-muted-foreground" data-testid="text-daily-advice">
                      {dailyFortune.advice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Analysis Grid */}
          <section className="mb-8">
            <h2 className="mb-6 font-serif text-2xl font-semibold">命理分析</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Personality Card */}
              <Card className="md:col-span-2 lg:col-span-1" data-testid="card-personality">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <User className="h-5 w-5 text-primary" />
                    個性特質
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{personality.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <Heart className="h-4 w-4 text-green-500" />
                        優勢
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {personality.strengths.map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        需注意
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {personality.weaknesses.map((w, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {w}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Card */}
              <Card data-testid="card-career">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Briefcase className="h-5 w-5 text-primary" />
                    職業發展
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{career.advice}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        適合領域
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {career.suitableFields.map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        需謹慎
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {career.avoidFields.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Astrology Card */}
              <Card data-testid="card-astrology">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Star className="h-5 w-5 text-primary" />
                    西洋星盤
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{astrology.zodiacSign}</Badge>
                    {astrology.moonSign && (
                      <Badge variant="secondary">{astrology.moonSign}</Badge>
                    )}
                    {astrology.risingSign && (
                      <Badge variant="outline">{astrology.risingSign}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {astrology.interpretation}
                  </p>
                </CardContent>
              </Card>

              {/* Human Design Card */}
              <Card data-testid="card-human-design">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Compass className="h-5 w-5 text-primary" />
                    人類圖
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">類型</span>
                      <span className="font-medium">{humanDesign.type}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">策略</span>
                      <span className="font-medium">{humanDesign.strategy}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">內在權威</span>
                      <span className="font-medium">{humanDesign.authority}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {humanDesign.description}
                  </p>
                </CardContent>
              </Card>

              {/* Zi Wei Card */}
              <Card data-testid="card-ziwei">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Moon className="h-5 w-5 text-primary" />
                    紫微斗數
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">命宮主星</span>
                      <span className="font-medium">{ziWei.mainStar}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">命宮</span>
                      <span className="font-medium">{ziWei.palace}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ziWei.interpretation}
                  </p>
                </CardContent>
              </Card>

              {/* I-Ching Card */}
              <Card data-testid="card-iching">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <BookOpen className="h-5 w-5 text-primary" />
                    易經卦象
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 font-serif text-2xl font-bold text-primary">
                      {iChing.hexagram}
                    </div>
                    <div>
                      <p className="font-medium">{iChing.hexagramName}</p>
                      <p className="text-sm text-muted-foreground">本卦</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {iChing.interpretation}
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm">
                      <span className="font-medium">卦辭：</span>
                      {iChing.advice}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Guardian Role Section */}
          <section className="mb-8">
            <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                  你的守護者角色
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-2xl font-bold text-primary">{guardianRole.role}</p>
                  <p className="text-sm text-muted-foreground">元素：{guardianRole.element}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">特殊能力</p>
                  <p className="text-muted-foreground">{guardianRole.specialPower}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="italic text-sm">{guardianRole.message}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Life Coach Section */}
          <section className="mb-8">
            <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  今日人生教練建議
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="font-medium text-sm text-primary">{lifeCoach.dailyReminder}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">今日行動建議</p>
                  <ul className="space-y-2">
                    {lifeCoach.todayActions.map((action: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{idx + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full gap-2 mt-4" data-testid="button-watch-ad">
                  <Play className="h-4 w-4" />
                  觀看廣告解鎖深度分析
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Detailed Breakdowns Accordion */}
          <section className="mb-8">
            <h2 className="mb-6 font-serif text-2xl font-semibold">詳細解讀</h2>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="personality" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline" data-testid="accordion-personality">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    性格特質詳解
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{personality.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {personality.traits.map((trait: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="career" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline" data-testid="accordion-career">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    職業規劃建議
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-muted-foreground">{career.advice}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="daily" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline" data-testid="accordion-daily">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    每日運勢解讀
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">{dailyFortune.overallFortune}</p>
                    <p className="text-muted-foreground">{dailyFortune.advice}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link href="/analyze">
              <Button
                size="lg"
                className="gap-2 rounded-full px-8"
                data-testid="button-new-analysis"
              >
                進行新的分析
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
