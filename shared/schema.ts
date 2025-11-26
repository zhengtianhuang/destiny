import { z } from "zod";

// 性別類型
export const genderOptions = ["male", "female", "other"] as const;
export type Gender = typeof genderOptions[number];

// 分析請求輸入
export const fortuneInputSchema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  birthYear: z.number().min(1900).max(new Date().getFullYear()),
  birthMonth: z.number().min(1).max(12),
  birthDay: z.number().min(1).max(31),
  gender: z.enum(genderOptions),
  // 選填欄位
  birthHour: z.number().min(0).max(23).optional(),
  birthMinute: z.number().min(0).max(59).optional(),
  birthPlace: z.string().optional(),
  currentLocation: z.string().optional(),
  photoBase64: z.string().optional(),
});

export type FortuneInput = z.infer<typeof fortuneInputSchema>;

// 命理分析結果
export interface PersonalityAnalysis {
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  description: string;
}

export interface CareerAnalysis {
  suitableFields: string[];
  avoidFields: string[];
  advice: string;
}

export interface DailyFortune {
  luckyColors: string[];
  luckyNumbers: number[];
  overallFortune: string;
  advice: string;
}

export interface FaceReadingAnalysis {
  features: string[];
  interpretation: string;
}

export interface ZiWeiAnalysis {
  mainStar: string;
  palace: string;
  interpretation: string;
}

export interface HumanDesignAnalysis {
  type: string;
  strategy: string;
  authority: string;
  description: string;
}

export interface AstrologyAnalysis {
  zodiacSign: string;
  risingSign?: string;
  moonSign?: string;
  interpretation: string;
}

export interface IChing {
  hexagram: string;
  hexagramName: string;
  interpretation: string;
  advice: string;
}

export interface LifeCoach {
  todayActions: string[];
  dailyReminder: string;
  decision?: string;
  nextSteps: string;
}

export interface GuardianRole {
  role: string;
  element: string;
  specialPower: string;
  message: string;
}

export interface PsychologicalProfile {
  personalityType: string;
  attachmentStyle: string;
  decisionStyle: string;
  emotionalProcessing: string;
}

export interface BehaviorRecord {
  date: string;
  mood: number;
  goalsCompleted: boolean;
  socialLevel: number;
  anxietyLevel: number;
  notes?: string;
}

export interface FortuneResult {
  id: string;
  input: FortuneInput;
  personality: PersonalityAnalysis;
  career: CareerAnalysis;
  dailyFortune: DailyFortune;
  faceReading?: FaceReadingAnalysis;
  ziWei: ZiWeiAnalysis;
  humanDesign: HumanDesignAnalysis;
  astrology: AstrologyAnalysis;
  iChing: IChing;
  lifeCoach: LifeCoach;
  guardianRole: GuardianRole;
  generatedAt: string;
}

// API 請求/回應類型
export interface AnalyzeRequest {
  input: FortuneInput;
}

export interface AnalyzeResponse {
  success: boolean;
  result?: FortuneResult;
  error?: string;
}
