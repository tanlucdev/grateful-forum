export const writeWashiOptions = [
  { label: "Washi An Yên", accent: "#006d43", bg: "#d1e9e0" },
  { label: "Mây Xanh", accent: "#6b8fb6", bg: "#e6eff7" },
  { label: "Hoa Nhí", accent: "#c98d95", bg: "#f5e4e7" },
  { label: "Trà Thơm", accent: "#b79a63", bg: "#f2ead7" },
] as const;

export const writeMoods = [
  { label: "Bình thản & Ấm áp", icon: "☕" },
  { label: "Nhẹ lòng", icon: "🍃" },
  { label: "Hy vọng", icon: "☀️" },
  { label: "Lắng đọng", icon: "🌙" },
] as const;

export const writeQuotes = [
  "Một điều biết ơn ngắn cũng đủ làm ngày hôm nay dịu lại.",
  "Hạnh phúc không phải là có tất cả những gì bạn muốn, mà là trân trọng tất cả những gì bạn đang có.",
  "Mỗi lời biết ơn được gieo xuống là một mầm xanh hy vọng được nảy mầm.",
  "Những điều nhỏ bé hôm nay đang âm thầm nuôi lớn ngày mai.",
] as const;

export const writeStickers = [
  {
    label: "Bé Mầm",
    image: "/stitch/landing/mascot.png",
    alt: "Sticker Bé Mầm",
  },
  {
    label: "Tách trà",
    image: "/stitch/profile/coffee-mobile.jpg",
    alt: "Sticker tách trà",
  },
  {
    label: "Mầm xanh",
    image: "/stitch/profile/sprout.jpg",
    alt: "Sticker mầm xanh",
  },
  {
    label: "Dạo vườn",
    image: "/stitch/profile/park.jpg",
    alt: "Sticker dạo vườn",
  },
] as const;

export const defaultGratitudes = [] as string[];

export const defaultReflection = "";

export const privacyChoices = [
  {
    value: "private" as const,
    icon: "lock",
    title: "Riêng tư",
    description: "Mã hóa bảo mật, chỉ duy nhất bạn đọc lại trong cuốn sổ ký ức bí mật.",
  },
  {
    value: "public" as const,
    icon: "public",
    title: "Cộng đồng",
    description: "Lan tỏa năng lượng tích cực ẩn danh đến cộng đồng người nuôi dưỡng hạt mầm.",
  },
] as const;

export type WriteWashi = (typeof writeWashiOptions)[number]["label"];
export type WriteMood = (typeof writeMoods)[number]["label"];
export type WriteQuote = (typeof writeQuotes)[number];
export type WriteSticker = (typeof writeStickers)[number]["label"];
