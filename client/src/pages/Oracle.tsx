import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getHistory, HistoryItem } from "@/lib/historyStorage";
import { useLocale } from "@/i18n/LocaleContext";
import type { OracleReading, OracleResponse, OraclePersona } from "@shared/schema";
import {
  Sparkles,
  Loader2,
  ArrowLeft,
  Compass,
  Clock,
  Heart,
  Briefcase,
  Wallet,
  Activity,
  CircleDot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  question: z.string().min(1, "Please enter your question"),
  category: z.enum(["love", "career", "health", "wealth", "general"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categoryIcons = {
  general: CircleDot,
  love: Heart,
  career: Briefcase,
  wealth: Wallet,
  health: Activity,
};

function ShakingSticks({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-32 h-48">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-40 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"
            style={{
              left: `${40 + i * 8}%`,
              transformOrigin: "bottom center",
            }}
            animate={{
              rotate: [
                -15 + i * 2,
                15 - i * 2,
                -15 + i * 2,
              ],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-red-700 to-red-900 rounded-t-full rounded-b-xl shadow-lg" />
      </div>
      <p className="mt-8 text-lg text-muted-foreground animate-pulse">
        {text}
      </p>
    </div>
  );
}

function StickTypeColor(type: string): string {
  // Support both Chinese and translated stick types
  if (type.includes("上上") || type === "Excellent" || type === "大吉") {
    return "from-yellow-400 to-amber-500";
  } else if (type.includes("上籤") || type === "Good" || type === "吉") {
    return "from-green-400 to-emerald-500";
  } else if (type.includes("中") || type === "Neutral" || type === "中吉") {
    return "from-blue-400 to-blue-500";
  } else if (type.includes("下籤") || type === "Challenging" || type === "小吉") {
    return "from-orange-400 to-orange-500";
  } else if (type.includes("下下") || type === "Difficult" || type === "凶") {
    return "from-red-400 to-red-500";
  }
  return "from-purple-400 to-purple-500";
}

interface OracleLabels {
  poem: string;
  yourQuestion: string;
  interpretation: string;
  advice: string;
  luckyDirection: string;
  luckyTime: string;
  askAgain: string;
  backHome: string;
}

function OracleResult({ reading, onReset, labels }: { reading: OracleReading; onReset: () => void; labels: OracleLabels }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${StickTypeColor(reading.stickType)} text-white font-semibold text-lg shadow-lg`}>
          <Sparkles className="w-5 h-5" />
          #{reading.stickNumber} · {reading.stickType}
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="text-center pb-2">
          <h3 className="font-serif text-2xl font-semibold text-primary">{labels.poem}</h3>
        </CardHeader>
        <CardContent className="text-center">
          <div className="py-6 px-8 bg-background/50 rounded-xl">
            {reading.poem.split("\n").map((line, i) => (
              <p key={i} className="font-serif text-xl leading-loose tracking-widest">
                {line}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-medium">{labels.yourQuestion}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">「{reading.question}」</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-medium">{labels.interpretation}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{reading.interpretation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-medium">{labels.advice}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{reading.advice}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Compass className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{labels.luckyDirection}</p>
              <p className="font-medium">{reading.luckyDirection}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{labels.luckyTime}</p>
              <p className="font-medium">{reading.luckyTime}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 gap-2"
          data-testid="button-ask-again"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.askAgain}
        </Button>
        <Link href="/" className="flex-1">
          <Button variant="default" className="w-full gap-2" data-testid="button-back-home">
            {labels.backHome}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Oracle() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLocale();
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("none");

  const o = t.oracle;
  const categoryOptions = [
    { value: "general", label: o.categories.general, icon: categoryIcons.general },
    { value: "love", label: o.categories.love, icon: categoryIcons.love },
    { value: "career", label: o.categories.career, icon: categoryIcons.career },
    { value: "wealth", label: o.categories.wealth, icon: categoryIcons.wealth },
    { value: "health", label: o.categories.health, icon: categoryIcons.health },
  ];

  useEffect(() => {
    const items = getHistory();
    setHistoryItems(items);
  }, []);

  const getSelectedPersona = (): OraclePersona | undefined => {
    if (selectedPersonaId === "none") return undefined;
    const item = historyItems.find(h => h.id === selectedPersonaId);
    if (!item) return undefined;
    const input = item.result.input;
    return {
      name: input.name,
      birthYear: input.birthYear,
      birthMonth: input.birthMonth,
      birthDay: input.birthDay,
      gender: input.gender,
      zodiacSign: item.result.astrology?.zodiacSign,
    };
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      category: "general",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const persona = getSelectedPersona();
      const payload = persona ? { ...data, persona } : data;
      const response = await apiRequest("POST", "/api/oracle", payload);
      return response.json() as Promise<OracleResponse>;
    },
    onSuccess: (data) => {
      if (data.success && data.reading) {
        setReading(data.reading);
      } else {
        toast({
          title: o.errors.generateFailed,
          description: data.error || o.errors.tryAgain,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: o.errors.connectionError,
        description: o.errors.serverError,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    setReading(null);
    mutation.mutate(data);
  };

  const handleReset = () => {
    setReading(null);
    form.reset({
      question: "",
      category: "general",
    });
  };

  const resultLabels: OracleLabels = {
    poem: o.poem,
    yourQuestion: o.yourQuestion,
    interpretation: o.interpretation,
    advice: o.advice,
    luckyDirection: o.luckyDirection,
    luckyTime: o.luckyTime,
    askAgain: o.askAgain,
    backHome: o.backHome,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-background to-primary/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="container relative mx-auto px-4 py-12 md:py-16">
            <div className="mx-auto max-w-2xl">
              <div className="text-center mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {o.title}
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                  {o.heading}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {o.subtitle}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {mutation.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShakingSticks text={o.shaking} />
                  </motion.div>
                ) : reading ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <OracleResult reading={reading} onReset={handleReset} labels={resultLabels} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 md:p-8">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{o.categoryLabel}</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger data-testid="select-category">
                                        <SelectValue placeholder={o.selectCategory} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categoryOptions.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                          data-testid={`select-item-${option.value}`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <option.icon className="w-4 h-4" />
                                            {option.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {historyItems.length > 0 && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  {o.personaLabel}
                                </label>
                                <Select
                                  value={selectedPersonaId}
                                  onValueChange={setSelectedPersonaId}
                                >
                                  <SelectTrigger data-testid="select-persona" className="w-full">
                                    <SelectValue placeholder={o.personaLabel} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      <div className="flex items-center gap-2">
                                        <CircleDot className="w-4 h-4" />
                                        {o.noPersona}
                                      </div>
                                    </SelectItem>
                                    {historyItems.map((item) => (
                                      <SelectItem key={item.id} value={item.id} data-testid={`select-persona-${item.id}`}>
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          {item.name} ({item.result.input.birthYear}/{item.result.input.birthMonth}/{item.result.input.birthDay})
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <FormField
                              control={form.control}
                              name="question"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{o.questionLabel}</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder={o.questionPlaceholder}
                                      className="min-h-[120px] resize-none text-base"
                                      data-testid="input-oracle-question"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              size="lg"
                              className="w-full gap-2 rounded-full"
                              disabled={mutation.isPending}
                              data-testid="button-draw-oracle"
                            >
                              {mutation.isPending ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  {o.drawing}
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-5 h-5" />
                                  {o.drawStick}
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                      <Link href="/">
                        <Button variant="ghost" className="gap-2" data-testid="button-back">
                          <ArrowLeft className="w-4 h-4" />
                          {o.backHome}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
