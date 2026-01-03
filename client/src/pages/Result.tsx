import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { adService } from "@/lib/adService";
import { useLocale } from "@/i18n/LocaleContext";
import { getCredits, spendCredits, FACE_READING_COST } from "@shared/monetization";
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
  Loader2,
  Zap,
  Scroll,
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

export default function Result() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);
  const [credits, setCredits] = useState(getCredits());
  const { toast } = useToast();
  const { t } = useLocale();

  const genderLabel: Record<string, string> = {
    male: t.analyze?.male || "男",
    female: t.analyze?.female || "女",
    other: t.analyze?.other || "其他",
  };

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

  const handleWatchRewardAd = async () => {
    setWatchingAd(true);
    try {
      const result = await adService.showRewardedAd();
      if (result.earned) {
        setCredits(getCredits());
        toast({
          title: `✅ ${t.analyze?.adComplete || "廣告觀看完成"}`,
          description: t.analyze?.adCompleteDesc || "恭喜！獲得 2 次分析機會 + 100 點數",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Ad display failed:", error);
      toast({
        title: `⚠️ ${t.analyze?.adFailed || "廣告加載失敗"}`,
        description: t.analyze?.adFailedDesc || "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setWatchingAd(false);
    }
  };

  const handleUnlockFaceReading = () => {
    if (spendCredits(FACE_READING_COST)) {
      setCredits(getCredits());
      toast({
        title: `✅ ${t.result?.faceReading || "面相分析已解鎖"}`,
        description: `${t.result?.spent || "消耗"} ${FACE_READING_COST} ${t.result?.points || "點數"}`,
        duration: 2000,
      });
    } else {
      toast({
        title: `❌ ${t.result?.insufficientPoints || "點數不足"}`,
        description: `${t.result?.need || "需要"} ${FACE_READING_COST} ${t.result?.points || "點數"}，${t.result?.currentlyHave || "目前有"} ${credits} ${t.result?.pointsUnit || "點"}`,
        variant: "destructive",
      });
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t.common?.loading || "載入中..."}</p>
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
                  {t.result?.analyzeAgain || "重新分析"}
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
                  {t.result?.dailyFortune || "今日運勢"}
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
                      <span className="font-medium">{t.result?.luckyColors || "幸運顏色"}</span>
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
                      <span className="font-medium">{t.result?.luckyNumbers || "幸運號碼"}</span>
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
            <h2 className="mb-6 font-serif text-2xl font-semibold">{t.result?.title || "命理分析結果"}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Personality Card */}
              <Card className="md:col-span-2 lg:col-span-1" data-testid="card-personality">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <User className="h-5 w-5 text-primary" />
                    {t.result?.personality || "性格分析"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{personality.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <Heart className="h-4 w-4 text-green-500" />
                        {t.result?.strengths || "優點"}
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
                        {t.result?.weaknesses || "需注意"}
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
                    {t.result?.career || "事業分析"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{career.advice}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {t.result?.suitableFields || "適合領域"}
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
                        {t.result?.avoidFields || "需謹慎"}
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
                    {t.result?.astrology || "西洋占星"}
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
                    {t.result?.humanDesign || "人類圖"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.result?.energyType || "能量類型"}</span>
                      <span className="font-medium">{humanDesign.type}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.result?.strategy || "人生策略"}</span>
                      <span className="font-medium">{humanDesign.strategy}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.result?.authority || "內在權威"}</span>
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
                    {t.result?.ziWei || "紫微斗數"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.result?.mainStar || "命宮主星"}</span>
                      <span className="font-medium">{ziWei.mainStar}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.result?.palace || "命宮"}</span>
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
                    {t.result?.iChing || "易經占卜"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 font-serif text-2xl font-bold text-primary">
                      {iChing.hexagram}
                    </div>
                    <div>
                      <p className="font-medium">{iChing.hexagramName}</p>
                      <p className="text-sm text-muted-foreground">{t.result?.hexagram || "卦象"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {iChing.interpretation}
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm">
                      <span className="font-medium">{t.result?.hexagramText || "卦辭"}：</span>
                      {iChing.advice}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Credits Display */}
          <div className="mb-8 flex justify-between items-center rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-4 border border-amber-500/20">
            <div>
              <p className="text-sm text-muted-foreground">{t.result?.currentPoints || "當前點數"}</p>
              <p className="text-2xl font-bold text-amber-600">{credits} {t.result?.pointsUnit || "點"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCredits(getCredits())}>
              {t.result?.refreshPoints || "刷新點數"}
            </Button>
          </div>

          {/* Guardian Role Section */}
          <section className="mb-8">
            <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                  {t.result?.guardianRole || "守護角色"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-2xl font-bold text-primary">{guardianRole.role}</p>
                  <p className="text-sm text-muted-foreground">{t.result?.element || "元素"}：{guardianRole.element}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.result?.specialPower || "特殊能力"}</p>
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
                  {t.result?.lifeCoach || "人生教練"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="font-medium text-sm text-primary">{lifeCoach.dailyReminder}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">{t.result?.todayActions || "今日行動"}</p>
                  <ul className="space-y-2">
                    {lifeCoach.todayActions.map((action: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{idx + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 mt-4" 
                  onClick={handleWatchRewardAd}
                  disabled={watchingAd}
                  data-testid="button-watch-ad"
                >
                  {watchingAd ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.analyze?.watchingAd || "廣告播放中..."}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {t.analyze?.watchAd || "觀看廣告獲得 2 次分析機會"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Face Reading Section */}
          {result.faceReading && (
            <section className="mb-8">
              <Card data-testid="card-face-reading" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                  <CardTitle className="flex items-center justify-between font-serif">
                    <span className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      {t.result?.faceReading || "AI 面相分析"}
                    </span>
                    {result.faceReading.attractivenessScore && (
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {t.result?.attractiveness || "顏值"} {result.faceReading.attractivenessScore} {t.result?.score || "分"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {result.faceReading.faceType && (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-base px-4 py-2">
                        {result.faceReading.faceType}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.faceReading.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-center">
                    {result.faceReading.interpretation}
                  </p>

                  {result.faceReading.specialTraits && result.faceReading.specialTraits.length > 0 && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {t.result?.hiddenTraits || "隱藏特質"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.faceReading.specialTraits.map((trait: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(result.faceReading.todayFortune || result.faceReading.luckyItem) && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {result.faceReading.todayFortune && (
                        <div className="rounded-lg border bg-card p-4">
                          <p className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            {t.result?.dailyFortune || "今日運勢"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.faceReading.todayFortune}
                          </p>
                        </div>
                      )}
                      {result.faceReading.luckyItem && (
                        <div className="rounded-lg border bg-card p-4">
                          <p className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            {t.result?.luckyItem || "今日幸運物"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.faceReading.luckyItem}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Unlock Face Reading Section */}
          {!result.faceReading && (
            <section className="mb-8">
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    {t.result?.faceReading || "面相分析"} ({t.result?.needUnlock || "需解鎖"})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t.result?.faceReadingHint || "上傳照片時可同步進行面相分析，獲得更深入的個人洞察。"}
                  </p>
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleUnlockFaceReading}
                    disabled={credits < FACE_READING_COST}
                  >
                    {credits >= FACE_READING_COST ? (
                      <>
                        <Eye className="h-4 w-4" />
                        {t.result?.unlockFaceReading || "解鎖面相分析"} ({FACE_READING_COST} {t.result?.pointsUnit || "點"})
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        {t.result?.insufficientPoints || "點數不足"} ({credits}/{FACE_READING_COST})
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    💡 {t.result?.watchAdHint || "觀看廣告可獲得 100 點數！"}
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Detailed Breakdowns Accordion */}
          <section className="mb-8">
            <h2 className="mb-6 font-serif text-2xl font-semibold">{t.result?.detailedBreakdown || "詳細解讀"}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="personality" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline" data-testid="accordion-personality">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {t.result?.personalityDetails || "性格特質詳解"}
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
                    {t.result?.careerAdvice || "職業建議"}
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
                    {t.result?.dailyFortuneDetails || "每日運勢解讀"}
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analyze">
              <Button
                size="lg"
                className="gap-2 rounded-full px-8"
                data-testid="button-new-analysis"
              >
                {t.result?.analyzeAgain || "重新分析"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/oracle">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full px-8"
                data-testid="button-oracle-from-result"
              >
                <Scroll className="h-4 w-4" />
                {t.home?.oracleButton || "提問求籤"}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
