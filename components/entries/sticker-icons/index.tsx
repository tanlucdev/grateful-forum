import { useLocale } from "next-intl";
import { createLucideIcon, Award, ShoppingBasket, BedDouble, BookOpen, ChefHat, CirclePause, Cloud, Bug, Droplet, Hand, House, Coffee, CookingPot, Flag, Flower2, Headphones, Heart, Lamp, Leaf, Mail, MessageCircleHeart, Moon, Mountain, Music, NotebookPen, Phone, Shell, Smile, Sprout, Star, Sun, Trees, Umbrella, Utensils, Wind, type LucideIcon } from "lucide-react";
import { getSticker, type StickerIconKey } from "@/lib/entries/stickers";

const Pebble = createLucideIcon("Pebble", [["path", { d: "M3 16c0-6 5-11 12-10 5 1 7 5 6 9-1 5-15 6-18 1ZM6 15q6 3 12-1", key: "pebble" }]]);
const Bamboo = createLucideIcon("Bamboo", [["path", { d: "M9 22V3m6 19V6M7 7h4M7 13h4M7 19h4M13 10h4M13 16h4M9 6Q2 8 3 3q5-1 6 3Zm6 7q6-1 6-6-5 0-6 6Z", key: "bamboo" }]]);
const Seed = createLucideIcon("Seed", [["path", { d: "M5 18C0 6 15 1 20 4c2 9-2 18-11 17m0-4 8-10M3 22h18", key: "seed" }]]);

const icons: Record<StickerIconKey, LucideIcon> = {
  heart: Heart, star: Star, book: BookOpen, tea: Coffee, coffee: Coffee, sun: Sun, moon: Moon,
  sprout: Sprout, flower: Flower2, mountain: Mountain, cloud: Cloud, leaf: Leaf, mail: Mail,
  check: Award, home: House, music: Music, flag: Flag, drop: Droplet, plant: Sprout,
  utensils: Utensils, message: MessageCircleHeart, wind: Wind, desk: NotebookPen, phone: Phone,
  laugh: Smile, bed: BedDouble, pause: CirclePause, stone: Pebble, trees: Trees, shell: Shell,
  bug: Bug, bamboo: Bamboo, seed: Seed, basket: ShoppingBasket, headphones: Headphones,
  umbrella: Umbrella, chef: ChefHat, notebook: NotebookPen, lantern: Lamp, meditate: Wind,
  wave: Hand, smile: Smile, sleepy: Moon,
};

const sproutActions = {
  "sprout-calm": "calm", "sprout-smile": "smile", "sprout-tea": "tea", "sprout-reading": "reading",
  "sprout-sleep": "sleep", "sprout-wave": "wave", "sprout-meditate": "meditate", "sprout-raincoat": "raincoat",
  "sprout-lantern": "lantern", "sprout-notebook": "notebook", "sprout-hug": "hug", "sprout-umbrella": "umbrella",
  "sprout-chef": "chef", "sprout-mail": "mail", "sprout-star": "star", "sprout-music": "music",
  "sprout-sleepy": "sleepy", "sprout-brave": "brave",
} as const;
const accessories: Partial<Record<(typeof sproutActions)[keyof typeof sproutActions], LucideIcon>> = {
  tea: Coffee, reading: BookOpen, sleep: Moon, raincoat: Cloud, lantern: Lamp, notebook: NotebookPen,
  hug: Heart, umbrella: Umbrella, chef: CookingPot, mail: Mail, star: Star, music: Headphones,
  sleepy: Moon, brave: Flag,
};

function SproutBuddy({ action }: Readonly<{ action: (typeof sproutActions)[keyof typeof sproutActions] }>) {
  const Accessory = accessories[action];
  const resting = ["calm", "sleep", "sleepy", "meditate"].includes(action);
  return <g stroke="#226446" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 49l-4 5m20-5 4 5" />
    <ellipse cx="32" cy="35" rx="16" ry="17" fill={action === "raincoat" ? "#f2d577" : "#d8efbd"} />
    <path d="M32 20v-7c-9 1-12-5-11-8 9-1 12 4 11 8 1-7 8-9 12-7 0 7-5 9-12 7" fill="#75b87d" />
    {resting ? <path d="m24 31 4 1m8 0 4-1" /> : <><circle cx="26" cy="31" r="1.4" fill="#226446" /><circle cx="38" cy="31" r="1.4" fill="#226446" /></>}
    <ellipse cx="22" cy="36" rx="3" ry="1.5" fill="#edb5af" stroke="none" /><ellipse cx="42" cy="36" rx="3" ry="1.5" fill="#edb5af" stroke="none" />
    <path d={action === "smile" ? "M28 36q4 8 8 0Z" : "M29 37q3 3 6 0"} fill={action === "smile" ? "#edb5af" : "none"} />
    <path d={action === "wave" ? "M17 39Q7 29 13 23m32 17 5 3" : action === "meditate" ? "M17 41l-5 5 10 2m25-7 5 5-10 2M23 52q9-8 18 0" : "M17 40l6 5m24-5-6 5"} />
    {action === "chef" ? <ChefHat x="18" y="1" width="28" height="24" fill="#fffdf5" /> : null}
    {Accessory ? <Accessory x={action === "music" ? 16 : action === "umbrella" ? 36 : action === "sleep" || action === "star" ? 43 : 23} y={action === "music" ? 20 : action === "umbrella" ? 4 : action === "sleep" || action === "star" ? 14 : 41} width={action === "music" ? 32 : action === "umbrella" ? 26 : 19} height={action === "music" ? 26 : 19} fill={action === "hug" ? "#efb5b6" : "#fffdf5"} /> : null}
    {action === "sleepy" ? <path d="m43 7 6 0-6 6h6" /> : null}
    {action === "music" ? <path d="M16 30v-6a16 16 0 0 1 32 0v6" /> : null}
  </g>;
}

export function StickerIcon({ className = "h-10 w-10", id }: Readonly<{ id: string; className?: string }>) {
  const locale = useLocale() === "en" ? "en" : "vi";
  const sticker = getSticker(id);
  if (!sticker) return null;
  const Icon = icons[sticker.icon];
  const action = sproutActions[id as keyof typeof sproutActions];
  const colors = { sprout: ["#d1e9e0", "#006d43"], moment: ["#f5e4e7", "#8b3a45"], nature: ["#e6eff7", "#2d5f7a"], badge: ["#f2ead7", "#7b5d24"] };
  const [background, foreground] = colors[sticker.group];
  return <svg role="img" aria-label={sticker.alts[locale]} className={className} fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect fill={background} height="58" rx="18" width="58" x="3" y="3" />
    {action ? <SproutBuddy action={action} /> : <Icon color={foreground} x="16" y="16" width="32" height="32" strokeWidth={1.8} />}
  </svg>;
}
