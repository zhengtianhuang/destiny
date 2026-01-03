import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { History, Trash2, Eye, Sparkles, Calendar, User } from "lucide-react";
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from "@/lib/historyStorage";
import { useLocale } from "@/i18n/LocaleContext";

export default function HistoryPage() {
  const [, setLocation] = useLocation();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { t, locale } = useLocale();

  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleView = (item: HistoryItem) => {
    sessionStorage.setItem("fortuneResult", JSON.stringify(item.result));
    setLocation("/result");
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistoryItems(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setHistoryItems([]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "zh-TW" ? "zh-TW" : locale === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const labels = {
    "zh-TW": {
      title: "分析記錄",
      subtitle: "查看您過去的命理分析結果",
      empty: "尚無分析記錄",
      emptyDesc: "完成分析後會自動保存到這裡",
      startAnalysis: "開始分析",
      view: "查看",
      delete: "刪除",
      clearAll: "清除全部",
      confirmClear: "確定清除所有記錄？",
      confirmClearDesc: "此操作無法復原，所有分析記錄將被永久刪除。",
      cancel: "取消",
      confirm: "確認清除",
      zodiac: "星座",
    },
    en: {
      title: "Analysis History",
      subtitle: "View your past fortune analysis results",
      empty: "No records yet",
      emptyDesc: "Your analysis results will be saved here automatically",
      startAnalysis: "Start Analysis",
      view: "View",
      delete: "Delete",
      clearAll: "Clear All",
      confirmClear: "Clear all records?",
      confirmClearDesc: "This action cannot be undone. All records will be permanently deleted.",
      cancel: "Cancel",
      confirm: "Confirm",
      zodiac: "Zodiac",
    },
    ja: {
      title: "分析履歴",
      subtitle: "過去の運命分析結果を確認",
      empty: "記録がありません",
      emptyDesc: "分析結果は自動的にここに保存されます",
      startAnalysis: "分析開始",
      view: "表示",
      delete: "削除",
      clearAll: "すべて削除",
      confirmClear: "すべての記録を削除しますか？",
      confirmClearDesc: "この操作は取り消せません。すべての記録が完全に削除されます。",
      cancel: "キャンセル",
      confirm: "確認",
      zodiac: "星座",
    },
  };

  const l = labels[locale];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <History className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold">{l.title}</h1>
              <p className="mt-2 text-muted-foreground">{l.subtitle}</p>
            </div>

            {historyItems.length > 0 && (
              <div className="mb-6 flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      {l.clearAll}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{l.confirmClear}</AlertDialogTitle>
                      <AlertDialogDescription>{l.confirmClearDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{l.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAll}>{l.confirm}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {historyItems.length === 0 ? (
              <Card className="text-center">
                <CardContent className="py-12">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">{l.empty}</h3>
                  <p className="mt-2 text-muted-foreground">{l.emptyDesc}</p>
                  <Button
                    className="mt-6"
                    onClick={() => setLocation("/analyze")}
                    data-testid="button-start-analysis"
                  >
                    {l.startAnalysis}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden" data-testid={`card-history-${item.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(item.date)}
                            </div>
                          </div>
                        </div>
                        {item.result.astrology?.zodiacSign && (
                          <Badge variant="secondary">
                            {item.result.astrology.zodiacSign}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleView(item)}
                          data-testid={`button-view-history-${item.id}`}
                        >
                          <Eye className="h-4 w-4" />
                          {l.view}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDelete(item.id)}
                          data-testid={`button-delete-history-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          {l.delete}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
