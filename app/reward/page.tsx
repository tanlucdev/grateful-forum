import Image from "next/image";

const previews = [
  { alt: "Reward preview desktop", src: "/stitch/landing/mascot.png" },
  { alt: "Reward preview mobile", src: "/stitch/feed/breakfast.jpg" },
] as const;

export default function RewardPage() {
  return (
    <main className="min-h-screen px-4 py-6 pt-6 text-foreground md:px-6 md:pt-24">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Reward</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight">Reward page</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Mừng những khoảnh khắc biết ơn đã được nuôi đều mỗi ngày.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {previews.map((preview, index) => (
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              key={preview.alt}
            >
              {/* ponytail: direct public assets avoid missing Stitch HTML at prerender. restore HTML only when committed. */}
              <Image
                alt={preview.alt}
                className="object-cover"
                fill
                loading={index === 1 ? "eager" : undefined}
                priority={index === 0}
                src={preview.src}
              />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
