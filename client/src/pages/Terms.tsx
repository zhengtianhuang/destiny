import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Scale, Ban, RefreshCw, Gavel } from "lucide-react";

export default function Terms() {
  const { t } = useLocale();
  const terms = t.terms;

  const sections = [
    { icon: CheckCircle, title: terms?.acceptance, content: terms?.acceptanceDesc },
    { icon: FileText, title: terms?.serviceDesc, content: terms?.serviceDescDesc },
    { icon: AlertTriangle, title: terms?.disclaimer, content: terms?.disclaimerDesc },
    { icon: Ban, title: terms?.prohibited, content: terms?.prohibitedDesc },
    { icon: Scale, title: terms?.intellectual, content: terms?.intellectualDesc },
    { icon: RefreshCw, title: terms?.changes, content: terms?.changesDesc },
    { icon: Gavel, title: terms?.governing, content: terms?.governingDesc },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {terms?.title}
              </h1>
              <p className="mt-4 text-muted-foreground">
                {terms?.lastUpdated}: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Card className="mb-8 border-border/40">
              <CardContent className="p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  {terms?.intro}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <Card key={index} className="border-border/40" data-testid={`card-terms-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-medium">{section.title}</h2>
                        <p className="mt-2 text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
