import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  FileText,
  Cpu,
  FileCheck,
  HelpCircle,
  Heart,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/i18n/LocaleContext";

export default function Home() {
  const { t } = useLocale();
  const h = t.home;

  const features = [
    {
      icon: Star,
      title: h.features.astrology,
      description: h.features.astrologyDesc,
    },
    {
      icon: Compass,
      title: h.features.humanDesign,
      description: h.features.humanDesignDesc,
    },
    {
      icon: Moon,
      title: h.features.ziWei,
      description: h.features.ziWeiDesc,
    },
    {
      icon: Eye,
      title: h.features.faceReading,
      description: h.features.faceReadingDesc,
    },
    {
      icon: BookOpen,
      title: h.features.iChing,
      description: h.features.iChingDesc,
    },
  ];

  const insights = [
    {
      icon: User,
      title: h.insights.personality,
      description: h.insights.personalityDesc,
    },
    {
      icon: TrendingUp,
      title: h.insights.career,
      description: h.insights.careerDesc,
    },
    {
      icon: Palette,
      title: h.insights.luckyColor,
      description: h.insights.luckyColorDesc,
    },
    {
      icon: Hash,
      title: h.insights.luckyNumber,
      description: h.insights.luckyNumberDesc,
    },
  ];

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
                {h.tagline}
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {h.heroTitle1}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                {h.heroTitle2}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {h.description}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 px-8 py-6 text-lg rounded-full"
                  data-testid="button-start-analysis"
                >
                  {h.startButton}
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
                  {h.oracleButton}
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
              {h.featuresTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.featuresSubtitle}
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
              {h.insightsTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.insightsSubtitle}
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

      {/* How It Works Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {h.howItWorks?.title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.howItWorks?.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">1</div>
              <h3 className="font-serif text-xl font-medium">{h.howItWorks?.step1}</h3>
              <p className="mt-2 text-muted-foreground">{h.howItWorks?.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">2</div>
              <h3 className="font-serif text-xl font-medium">{h.howItWorks?.step2}</h3>
              <p className="mt-2 text-muted-foreground">{h.howItWorks?.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">3</div>
              <h3 className="font-serif text-xl font-medium">{h.howItWorks?.step3}</h3>
              <p className="mt-2 text-muted-foreground">{h.howItWorks?.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Method Explanations */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {h.methodDetails?.title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.methodDetails?.subtitle}
            </p>
          </div>

          <div className="mt-12 space-y-8 max-w-4xl mx-auto">
            <Card className="border-border/40" data-testid="card-method-astrology">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{h.methodDetails?.astrology?.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{h.methodDetails?.astrology?.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40" data-testid="card-method-humandesign">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Compass className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{h.methodDetails?.humanDesign?.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{h.methodDetails?.humanDesign?.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40" data-testid="card-method-ziwei">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Moon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{h.methodDetails?.ziWei?.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{h.methodDetails?.ziWei?.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40" data-testid="card-method-facereading">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{h.methodDetails?.faceReading?.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{h.methodDetails?.faceReading?.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40" data-testid="card-method-iching">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{h.methodDetails?.iChing?.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{h.methodDetails?.iChing?.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border/40 bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {h.faq?.title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.faq?.subtitle}
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="q1" className="border border-border/40 rounded-lg px-4 bg-card" data-testid="accordion-faq-1">
                <AccordionTrigger className="text-left font-medium">{h.faq?.q1}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{h.faq?.a1}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="border border-border/40 rounded-lg px-4 bg-card" data-testid="accordion-faq-2">
                <AccordionTrigger className="text-left font-medium">{h.faq?.q2}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{h.faq?.a2}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="border border-border/40 rounded-lg px-4 bg-card" data-testid="accordion-faq-3">
                <AccordionTrigger className="text-left font-medium">{h.faq?.q3}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{h.faq?.a3}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4" className="border border-border/40 rounded-lg px-4 bg-card" data-testid="accordion-faq-4">
                <AccordionTrigger className="text-left font-medium">{h.faq?.q4}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{h.faq?.a4}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5" className="border border-border/40 rounded-lg px-4 bg-card" data-testid="accordion-faq-5">
                <AccordionTrigger className="text-left font-medium">{h.faq?.q5}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{h.faq?.a5}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/80 dark:bg-accent">
                <Heart className="h-6 w-6 text-accent-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {h.about?.title}
              </h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{h.about?.desc1}</p>
              <p>{h.about?.desc2}</p>
            </div>

            <Card className="mt-12 border-primary/20 bg-primary/5" data-testid="card-mission">
              <CardContent className="p-8 text-center">
                <h3 className="font-serif text-xl font-medium text-primary">{h.about?.mission}</h3>
                <p className="mt-4 text-muted-foreground">{h.about?.missionDesc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {h.ctaTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {h.ctaSubtitle}
            </p>
            <div className="mt-8">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="group gap-2 px-8 py-6 text-lg rounded-full"
                  data-testid="button-cta-analyze"
                >
                  {h.ctaButton}
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
