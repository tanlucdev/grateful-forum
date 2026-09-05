import { profileAssets } from "./profile-view";

export type DesktopJournalEntry = {
  accent: string;
  date: string;
  icon: string;
  iconClass: string;
  media: null | {
    image: string;
    label: string;
    labelIcon: string;
    labelPosition: "bottom" | "top";
  };
  text: string;
  tags: readonly string[];
  likes: number;
  comments: number;
  visibility: "private" | "public";
};

export const allEntries = [
  {
    accent: "bg-[#006d43]",
    date: "Hôm nay, 08:30",
    icon: "wb_sunny",
    iconClass: "text-amber-500",
    media: {
      image: profileAssets.coffeeDesktop,
      label: "Gia đình",
      labelIcon: "favorite",
      labelPosition: "top",
    },
    text: "Biết ơn ly cà phê buổi sáng do mẹ pha. Mùi thơm của cà phê lan tỏa khắp phòng làm mình cảm thấy thật ấm lòng và sẵn sàng đón nhận ngày mới tràn đầy hy vọng.",
    tags: ["#giadinh", "#buoisang"],
    likes: 14,
    comments: 2,
    visibility: "private",
  },
  {
    accent: "bg-[#80d99e]",
    date: "Hôm qua, 21:15",
    icon: "bedtime",
    iconClass: "text-indigo-400",
    media: null,
    text: "Biết ơn vì đã hoàn thành xong deadline đúng hạn. Một ngày làm việc mệt mỏi nhưng thật sự xứng đáng khi nhìn lại thành quả. Cảm giác trút bỏ được gánh nặng thật nhẹ nhõm.",
    tags: ["#congviec", "#noiluc"],
    likes: 9,
    comments: 0,
    visibility: "public",
  },
  {
    accent: "bg-[#bccabe]",
    date: "22 Tháng 10",
    icon: "air",
    iconClass: "text-teal-600",
    media: {
      image: profileAssets.park,
      label: "Lofi Autumn",
      labelIcon: "headphones",
      labelPosition: "bottom",
    },
    text: "Đi dạo quanh bờ hồ buổi chiều thu se lạnh, nghe bản nhạc quen thuộc và ngắm lá vàng rơi. Thật thư thái và bình yên. Cảm ơn bản thân đã dành một khoảng lặng quý giá này.",
    tags: ["#thiennhien", "#thuvi"],
    likes: 23,
    comments: 5,
    visibility: "public",
  },
  {
    accent: "bg-[#006d43]",
    date: "20 Tháng 10",
    icon: "wb_twilight",
    iconClass: "text-amber-500",
    media: null,
    text: "Dành 15 phút tưới cây ngoài ban công và ngắm mầm non mới nhú. Cảm nhận sức sống bền bỉ và dịu dàng của thiên nhiên quanh mình.",
    tags: ["#thiennhien", "#tinhthuc"],
    likes: 18,
    comments: 1,
    visibility: "private",
  },
] satisfies DesktopJournalEntry[];

export const publicEntries = [
  {
    accent: "bg-[#80d99e]",
    date: "Hôm qua, 21:15",
    icon: "bedtime",
    iconClass: "text-indigo-400",
    media: null,
    text: "Biết ơn vì đã hoàn thành xong deadline đúng hạn. Một ngày làm việc mệt mỏi nhưng thật sự xứng đáng khi nhìn lại thành quả. Cảm giác trút bỏ được gánh nặng thật nhẹ nhõm.",
    tags: ["#congviec", "#noiluc"],
    likes: 9,
    comments: 0,
    visibility: "public",
  },
  {
    accent: "bg-[#bccabe]",
    date: "22 Tháng 10",
    icon: "air",
    iconClass: "text-teal-600",
    media: {
      image: profileAssets.park,
      label: "Lofi Autumn",
      labelIcon: "headphones",
      labelPosition: "bottom",
    },
    text: "Đi dạo quanh bờ hồ buổi chiều thu se lạnh, nghe bản nhạc quen thuộc và ngắm lá vàng rơi. Thật thư thái và bình yên. Cảm ơn bản thân đã dành một khoảng lặng quý giá này.",
    tags: ["#thiennhien", "#thuvi"],
    likes: 23,
    comments: 5,
    visibility: "public",
  },
  {
    accent: "bg-[#006d43]",
    date: "19 Tháng 10",
    icon: "sunny",
    iconClass: "text-amber-500",
    media: {
      image: profileAssets.coffeeDesktop,
      label: "Gia đình",
      labelIcon: "favorite",
      labelPosition: "top",
    },
    text: "Hôm nay biết ơn vì cả nhà vẫn khỏe mạnh và cười thật nhiều bên mâm cơm. Những điều giản dị nhất đôi khi chính là bình yên lớn nhất.",
    tags: ["#giadinh", "#bữacơmấm"],
    likes: 18,
    comments: 4,
    visibility: "public",
  },
] satisfies DesktopJournalEntry[];

export const moments = [
  {
    image: profileAssets.coffeeDesktop,
    title: "Cà phê sớm mai",
    quote: "“Một sớm mai chậm rãi bên tách trà ấm.”",
    meta: "08:30 • Bình yên",
    icon: "nest_eco_leaf",
    tone: "text-[#006d43]",
    likes: 15,
  },
  {
    image: profileAssets.park,
    title: "Bờ hồ mùa thu",
    quote: "“Gió heo may và tiếng lá xào xạc dưới chân.”",
    meta: "22/10 • Thư thái",
    icon: "air",
    tone: "text-teal-600",
    likes: 23,
  },
  {
    image: profileAssets.sprout,
    title: "Mầm cây cửa sổ",
    quote: "“Chiếc lá non đầu tiên đón ánh nắng mai.”",
    meta: "20/10 • Hy vọng",
    icon: "spa",
    tone: "text-[#006d43]",
    likes: 19,
  },
  {
    image: profileAssets.avatarDesktop,
    title: "Nụ cười an yên",
    quote: "“Tự mỉm cười với bản thân sau một ngày dài.”",
    meta: "18/10 • Biết ơn",
    icon: "sentiment_satisfied",
    tone: "text-[#006d3d]",
    likes: 32,
  },
  {
    image: profileAssets.coffeeDesktop,
    title: "Góc bếp chiều mưa",
    quote: "“Mùi hương gia đình xua tan cái lạnh chiều mưa.”",
    meta: "15/10 • Ấm áp",
    icon: "water_drop",
    tone: "text-amber-500",
    likes: 27,
  },
  {
    image: profileAssets.park,
    title: "Bầu trời hoàng hôn",
    quote: "“Khoảnh khắc bầu trời đổi màu trước khi hoàng hôn buông xuống.”",
    meta: "12/10 • Thanh thản",
    icon: "wb_twilight",
    tone: "text-indigo-400",
    likes: 41,
  },
] as const;
