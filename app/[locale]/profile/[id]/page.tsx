import { z } from "zod";
import { profileQuerySchema } from "@/lib/profile/pagination";
import { ProfilePagination } from "../_components/profile-pagination";
import { Link } from "@/i18n/navigation";
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";
import { loadPublicProfile } from "@/lib/profile/load-public-profile";

export default async function PublicProfilePage({
  params, searchParams,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ cursor?: string; entry?: string }>;
}>) {
  const { id, locale } = await params;
  const t = await getTranslations("profile");
  if (!z.uuid().safeParse(id).success) notFound();
  const parsed = profileQuerySchema.safeParse(await searchParams);
  const profile = await loadPublicProfile(id, parsed.success ? parsed.data : { tab: "all" });

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 [overflow-wrap:anywhere] px-4 py-6 sm:px-6">
      <section className="soft-surface flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
            {profile.profile.avatarUrl ? (
              <img alt="" className="h-full w-full object-cover" src={profile.profile.avatarUrl} />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {profile.profile.displayName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.profile.displayName}
            </h1>
            {profile.profile.username ? (
              <p className="mt-1 text-sm text-muted-foreground">@{profile.profile.username}</p>
            ) : null}
          </div>
        </div>
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground"
          href="/feed"
        >
          {t("public.back")}
        </Link>
      </section>

      {profile.profile.bio ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {profile.profile.bio}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2">
        <Metric label={t("public.entries")} value={new Intl.NumberFormat(locale).format(profile.publicEntryCount)} />
        <Metric label={t("public.streak")} value={t("public.streakValue", { count: new Intl.NumberFormat(locale).format(profile.streak) })} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("public.journal")}
        </h2>
        <div className="grid gap-3">
          {profile.entries.length ? profile.entries.map((entry) => (
            <article
              className="soft-surface rounded-lg border border-border bg-card p-4"
              key={entry.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t(`visibility.${entry.visibility}`)}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt, locale)}</span>
              </div>
              {entry.entryKind === "handwritten" ? (
                <Link aria-label={t("actions.viewEntry")} className="mt-3 block overflow-hidden rounded-xl border border-border bg-[#fffdf8] p-2" href={`/entries/${entry.id}`}>{entry.handwritingPreviewUrl ? <img alt="" className="h-44 w-full rounded-lg object-cover" src={entry.handwritingPreviewUrl} /> : <span className="flex h-32 items-center justify-center text-sm font-semibold text-primary">{t("actions.viewEntry")}</span>}</Link>
              ) : entry.metadata.gratitudes.length || entry.metadata.reflection || entry.metadata.quote || entry.metadata.imageUrl ? (
                <>
                  {entry.metadata.quote ? <p className="mt-3 whitespace-pre-wrap text-sm italic leading-6 text-muted-foreground">“{entry.metadata.quote}”</p> : null}
                  {entry.metadata.imageUrl ? (
                    <img alt="" className="mt-3 h-44 w-full rounded-lg object-cover" src={entry.metadata.imageUrl} />
                  ) : null}
                  {entry.metadata.gratitudes.length ? (
                    <ul className="mt-3 space-y-1 text-sm leading-6 text-foreground">
                      {entry.metadata.gratitudes.map((item, index) => (
                        <li className="whitespace-pre-wrap" key={`${index}-${item}`}>
                          {index + 1}. {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.metadata.reflection ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{entry.metadata.reflection}</p> : null}
                </>
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {entry.content}
                </p>
              )}
              <ReportEntryButton entryId={entry.id} />
            </article>
          )) : (
            <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              {t("public.empty")}
            </p>
          )}
        </div>
      </section>
      <ProfilePagination pagination={profile.pagination} />
    </main>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <article className="soft-surface rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </article>
  );
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
