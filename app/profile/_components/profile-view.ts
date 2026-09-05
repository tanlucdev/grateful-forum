import type { JournalEntry, ProfileDashboard } from "@/lib/profile/types";

export const profileAssets = {
  avatarDesktop: "/stitch/profile/avatar-desktop.jpg",
  avatarMobile: "/stitch/profile/avatar-mobile.jpg",
  coffeeDesktop: "/stitch/profile/coffee-desktop.jpg",
  coffeeMobile: "/stitch/profile/coffee-mobile.jpg",
  mascot: "/stitch/profile/mascot.jpg",
  park: "/stitch/profile/park.jpg",
  sprout: "/stitch/profile/sprout.jpg",
};

export type ProfileView = {
  avatarDesktop: string;
  avatarMobile: string;
  bio: string;
  displayName: string;
  email: string;
  entries: JournalEntry[];
  entryCount: number;
  publicCount: number;
  shareUrl: string;
  streak: number;
  username: string;
};

const sampleEntries: JournalEntry[] = [
  {
    id: "sample-coffee",
    content:
      "Biết ơn ly cà phê buổi sáng do mẹ pha. Mùi thơm của cà phê lan tỏa khắp phòng làm mình cảm thấy thật ấm lòng và sẵn sàng cho một ngày mới.",
    createdAt: new Date().toISOString(),
    visibility: "private",
  },
  {
    id: "sample-deadline",
    content:
      "Biết ơn vì đã hoàn thành xong deadline đúng hạn. Một ngày làm việc mệt mỏi nhưng thật sự xứng đáng khi nhìn lại thành quả. Cảm giác trút bỏ được gánh nặng thật nhẹ nhõm.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    visibility: "public",
  },
  {
    id: "sample-walk",
    content:
      "Đi dạo quanh bờ hồ buổi chiều thu se lạnh, nghe bản nhạc quen thuộc và ngắm lá vàng rơi. Thật thư thái và bình yên.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    visibility: "public",
  },
];

export function toProfileView(dashboard: ProfileDashboard | null): ProfileView {
  const entries = dashboard?.entries.length ? dashboard.entries : sampleEntries;
  const entryCount = dashboard?.entryCount || 28;
  const publicCount =
    dashboard?.entries.filter((entry) => entry.visibility === "public").length || 12;
  const displayName = dashboard?.profile.displayName || "Minh Trần";
  const shareSlug = slugify(displayName);
  const username = dashboard?.profile.username || shareSlug.replace(/-/g, "_");

  return {
    avatarDesktop: dashboard?.profile.avatarUrl || profileAssets.avatarDesktop,
    avatarMobile: dashboard?.profile.avatarUrl || profileAssets.avatarMobile,
    bio:
      dashboard?.profile.bio ||
      "Tìm niềm vui trong những điều nhỏ bé mỗi ngày 🌿",
    displayName,
    email: `${shareSlug.replace(/-/g, ".")}@example.com`,
    entries,
    entryCount,
    publicCount,
    shareUrl: `begrateful.app/share/${shareSlug}`,
    streak: dashboard?.streak || 3,
    username,
  };
}

export function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (hours < 24) {
    return "Hôm nay, 08:30";
  }

  if (days === 1) {
    return "Hôm qua, 21:15";
  }

  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    month: "long",
  }).format(new Date(value));
}

export function visibilityLabel(value: JournalEntry["visibility"]) {
  if (value === "public") {
    return "Công khai";
  }

  if (value === "anonymous") {
    return "Ẩn danh";
  }

  return "Riêng tư";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
