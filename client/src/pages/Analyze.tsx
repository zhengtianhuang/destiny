import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { addToHistory } from "@/lib/historyStorage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Calendar,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Loader2,
  Zap,
  AlertCircle,
  Eye,
} from "lucide-react";
import type { FortuneInput, FortuneResult, FaceReadingAnalysis } from "@shared/schema";
import { canAnalyze, getRemainingAnalysis, incrementAnalysisCount, addRewardAdBonus } from "@shared/monetization";
import { adService } from "@/lib/adService";
import heic2any from "heic2any";
import { useLocale } from "@/i18n/LocaleContext";

function useFormSchema(t: ReturnType<typeof useLocale>["t"]) {
  return useMemo(() => z.object({
    name: z.string().min(1, t.analyze.nameRequired),
    birthYear: z.string().min(1, t.analyze.birthYearRequired),
    birthMonth: z.string().min(1, t.analyze.birthMonthRequired),
    birthDay: z.string().min(1, t.analyze.birthDayRequired),
    gender: z.string().min(1, t.analyze.genderRequired),
    birthHour: z.string().optional(),
    birthMinute: z.string().optional(),
    birthPlace: z.string().optional(),
    currentLocation: z.string().optional(),
  }), [t]);
}

type FormData = {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  birthHour?: string;
  birthMinute?: string;
  birthPlace?: string;
  currentLocation?: string;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export default function Analyze() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLocale();
  const formSchema = useFormSchema(t);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);
  const [previousResult, setPreviousResult] = useState<FortuneResult | null>(null);
  const [faceReadingOnlyMode, setFaceReadingOnlyMode] = useState(false);
  const [isAnalyzingFace, setIsAnalyzingFace] = useState(false);
  const [needsPhotoForFaceAnalysis, setNeedsPhotoForFaceAnalysis] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      gender: "",
      birthHour: "",
      birthMinute: "",
      birthPlace: "",
      currentLocation: "",
    },
  });

  useEffect(() => {
    const prefillDataStr = sessionStorage.getItem("prefillData");
    if (prefillDataStr) {
      try {
        const prefillData = JSON.parse(prefillDataStr);
        const input = prefillData.input || prefillData;
        form.reset({
          name: input.name || "",
          birthYear: String(input.birthYear) || "",
          birthMonth: String(input.birthMonth) || "",
          birthDay: String(input.birthDay) || "",
          gender: input.gender || "",
          birthHour: input.birthHour !== undefined ? String(input.birthHour) : "",
          birthMinute: input.birthMinute !== undefined ? String(input.birthMinute) : "",
          birthPlace: input.birthPlace || "",
          currentLocation: input.currentLocation || "",
        });
        if (prefillData.previousResult) {
          setPreviousResult(prefillData.previousResult);
        }
        
        // Handle face-reading-only mode
        if (prefillData.faceReadingOnly) {
          setFaceReadingOnlyMode(true);
          if (prefillData.needsPhotoUpload) {
            // User needs to upload a new photo for face-only analysis
            setNeedsPhotoForFaceAnalysis(true);
            setStep(2); // Go to photo upload step
          } else if (input.photoBase64) {
            sessionStorage.removeItem("prefillData");
            // Trigger face-only analysis
            handleFaceOnlyAnalysis(input.photoBase64, prefillData.previousResult);
            return;
          }
        }
        
        sessionStorage.removeItem("prefillData");
        toast({
          title: t.analyze.dataLoaded,
          description: t.analyze.dataLoadedDesc,
        });
      } catch (error) {
        console.error("Failed to parse prefill data:", error);
      }
    }
  }, [form, toast]);

  const handleFaceOnlyAnalysis = async (photoBase64: string, baseResult: FortuneResult) => {
    setIsAnalyzingFace(true);
    try {
      const response = await apiRequest("POST", "/api/analyze-face", { photoBase64 });
      const data = await response.json() as { success: boolean; faceReading?: FaceReadingAnalysis; error?: string };
      
      if (data.success && data.faceReading) {
        const updatedResult = {
          ...baseResult,
          faceReading: data.faceReading,
        };
        sessionStorage.setItem("fortuneResult", JSON.stringify(updatedResult));
        // Pass true for forceHasPhoto since we just analyzed a photo
        addToHistory(updatedResult, true);
        setLocation("/result");
      } else {
        toast({
          title: t.analyze.faceAnalysisFailed,
          description: data.error || t.analyze.tryAgainLater,
          variant: "destructive",
        });
        setFaceReadingOnlyMode(false);
        setIsAnalyzingFace(false);
      }
    } catch (error) {
      console.error("Face analysis error:", error);
      toast({
        title: t.analyze.connectionError,
        description: t.analyze.connectionErrorDesc,
        variant: "destructive",
      });
      setFaceReadingOnlyMode(false);
      setIsAnalyzingFace(false);
    }
  };

  const analyzeMutation = useMutation({
    mutationFn: async (data: FortuneInput) => {
      const response = await apiRequest(
        "POST",
        "/api/analyze",
        data
      );
      const result = await response.json() as { success: boolean; result: FortuneResult; error?: string };
      return result;
    },
    onSuccess: (data) => {
      console.log("Analysis response:", data);
      if (data.success && data.result) {
        sessionStorage.setItem("fortuneResult", JSON.stringify(data.result));
        addToHistory(data.result);
        setLocation("/result");
      } else {
        toast({
          title: t.analyze.analysisFailed,
          description: data.error || t.analyze.tryAgainLater,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        title: t.analyze.connectionError,
        description: t.analyze.connectionErrorDesc,
        variant: "destructive",
      });
    },
  });

  const [isConvertingPhoto, setIsConvertingPhoto] = useState(false);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t.analyze.fileTooLarge,
          description: t.analyze.fileTooLargeDesc,
          variant: "destructive",
        });
        return;
      }

      if (isConvertingPhoto) {
        return;
      }

      let processedFile = file;
      const isHeic = file.type === "image/heic" || 
                     file.type === "image/heif" || 
                     file.name.toLowerCase().endsWith(".heic") ||
                     file.name.toLowerCase().endsWith(".heif");

      if (isHeic) {
        setIsConvertingPhoto(true);
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.85,
          });
          
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          processedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
            type: "image/jpeg",
          });
        } catch (error) {
          console.error("HEIC conversion error:", error);
          toast({
            title: t.analyze.photoConversionFailed,
            description: t.analyze.photoConversionFailedDesc,
            variant: "destructive",
          });
          setIsConvertingPhoto(false);
          return;
        }
        setIsConvertingPhoto(false);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        const base64 = result.split(",")[1];
        setPhotoBase64(base64);
      };
      reader.readAsDataURL(processedFile);
    }
  }, [toast]);

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    setPhotoBase64(null);
  }, []);

  const handleWatchAdForMore = async () => {
    setWatchingAd(true);
    try {
      await adService.showRewardedAd();
      toast({
        title: t.analyze.adComplete,
        description: t.analyze.adCompleteDesc,
        duration: 3000,
      });
    } catch (error) {
      console.error("Ad failed:", error);
      toast({
        title: t.analyze.adFailed,
        description: t.analyze.adFailedDesc,
        variant: "destructive",
      });
    } finally {
      setWatchingAd(false);
    }
  };

  const onSubmitStep1 = (data: FormData) => {
    console.log("Step 1 data:", data);
    setStep(2);
  };

  const onSubmitFinal = () => {
    if (!canAnalyze()) {
      toast({
        title: t.analyze.dailyLimitReached,
        description: t.analyze.dailyLimitDesc,
        variant: "destructive",
      });
      return;
    }

    const formData = form.getValues();
    
    const input: FortuneInput = {
      name: formData.name,
      birthYear: parseInt(formData.birthYear),
      birthMonth: parseInt(formData.birthMonth),
      birthDay: parseInt(formData.birthDay),
      gender: formData.gender as "male" | "female" | "other",
      birthHour: formData.birthHour ? parseInt(formData.birthHour) : undefined,
      birthMinute: formData.birthMinute ? parseInt(formData.birthMinute) : undefined,
      birthPlace: formData.birthPlace || undefined,
      currentLocation: formData.currentLocation || undefined,
      photoBase64: photoBase64 || undefined,
    };

    incrementAnalysisCount();
    analyzeMutation.mutate(input);
  };

  // Face-only analysis loading screen
  if (isAnalyzingFace) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 md:py-20">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold">{t.analyze.analyzingFace}</h2>
            <p className="text-muted-foreground">{t.analyze.analyzingFaceDesc}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main analysis loading screen
  if (analyzeMutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 md:py-20">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative text-center space-y-8 p-8">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: '1s' }} />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-accent animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-serif font-bold">{t.analyze.analyzingDestiny}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t.analyze.analyzingDestinyDesc}
                </p>
              </div>
              <div className="flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            {/* Previous Result Summary */}
            {previousResult && (
              <Card className="mb-6 border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {t.analyze.previousResult}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviousResult(null)}
                      data-testid="button-close-previous-result"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid gap-4 text-sm">
                    {previousResult.astrology && (
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{previousResult.astrology.zodiacSign}</p>
                          <p className="text-muted-foreground line-clamp-2">
                            {previousResult.astrology.interpretation}
                          </p>
                        </div>
                      </div>
                    )}
                    {previousResult.personality && (
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{t.analyze.personalityTraits}</p>
                          <p className="text-muted-foreground">
                            {previousResult.personality.traits?.slice(0, 3).join("、")}
                          </p>
                        </div>
                      </div>
                    )}
                    {previousResult.dailyFortune && (
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{t.analyze.luckyColorNumber}</p>
                          <p className="text-muted-foreground">
                            {previousResult.dailyFortune.luckyColors?.join("、")} | {previousResult.dailyFortune.luckyNumbers?.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      sessionStorage.setItem("fortuneResult", JSON.stringify(previousResult));
                      setLocation("/result");
                    }}
                    data-testid="button-view-full-previous-result"
                  >
                    {t.analyze.viewFullResult}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-16 rounded-full transition-colors ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
            </div>

            <Form {...form}>
              {step === 1 && (
                <Card className="border-border/40">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="font-serif text-2xl">
                      {t.analyze.title}
                    </CardTitle>
                    <CardDescription>
                      {t.analyze.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <form
                      onSubmit={form.handleSubmit(onSubmitStep1)}
                      className="space-y-6"
                    >
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {t.analyze.name}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.analyze.namePlaceholder}
                                className="h-12"
                                data-testid="input-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.analyze.gender}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12"
                                  data-testid="select-gender"
                                >
                                  <SelectValue placeholder={t.analyze.genderPlaceholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">{t.analyze.male}</SelectItem>
                                <SelectItem value="female">{t.analyze.female}</SelectItem>
                                <SelectItem value="other">{t.analyze.other}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Birth Date */}
                      <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {t.analyze.birthDate}
                        </FormLabel>
                        <div className="grid grid-cols-3 gap-3">
                          <FormField
                            control={form.control}
                            name="birthYear"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-12"
                                      data-testid="select-birth-year"
                                    >
                                      <SelectValue placeholder={t.analyze.birthYear} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem
                                        key={year}
                                        value={year.toString()}
                                      >
                                        {year}{t.analyze.yearSuffix}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="birthMonth"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-12"
                                      data-testid="select-birth-month"
                                    >
                                      <SelectValue placeholder={t.analyze.birthMonth} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {months.map((month) => (
                                      <SelectItem
                                        key={month}
                                        value={month.toString()}
                                      >
                                        {month}{t.analyze.monthSuffix}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="birthDay"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-12"
                                      data-testid="select-birth-day"
                                    >
                                      <SelectValue placeholder={t.analyze.birthDay} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {days.map((day) => (
                                      <SelectItem
                                        key={day}
                                        value={day.toString()}
                                      >
                                        {day}{t.analyze.daySuffix}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base gap-2 rounded-full"
                        data-testid="button-next-step"
                      >
                        {t.analyze.continue}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="border-border/40">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="font-serif text-2xl">
                      {needsPhotoForFaceAnalysis ? t.analyze.step2FaceOnly : t.analyze.step2}
                    </CardTitle>
                    <CardDescription>
                      {needsPhotoForFaceAnalysis 
                        ? t.analyze.step2FaceOnlyDesc 
                        : t.analyze.step2Desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="space-y-6">
                      {/* Birth Time */}
                      <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {t.analyze.birthTime}
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="birthHour"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-12"
                                      data-testid="select-birth-hour"
                                    >
                                      <SelectValue placeholder={t.analyze.hour} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {hours.map((hour) => (
                                      <SelectItem
                                        key={hour}
                                        value={hour.toString()}
                                      >
                                        {hour.toString().padStart(2, "0")}{t.analyze.hourSuffix}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="birthMinute"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="h-12"
                                      data-testid="select-birth-minute"
                                    >
                                      <SelectValue placeholder={t.analyze.minute} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {minutes.map((minute) => (
                                      <SelectItem
                                        key={minute}
                                        value={minute.toString()}
                                      >
                                        {minute.toString().padStart(2, "0")}{t.analyze.minuteSuffix}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormDescription>
                          {t.analyze.birthTimeHint}
                        </FormDescription>
                      </div>

                      {/* Birth Place */}
                      <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {t.analyze.birthPlace}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.analyze.birthPlacePlaceholder}
                                className="h-12"
                                data-testid="input-birth-place"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Current Location */}
                      <FormField
                        control={form.control}
                        name="currentLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {t.analyze.currentLocation}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t.analyze.currentLocationPlaceholder}
                                className="h-12"
                                data-testid="input-current-location"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Photo Upload */}
                      <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          {t.analyze.photo}
                        </FormLabel>
                        
                        {!photoPreview ? (
                          <label
                            htmlFor="photo-upload"
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/30 p-8 transition-colors hover:border-primary/40 hover:bg-muted/50 ${isConvertingPhoto ? "pointer-events-none opacity-50" : ""}`}
                            data-testid="input-photo-upload-area"
                          >
                            {isConvertingPhoto ? (
                              <>
                                <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
                                <span className="text-sm font-medium">
                                  {t.analyze.photoConverting}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {t.analyze.photoUploadText}
                                </span>
                              </>
                            )}
                            <span className="mt-1 text-xs text-muted-foreground">
                              {t.analyze.photoFormats}
                            </span>
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                              className="hidden"
                              onChange={handlePhotoUpload}
                              data-testid="input-photo-upload"
                            />
                          </label>
                        ) : (
                          <div className="relative">
                            <img
                              src={photoPreview}
                              alt={t.analyze.photoPreviewAlt}
                              className="mx-auto max-h-64 rounded-lg object-cover"
                              data-testid="img-photo-preview"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={removePhoto}
                              data-testid="button-remove-photo"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <FormDescription>
                          {t.analyze.photoHint}
                        </FormDescription>
                      </div>

                      {!canAnalyze() && (
                        <div className="space-y-3">
                          <Alert className="border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertDescription className="text-amber-800 dark:text-amber-300">
                              {t.analyze.dailyLimitAlert}
                            </AlertDescription>
                          </Alert>
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full gap-2"
                            onClick={handleWatchAdForMore}
                            disabled={watchingAd}
                          >
                            {watchingAd ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t.analyze.watchingAd}
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4" />
                                {t.analyze.watchAd}
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{t.analyze.remainingAnalysis}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-colors ${
                                i < getRemainingAnalysis()
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {getRemainingAnalysis()} / 3
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        {!needsPhotoForFaceAnalysis && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 flex-1 gap-2 rounded-full"
                            onClick={() => setStep(1)}
                            data-testid="button-prev-step"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            {t.analyze.previous}
                          </Button>
                        )}
                        {needsPhotoForFaceAnalysis ? (
                          <Button
                            type="button"
                            className="h-12 flex-1 gap-2 rounded-full"
                            onClick={() => {
                              if (photoBase64 && previousResult) {
                                handleFaceOnlyAnalysis(photoBase64, previousResult);
                              } else {
                                toast({
                                  title: t.analyze.uploadPhotoRequired,
                                  description: t.analyze.uploadPhotoRequiredDesc,
                                  variant: "destructive",
                                });
                              }
                            }}
                            disabled={!photoBase64}
                            data-testid="button-face-analysis"
                          >
                            <Sparkles className="h-4 w-4" />
                            {t.analyze.startFaceAnalysis}
                          </Button>
                        ) : (
                        <Button
                          type="button"
                          className="h-12 flex-1 gap-2 rounded-full"
                          onClick={onSubmitFinal}
                          disabled={analyzeMutation.isPending || !canAnalyze()}
                          data-testid="button-submit-analysis"
                        >
                          {analyzeMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              {t.analyze.analyzing}
                            </>
                          ) : !canAnalyze() ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              {t.analyze.exhausted}
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              {t.analyze.startAnalysis}
                            </>
                          )}
                        </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
