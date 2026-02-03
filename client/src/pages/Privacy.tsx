import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Trash2, Bell, Mail } from "lucide-react";

export default function Privacy() {
  const { t } = useLocale();
  const p = t.privacy;

  const sections = [
    { icon: Eye, title: p?.dataCollection, content: p?.dataCollectionDesc },
    { icon: Lock, title: p?.dataUsage, content: p?.dataUsageDesc },
    { icon: Shield, title: p?.dataSecurity, content: p?.dataSecurityDesc },
    { icon: Trash2, title: p?.dataRetention, content: p?.dataRetentionDesc },
    { icon: Bell, title: p?.cookies, content: p?.cookiesDesc },
    { icon: Mail, title: p?.contact, content: p?.contactDesc },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {p?.title}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {p?.lastUpdated}: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Card className="mb-8 border-border/40">
              <CardContent className="p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  {p?.intro}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card key={index} className="border-border/40" data-testid={`card-privacy-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-medium">{section.title}</h2>
                        <p className="mt-2 text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {p?.questions}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
