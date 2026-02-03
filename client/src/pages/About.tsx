import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/i18n/LocaleContext";
import { Sparkles, Heart, Users, Target, BookOpen, Shield } from "lucide-react";

export default function About() {
  const { t } = useLocale();

  const values = [
    {
      icon: Heart,
      title: t.about?.valueRespect || "尊重傳統",
      description: t.about?.valueRespectDesc || "我們深深尊重數千年的東方智慧傳承，在科技創新中保留傳統命理的精髓與價值。"
    },
    {
      icon: Target,
      title: t.about?.valueAccuracy || "精準分析",
      description: t.about?.valueAccuracyDesc || "運用先進的人工智慧技術，結合專業命理知識，為您提供深入且準確的個人分析。"
    },
    {
      icon: Users,
      title: t.about?.valueUser || "用戶至上",
      description: t.about?.valueUserDesc || "每一項功能的設計都以用戶需求為核心，致力於提供直觀、易用且有價值的體驗。"
    },
    {
      icon: Shield,
      title: t.about?.valuePrivacy || "隱私保護",
      description: t.about?.valuePrivacyDesc || "我們嚴格保護您的個人資訊，採用業界最高標準的安全措施，確保您的數據安全。"
    }
  ];

  const teamMembers = [
    {
      role: t.about?.roleFounder || "創辦人兼技術總監",
      description: t.about?.roleFounderDesc || "擁有超過15年軟體開發經驗，致力於將傳統命理與現代科技結合，創造創新的占卜體驗。"
    },
    {
      role: t.about?.roleExpert || "命理顧問團隊",
      description: t.about?.roleExpertDesc || "由多位資深命理師組成，涵蓋西洋占星、紫微斗數、人類圖、易經等專業領域。"
    },
    {
      role: t.about?.roleAI || "AI 研發團隊",
      description: t.about?.roleAIDesc || "專注於自然語言處理與機器學習，持續優化 AI 分析模型，提升解讀的準確性與深度。"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-about-title">
              {t.about?.title || "關於天命解析"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.about?.subtitle || "融合東方智慧與現代科技，為您揭開命運的奧秘"}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {t.about?.storyTitle || "我們的故事"}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {t.about?.storyP1 || "天命解析誕生於對傳統命理智慧的熱愛與對科技創新的追求。我們的創辦團隊包含資深命理師與軟體工程師，共同的願景是讓古老的占卜智慧能夠透過現代科技，以更便捷、更精準的方式服務每一位探索者。"}
                </p>
                <p>
                  {t.about?.storyP2 || "在這個快節奏的時代，人們常常迷失方向，不知道自己真正的天賦與人生使命。我們相信，透過了解自己的命理特質，每個人都能更清晰地認識自我，找到屬於自己的道路。這就是天命解析存在的意義。"}
                </p>
                <p>
                  {t.about?.storyP3 || "我們整合了五大命理系統：西洋占星學、人類圖、紫微斗數、面相學與易經，搭配先進的人工智慧技術，為您提供全面且個人化的命理分析。每一次分析，都是一次與內在自我的對話。"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-semibold mb-4">
                {t.about?.missionTitle || "我們的使命"}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t.about?.missionDesc || "天命解析致力於成為連接傳統智慧與現代生活的橋樑。我們的使命是："}
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✦</span>
                  <span>{t.about?.mission1 || "讓每個人都能輕鬆接觸到專業的命理分析服務"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✦</span>
                  <span>{t.about?.mission2 || "運用科技提升命理分析的準確性與深度"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✦</span>
                  <span>{t.about?.mission3 || "幫助用戶更好地認識自我，做出明智的人生決策"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✦</span>
                  <span>{t.about?.mission4 || "傳承並發揚東方命理文化的精髓"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-xl font-serif font-semibold mb-6 text-center">
              {t.about?.valuesTitle || "核心價值"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <value.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-serif font-semibold mb-6">
                {t.about?.teamTitle || "專業團隊"}
              </h2>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4">
                    <h3 className="font-semibold mb-1">{member.role}</h3>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 md:p-8 text-center">
              <h2 className="text-xl font-serif font-semibold mb-4">
                {t.about?.contactTitle || "聯繫我們"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t.about?.contactDesc || "如果您有任何問題、建議或合作意向，歡迎透過以下方式與我們聯繫："}
              </p>
              <p className="text-primary font-medium">
                contact@mysticalfortune.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
