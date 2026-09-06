import Image from "next/image";

const previews = [
  { alt: "Reward preview desktop", src: "/stitch/feed/mascot.jpg" },
  { alt: "Reward preview mobile", src: "/stitch/feed/breakfast.jpg" },
] as const;

export default function RewardPage() {
  return (
    <main className="min-h-screen bg-[#f4fbf8] px-4 py-6 pt-24 text-[#13231b] md:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3f7c60]">Reward</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight">Reward page</h1>
          <p className="max-w-2xl text-base leading-7 text-[#4a5b52]">
            Mừng những khoảnh khắc biết ơn đã được nuôi đều mỗi ngày.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {previews.map((preview, index) => (
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d7e6de] bg-white shadow-[0_12px_40px_rgba(13,36,24,0.08)]"
              key={preview.alt}
            >
              {/* ponytail: direct public assets avoid missing Stitch HTML at prerender. restore HTML only when committed. */}
              <Image
                alt={preview.alt}
                className="object-cover"
                fill
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
