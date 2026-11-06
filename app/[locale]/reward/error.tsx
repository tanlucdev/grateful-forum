"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function RewardError({ reset }: { reset: () => void }) {
  const t = useTranslations("reward");
  const router = useRouter();
  return (
    <main className="mx-auto max-w-xl px-5 py-12 text-center">
      <h1 className="text-xl font-semibold">{t("error.title")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t("error.description")}</p>
      <button className="mt-5 min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground" onClick={() => { router.refresh(); reset(); }} type="button">{t("error.retry")}</button>
    </main>
  );
}
