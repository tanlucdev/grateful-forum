export const STICKER_GROUPS = [
  { id: "sprout", label: "Bé Mầm" },
  { id: "moment", label: "Khoảnh Khắc" },
  { id: "nature", label: "Thiên Nhiên" },
  { id: "badge", label: "Dấu Ấn & Vườn Hoa" },
] as const;

export type StickerGroup = (typeof STICKER_GROUPS)[number]["id"];
export type Locale = "vi" | "en";

export type Sticker = {
  id: string;
  group: StickerGroup;
  icon: StickerIconKey;
  labels: Record<Locale, string>;
  alts: Record<Locale, string>;
  tags: Record<Locale, readonly string[]>;
};

export const stickerIconKeys = ["heart", "star", "book", "tea", "coffee", "sun", "moon", "sprout", "flower", "mountain", "cloud", "leaf", "mail", "check", "home", "music", "flag", "drop", "plant"] as const;
export type StickerIconKey = (typeof stickerIconKeys)[number];

const groupTags: Record<StickerGroup, Record<Locale, readonly string[]>> = {
  sprout: { vi: ["be mam", "ban dong hanh"], en: ["sprout buddy", "companion"] },
  moment: { vi: ["khoanh khac", "nhat ky"], en: ["moment", "journal"] },
  nature: { vi: ["thien nhien", "vuon"], en: ["nature", "garden"] },
  badge: { vi: ["huy hieu", "dau an"], en: ["badge", "milestone"] },
};

function makeSticker(group: StickerGroup, slug: string, vi: string, en: string, viTags: readonly string[], enTags: readonly string[]): Sticker {
  return {
    id: `${group}-${slug}`,
    group,
    icon: stickerIconFor(slug),
    labels: { vi, en },
    alts: { vi: `Sticker ${vi}`, en: `${en} sticker` },
    tags: {
      vi: [...groupTags[group].vi, ...viTags],
      en: [...groupTags[group].en, ...enTags],
    },
  };
}

function stickerIconFor(slug: string): StickerIconKey {
  if (/(coffee)/.test(slug)) return "coffee";
  if (/(tea|cup|meal)/.test(slug)) return "tea";
  if (/(read|note|page)/.test(slug)) return "book";
  if (/(sun|light|lantern)/.test(slug)) return "sun";
  if (/(moon|night|sleep)/.test(slug)) return "moon";
  if (/(heart|hug|kind|care)/.test(slug)) return "heart";
  if (/(star|firefly)/.test(slug)) return "star";
  if (/(mail|message|call)/.test(slug)) return "mail";
  if (/(rain|dew|river|ocean)/.test(slug)) return "drop";
  if (/(mountain|pine|bamboo)/.test(slug)) return "mountain";
  if (/(cloud|mist)/.test(slug)) return "cloud";
  if (/(flower|lotus|bloom|meadow|wildflower)/.test(slug)) return "flower";
  if (/(garden|seed|sprout|pot|root|fern|leaf)/.test(slug)) return "plant";
  if (/(home|desk)/.test(slug)) return "home";
  if (/(music)/.test(slug)) return "music";
  if (/(task|win|first|seven|streak|champion|medal|badge)/.test(slug)) return "check";
  if (/(brave|flag)/.test(slug)) return "flag";
  return "sprout";
}

export const stickers = [
  makeSticker("sprout", "calm", "Bé Mầm an yên", "Calm Sprout", ["an yen", "binh tam"], ["calm", "peace"]),
  makeSticker("sprout", "smile", "Bé Mầm mỉm cười", "Smiling Sprout", ["vui ve", "mim cuoi"], ["smile", "joy"]),
  makeSticker("sprout", "tea", "Bé Mầm uống trà", "Tea Sprout", ["tra", "thu gian"], ["tea", "relax"]),
  makeSticker("sprout", "reading", "Bé Mầm đọc sách", "Reading Sprout", ["sach", "hoc hoi"], ["book", "learn"]),
  makeSticker("sprout", "sleep", "Bé Mầm ngủ ngon", "Sleepy Sprout", ["ngu ngon", "nghi ngoi"], ["sleep", "rest"]),
  makeSticker("sprout", "wave", "Bé Mầm vẫy tay", "Waving Sprout", ["chao", "ket noi"], ["wave", "hello"]),
  makeSticker("sprout", "meditate", "Bé Mầm thiền", "Meditating Sprout", ["thien", "hoi tho"], ["meditate", "breath"]),
  makeSticker("sprout", "raincoat", "Bé Mầm áo mưa", "Raincoat Sprout", ["mua", "che cho"], ["rain", "shelter"]),
  makeSticker("sprout", "lantern", "Bé Mầm cầm đèn", "Lantern Sprout", ["anh sang", "hy vong"], ["light", "hope"]),
  makeSticker("sprout", "notebook", "Bé Mầm ghi chép", "Notebook Sprout", ["viet", "so tay"], ["write", "notebook"]),
  makeSticker("sprout", "hug", "Bé Mầm ôm tim", "Heart Hug Sprout", ["yeu thuong", "om ap"], ["love", "hug"]),
  makeSticker("sprout", "umbrella", "Bé Mầm che ô", "Umbrella Sprout", ["bao boc", "mua nhe"], ["umbrella", "care"]),
  makeSticker("sprout", "chef", "Bé Mầm nấu ăn", "Cooking Sprout", ["bua an", "cham soc"], ["meal", "care"]),
  makeSticker("sprout", "mail", "Bé Mầm gửi thư", "Mail Sprout", ["loi cam on", "tin nhan"], ["thanks", "message"]),
  makeSticker("sprout", "star", "Bé Mầm ngắm sao", "Stargazing Sprout", ["ngoi sao", "uoc mo"], ["star", "dream"]),
  makeSticker("sprout", "music", "Bé Mầm nghe nhạc", "Music Sprout", ["am nhac", "riu rang"], ["music", "gentle"]),
  makeSticker("sprout", "sleepy", "Bé Mầm lim dim", "Drowsy Sprout", ["cham lai", "diu em"], ["slow", "soft"]),
  makeSticker("sprout", "brave", "Bé Mầm can đảm", "Brave Sprout", ["can dam", "vuon len"], ["brave", "grow"]),
  makeSticker("moment", "morning-coffee", "Cà phê buổi sáng", "Morning Coffee", ["ca phe", "buoi sang"], ["coffee", "morning"]),
  makeSticker("moment", "sunset-walk", "Dạo bước hoàng hôn", "Sunset Walk", ["hoang hon", "di dao"], ["sunset", "walk"]),
  makeSticker("moment", "warm-meal", "Bữa cơm ấm", "Warm Meal", ["bua com", "gia dinh"], ["meal", "family"]),
  makeSticker("moment", "kind-message", "Tin nhắn tử tế", "Kind Message", ["tin nhan", "tu te"], ["message", "kindness"]),
  makeSticker("moment", "completed-task", "Việc nhỏ hoàn thành", "Completed Task", ["hoan thanh", "nhe long"], ["done", "relief"]),
  makeSticker("moment", "quiet-breath", "Một hơi thở yên", "Quiet Breath", ["hoi tho", "tinh lang"], ["breath", "stillness"]),
  makeSticker("moment", "first-light", "Ánh nắng đầu ngày", "First Light", ["nang som", "bat dau"], ["light", "start"]),
  makeSticker("moment", "clean-desk", "Góc bàn gọn gàng", "Clean Desk", ["gon gang", "ban lam viec"], ["desk", "tidy"]),
  makeSticker("moment", "friend-call", "Cuộc gọi thân thương", "Friend Call", ["ban be", "goi dien"], ["friend", "call"]),
  makeSticker("moment", "tiny-win", "Chiến thắng nhỏ", "Tiny Win", ["thanh tuu", "vui nho"], ["win", "progress"]),
  makeSticker("moment", "soft-rain", "Cơn mưa dịu", "Soft Rain", ["mua", "diu dang"], ["rain", "soft"]),
  makeSticker("moment", "homecoming", "Trở về nhà", "Homecoming", ["ve nha", "binh yen"], ["home", "return"]),
  makeSticker("moment", "moon-note", "Dòng viết dưới trăng", "Moon Note", ["mat trang", "dem"], ["moon", "note"]),
  makeSticker("moment", "shared-laugh", "Tiếng cười chung", "Shared Laugh", ["tieng cuoi", "chia se"], ["laugh", "together"]),
  makeSticker("moment", "deep-rest", "Nghỉ ngơi sâu", "Deep Rest", ["nghi ngoi", "hoi phuc"], ["rest", "restore"]),
  makeSticker("moment", "new-page", "Trang mới mở ra", "New Page", ["trang moi", "khoi dau"], ["page", "beginning"]),
  makeSticker("moment", "slow-break", "Khoảng nghỉ chậm", "Slow Break", ["nghi chậm", "tam dung"], ["pause", "slow"]),
  makeSticker("moment", "thank-you", "Lời cảm ơn", "Thank You", ["cam on", "biet on"], ["thanks", "gratitude"]),
  makeSticker("nature", "leaf-dew", "Giọt sương trên lá", "Leaf Dew", ["suong", "la"], ["dew", "leaf"]),
  makeSticker("nature", "meadow-breeze", "Gió qua đồng cỏ", "Meadow Breeze", ["gio", "dong co"], ["breeze", "meadow"]),
  makeSticker("nature", "river-stone", "Viên đá bên suối", "River Stone", ["suoi", "da"], ["river", "stone"]),
  makeSticker("nature", "garden-bloom", "Hoa nở trong vườn", "Garden Bloom", ["hoa", "no ro"], ["flower", "bloom"]),
  makeSticker("nature", "pine-path", "Lối nhỏ rừng thông", "Pine Path", ["rung thong", "loi di"], ["pine", "path"]),
  makeSticker("nature", "cloud-drift", "Mây trôi chậm", "Cloud Drift", ["may", "troi cham"], ["cloud", "drift"]),
  makeSticker("nature", "sunrise-field", "Cánh đồng bình minh", "Sunrise Field", ["binh minh", "canh dong"], ["sunrise", "field"]),
  makeSticker("nature", "moon-garden", "Khu vườn trăng", "Moon Garden", ["vuon dem", "trang"], ["moon", "garden"]),
  makeSticker("nature", "rain-sprout", "Mầm non sau mưa", "Rain Sprout", ["mam non", "sau mua"], ["sprout", "rain"]),
  makeSticker("nature", "seedling-pot", "Chậu cây nhỏ", "Seedling Pot", ["chau cay", "mam xanh"], ["pot", "seedling"]),
  makeSticker("nature", "fern-shadow", "Bóng dương xỉ", "Fern Shadow", ["duong xi", "bong ram"], ["fern", "shade"]),
  makeSticker("nature", "lotus-pond", "Ao sen tĩnh", "Lotus Pond", ["hoa sen", "ao tinh"], ["lotus", "pond"]),
  makeSticker("nature", "ocean-shell", "Vỏ sò ngoài biển", "Ocean Shell", ["bien", "vo so"], ["ocean", "shell"]),
  makeSticker("nature", "firefly-night", "Đom đóm đêm hè", "Firefly Night", ["dom dom", "dem he"], ["firefly", "night"]),
  makeSticker("nature", "mountain-mist", "Sương núi", "Mountain Mist", ["nui", "suong"], ["mountain", "mist"]),
  makeSticker("nature", "herb-cup", "Cốc thảo mộc", "Herb Cup", ["thao moc", "am nong"], ["herb", "warmth"]),
  makeSticker("nature", "bamboo-light", "Nắng qua tre", "Bamboo Light", ["tre", "anh nang"], ["bamboo", "light"]),
  makeSticker("nature", "wildflower", "Bông hoa dại", "Wildflower", ["hoa dai", "tu nhien"], ["wildflower", "free"]),
  makeSticker("badge", "seven-day-seed", "Hạt mầm 7 ngày", "Seven-Day Seed", ["7 ngay", "chuoi ngay"], ["seven days", "streak"]),
  makeSticker("badge", "first-entry", "Trang đầu tiên", "First Entry", ["dau tien", "bat dau"], ["first", "entry"]),
  makeSticker("badge", "kind-heart", "Trái tim tử tế", "Kind Heart", ["trai tim", "tu te"], ["heart", "kind"]),
  makeSticker("badge", "mindful-breath", "Hơi thở chánh niệm", "Mindful Breath", ["chanh niem", "hoi tho"], ["mindful", "breath"]),
  makeSticker("badge", "gratitude-star", "Ngôi sao biết ơn", "Gratitude Star", ["ngoi sao", "biet on"], ["star", "gratitude"]),
  makeSticker("badge", "garden-keeper", "Người giữ vườn", "Garden Keeper", ["giu vuon", "ben bi"], ["garden", "keeper"]),
  makeSticker("badge", "brave-share", "Can đảm chia sẻ", "Brave Share", ["chia se", "can dam"], ["share", "brave"]),
  makeSticker("badge", "calm-streak", "Chuỗi ngày an yên", "Calm Streak", ["an yen", "deu dan"], ["calm", "streak"]),
  makeSticker("badge", "flower-medal", "Huy hiệu hoa nở", "Flower Medal", ["hoa no", "huy hieu"], ["flower", "medal"]),
  makeSticker("badge", "harvest-basket", "Giỏ mùa gặt", "Harvest Basket", ["mua gat", "thanh qua"], ["harvest", "reward"]),
  makeSticker("badge", "tea-circle", "Vòng trà tri ân", "Tea Circle", ["tra", "tri an"], ["tea", "circle"]),
  makeSticker("badge", "sunrise-badge", "Dấu nắng mới", "Sunrise Badge", ["nang moi", "hy vong"], ["sunrise", "hope"]),
  makeSticker("badge", "note-keeper", "Người giữ dòng viết", "Note Keeper", ["so tay", "ghi chep"], ["note", "keeper"]),
  makeSticker("badge", "rain-listener", "Người nghe mưa", "Rain Listener", ["nghe mua", "tinh lang"], ["rain", "listen"]),
  makeSticker("badge", "care-giver", "Người trao chăm sóc", "Care Giver", ["cham soc", "yeu thuong"], ["care", "give"]),
  makeSticker("badge", "steady-root", "Rễ vững vàng", "Steady Root", ["re cay", "vung vang"], ["root", "steady"]),
  makeSticker("badge", "monthly-bloom", "Vườn hoa tháng này", "Monthly Bloom", ["thang nay", "hoa no"], ["monthly", "bloom"]),
  makeSticker("badge", "quiet-champion", "Nhà vô địch lặng yên", "Quiet Champion", ["chien thang", "lang yen"], ["champion", "quiet"]),
] as const satisfies readonly Sticker[];

export type StickerId = (typeof stickers)[number]["id"];

export const DEFAULT_STICKER_ID: StickerId = "sprout-calm";

const stickerById = new Map<string, Sticker>(stickers.map((sticker) => [sticker.id, sticker]));

export function getStickerLabel(value: string | null | undefined, locale: Locale = "vi") {
  if (!value) return null;
  return stickerById.get(value)?.labels[locale] ?? value;
}

export function getSticker(value: string | null | undefined) {
  return value ? stickerById.get(value) ?? null : null;
}
