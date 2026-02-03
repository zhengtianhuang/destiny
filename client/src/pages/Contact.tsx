import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/i18n/LocaleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Clock, Send, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { t } = useLocale();
  const c = t.contact;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: c?.successTitle,
      description: c?.successDesc,
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {c?.title}
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                {c?.subtitle}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="border-border/40 text-center" data-testid="card-contact-email">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">{c?.emailTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">support@mysticalfortune.app</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/40 text-center" data-testid="card-contact-response">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">{c?.responseTime}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c?.responseTimeDesc}</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/40 text-center" data-testid="card-contact-location">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">{c?.location}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c?.locationDesc}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/40" data-testid="card-contact-form">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-medium">{c?.formTitle}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{c?.nameLabel}</Label>
                      <Input 
                        id="name" 
                        placeholder={c?.namePlaceholder}
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{c?.emailLabel}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={c?.emailPlaceholder}
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">{c?.subjectLabel}</Label>
                    <Input 
                      id="subject" 
                      placeholder={c?.subjectPlaceholder}
                      required
                      data-testid="input-contact-subject"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">{c?.messageLabel}</Label>
                    <Textarea 
                      id="message" 
                      placeholder={c?.messagePlaceholder}
                      rows={5}
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto gap-2"
                    disabled={isSubmitting}
                    data-testid="button-contact-submit"
                  >
                    {isSubmitting ? c?.sending : c?.send}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                {c?.note}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
