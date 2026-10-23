import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HandwritingViewer } from "@/components/entries/handwriting-viewer";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Link } from "@/i18n/navigation";
import { loadReadableEntry } from "@/lib/entries/load-entry";

export default async function EntryPage({ params }: Readonly<{ params: Promise<{ id: string; locale: string }> }>) {
  const { id, locale } = await params;
  const entry = await loadReadableEntry(id).catch(() => null);
  if (!entry) notFound();
  const t = await getTranslations("write");
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(entry.created_at));

  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6">
    <div className="flex items-center justify-between gap-4"><Button asChild className="hover:-translate-x-0.5" size="lg" variant="soft"><Link href="/profile"><MaterialSymbol className="transition-transform group-hover/button:-translate-x-0.5" name="arrow_back" />{t("handwriting.back")}</Link></Button><div className="text-right"><h1 className="text-2xl font-bold text-foreground">{entry.entry_kind === "handwritten" ? t("handwriting.handwrite") : t("handwriting.type")}</h1><p className="mt-1 text-sm text-muted-foreground">{date}</p></div></div>
    {entry.entry_kind === "handwritten" && entry.handwriting_data ? <div className="overflow-hidden rounded-2xl shadow-md"><HandwritingViewer document={entry.handwriting_data} label={t("handwriting.canvasLabel")} /></div> : <p className="whitespace-pre-wrap rounded-2xl bg-card p-6 text-base leading-7 text-foreground">{entry.content}</p>}
  </main>;
}
