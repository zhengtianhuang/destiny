import { useState, useCallback, useEffect } from "react";
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

const formSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  birthYear: z.string().min(1, "請選擇出生年份"),
  birthMonth: z.string().min(1, "請選擇出生月份"),
  birthDay: z.string().min(1, "請選擇出生日期"),
  gender: z.string().min(1, "請選擇性別"),
  birthHour: z.string().optional(),
  birthMinute: z.string().optional(),
  birthPlace: z.string().optional(),
  currentLocation: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export default function Analyze() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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
          title: "已載入資料",
          description: "已從歷史記錄載入您的資料，可查看上次分析結果",
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
          title: "面相分析失敗",
          description: data.error || "請稍後再試",
          variant: "destructive",
        });
        setFaceReadingOnlyMode(false);
        setIsAnalyzingFace(false);
      }
    } catch (error) {
      console.error("Face analysis error:", error);
      toast({
        title: "連線錯誤",
        description: "無法連線到伺服器，請檢查網路連線",
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
          title: "分析失敗",
          description: data.error || "請稍後再試",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        title: "連線錯誤",
        description: "無法連線到伺服器，請檢查網路連線",
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
          title: "檔案太大",
          description: "請選擇小於 5MB 的圖片",
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
            title: "照片轉換失敗",
            description: "無法轉換 HEIC 格式，請改用 JPG 或 PNG",
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
        title: "✅ 廣告觀看完成",
        description: "恭喜！獲得 2 次分析機會",
        duration: 3000,
      });
    } catch (error) {
      console.error("廣告失敗:", error);
      toast({
        title: "廣告加載失敗",
        description: "請檢查網絡連接",
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
    // 檢查廣告限制
    if (!canAnalyze()) {
      toast({
        title: "今日分析次數已用盡",
        description: "觀看廣告可獲得更多次數，或明天再試",
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
            <h2 className="text-2xl font-serif font-bold">正在分析面相...</h2>
            <p className="text-muted-foreground">請稍候，AI 正在為您解讀面相特質</p>
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
                <h2 className="text-2xl font-serif font-bold">正在解析您的命運軌跡...</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  AI 正在融合星盤、人類圖、紫微斗數、易經等多維度分析
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
                      上次分析結果
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
                          <p className="font-medium">性格特質</p>
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
                          <p className="font-medium">幸運色 & 數字</p>
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
                    查看完整結果
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
                      基本資料
                    </CardTitle>
                    <CardDescription>
                      請填寫您的基本資訊以進行命理分析
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
                              姓名
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="請輸入您的姓名"
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
                            <FormLabel>性別</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className="h-12"
                                  data-testid="select-gender"
                                >
                                  <SelectValue placeholder="請選擇性別" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">男</SelectItem>
                                <SelectItem value="female">女</SelectItem>
                                <SelectItem value="other">其他</SelectItem>
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
                          出生日期
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
                                      <SelectValue placeholder="年" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem
                                        key={year}
                                        value={year.toString()}
                                      >
                                        {year}年
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
                                      <SelectValue placeholder="月" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {months.map((month) => (
                                      <SelectItem
                                        key={month}
                                        value={month.toString()}
                                      >
                                        {month}月
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
                                      <SelectValue placeholder="日" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {days.map((day) => (
                                      <SelectItem
                                        key={day}
                                        value={day.toString()}
                                      >
                                        {day}日
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
                        繼續
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
                      {needsPhotoForFaceAnalysis ? "上傳照片重測面相" : "進階資料（選填）"}
                    </CardTitle>
                    <CardDescription>
                      {needsPhotoForFaceAnalysis 
                        ? "上傳新照片進行趣味面相分析" 
                        : "提供更多資訊可獲得更精確的分析結果"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div className="space-y-6">
                      {/* Birth Time */}
                      <div className="space-y-2">
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          出生時間
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
                                      <SelectValue placeholder="時" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {hours.map((hour) => (
                                      <SelectItem
                                        key={hour}
                                        value={hour.toString()}
                                      >
                                        {hour.toString().padStart(2, "0")}時
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
                                      <SelectValue placeholder="分" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {minutes.map((minute) => (
                                      <SelectItem
                                        key={minute}
                                        value={minute.toString()}
                                      >
                                        {minute.toString().padStart(2, "0")}分
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormDescription>
                          提供出生時間可獲得更精確的星盤與紫微斗數分析
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
                              出生地點
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="例如：台北市"
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
                              現居地點
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="例如：新北市"
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
                          面相照片
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
                                  正在轉換照片格式...
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  點擊或拖曳上傳照片
                                </span>
                              </>
                            )}
                            <span className="mt-1 text-xs text-muted-foreground">
                              支援 JPG、PNG、HEIC (iPhone)
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
                              alt="預覽照片"
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
                          上傳正面清晰照片可進行面相分析
                        </FormDescription>
                      </div>

                      {!canAnalyze() && (
                        <div className="space-y-3">
                          <Alert className="border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertDescription className="text-amber-800 dark:text-amber-300">
                              今日分析次數已用盡（限 3 次/天）。觀看廣告可獲得額外次數！
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
                                廣告播放中 (10秒)...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4" />
                                觀看廣告獲得 2 次機會
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">剩餘分析次數</span>
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
                            上一步
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
                                  title: "請上傳照片",
                                  description: "需要上傳照片才能進行面相分析",
                                  variant: "destructive",
                                });
                              }
                            }}
                            disabled={!photoBase64}
                            data-testid="button-face-analysis"
                          >
                            <Sparkles className="h-4 w-4" />
                            開始面相分析
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
                              分析中...
                            </>
                          ) : !canAnalyze() ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              次數已用盡
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              開始解析
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
