import type { FeedItem } from "@/lib/feed/types";

export type DisplayItem = {
  id: string;
  authorName: string;
  avatarUrl?: string | null;
  category: string;
  content: string;
  detail: string;
  imageSrc?: string;
  isAnonymous: boolean;
  isSample?: boolean;
  profileHref?: string;
  time: string;
  tone: "primary" | "tertiary" | "mint";
};

export const sampleItems: DisplayItem[] = [
  {
    id: "stitch-sample-1",
    authorName: "Nguyễn An",
    avatarUrl: "/stitch/landing/avatar-1.jpg",
    category: "Tĩnh lặng",
    content:
      "Biết ơn vì một buổi sáng nắng ấm. Không khí trong lành làm tinh thần sảng khoái hẳn lên.",
    detail: "Góc ban công quen thuộc",
    isAnonymous: false,
    isSample: true,
    time: "5 phút trước",
    tone: "primary",
  },
  {
    id: "stitch-sample-2",
    authorName: "Ẩn danh",
    category: "Kết nối",
    content:
      "Cảm ơn vì cốc cà phê ngon hôm nay. Một khởi đầu hoàn hảo cho ngày mới.",
    detail: "Tình bạn vô điều kiện",
    isAnonymous: true,
    isSample: true,
    time: "2 giờ trước",
    tone: "tertiary",
  },
  {
    id: "stitch-sample-3",
    authorName: "Ẩn danh",
    category: "Sự sống",
    content:
      "Rất biết ơn đồng nghiệp đã giúp đỡ hoàn thành dự án đúng hạn. Cảm giác thật nhẹ nhõm!",
    detail: "Gieo mầm xanh hy vọng",
    imageSrc: "/stitch/feed/succulent.jpg",
    isAnonymous: true,
    isSample: true,
    time: "Hôm qua",
    tone: "mint",
  },
  {
    id: "stitch-sample-4",
    authorName: "Ẩn danh",
    category: "Dịu dàng",
    content:
      "Vừa được một người lạ nhường chỗ trên xe buýt. Những điều nhỏ bé dễ thương trong cuộc sống.",
    detail: "Một cử chỉ tử tế",
    isAnonymous: true,
    isSample: true,
    time: "Hôm qua",
    tone: "primary",
  },
];

export function toDisplayItem(item: FeedItem, index: number): DisplayItem {
  const author = item.visibility !== "anonymous" ? item.author : null;
  const tone = (["primary", "tertiary", "mint"] as const)[index % 3];
  const category = ["Tĩnh lặng", "Kết nối", "Sự sống"][index % 3];
  const detail = ["Góc bình yên trong ngày", "Một kết nối ấm áp", "Điều nhỏ đang nở hoa"][
    index % 3
  ];

  return {
    id: item.id,
    authorName: author ? author.displayName ?? "BeGrateful" : "Ẩn danh",
    avatarUrl: author?.avatarUrl,
    category,
    content: item.content,
    detail,
    isAnonymous: !author,
    profileHref: author ? `/profile/${author.id}` : undefined,
    time: formatRelative(item.createdAt),
    tone,
  };
}

export function toneClasses(tone: DisplayItem["tone"]) {
  if (tone === "tertiary") {
    return { dot: "bg-[#a5393e]", text: "text-[#a5393e]" };
  }

  if (tone === "mint") {
    return { dot: "bg-[#4ca374]", text: "text-[#006d43]" };
  }

  return { dot: "bg-[#006d43]", text: "text-[#006d43]" };
}

export function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (minutes < 60) {
    return `${Math.max(1, minutes)} phút trước`;
  }

  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  if (days === 1) {
    return "Hôm qua";
  }

  if (days < 7) {
    return `${days} ngày trước`;
  }

  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}
