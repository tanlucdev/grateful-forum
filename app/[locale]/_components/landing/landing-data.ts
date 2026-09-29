export type NavItem = Readonly<{
  href: string;
  label: string;
}>;

export type MoodItem = Readonly<{
  icon: string;
  label: string;
}>;

export type JournalLeft = Readonly<{
  page: number;
  day: string;
  season: string;
  mood: string;
  note: string;
  quote: string;
  gratitude: readonly string[];
  place: string;
}>;

export type JournalRight = Readonly<{
  page: number;
  title: string;
  date: string;
  badge: string;
  photo: string;
  desc: string;
  quote: string;
  tags: readonly string[];
}>;

export type JournalSpread = Readonly<{
  left: JournalLeft;
  right: JournalRight;
}>;

export type BadgeItem = Readonly<{
  icon: string;
  status: string;
  title: string;
  copy: string;
  unlocked: boolean;
}>;

export type FeedCard = Readonly<{
  avatar: string;
  name: string;
  time: string;
  tag: string;
  quote: string;
}>;

export const navItems: readonly NavItem[] = [
  { href: "#home", label: "Trang chủ" },
  { href: "#community", label: "Cộng đồng" },
  { href: "#private-public", label: "Chia sẻ" },
  { href: "#garden-spotlight", label: "Lịch thực hành" },
  { href: "#journal-flipbook", label: "Hành trình cá nhân" },
];

export const navItemsEn: readonly NavItem[] = [
  { href: "#home", label: "Home" },
  { href: "#community", label: "Community" },
  { href: "#private-public", label: "Sharing" },
  { href: "#garden-spotlight", label: "Practice" },
  { href: "#journal-flipbook", label: "Personal path" },
];

export const moods: readonly MoodItem[] = [
  { icon: "🌿", label: "Bình yên" },
  { icon: "☀️", label: "Ấm áp" },
  { icon: "☁️", label: "Nhẹ lòng" },
];

export const moodsEn: readonly MoodItem[] = [
  { icon: "🌿", label: "Peaceful" },
  { icon: "☀️", label: "Warm" },
  { icon: "☁️", label: "Light" },
];

export const journalSpreads: readonly JournalSpread[] = [
  {
    left: {
      page: 24,
      day: "Thứ Năm, 24 Tháng 10",
      season: "Mùa Thu Tĩnh Lặng 🍃",
      mood: "Bình thản & Ấm áp",
      note: "Uống trà hoa cúc nóng và đón ánh bình minh dịu nhẹ",
      quote:
        "Sáng nay thức dậy sớm hơn mọi khi, pha một tách trà hoa cúc ấm. Nhìn ánh nắng xuyên qua kẽ lá ngoài ban công, cảm thấy biết ơn vì mình vẫn được hít thở bầu không khí trong lành này. Đôi khi hạnh phúc chỉ đơn giản là một nhịp thở chậm rãi giữa lòng thành phố.",
      gratitude: [
        "Tách trà sớm mẹ chu đáo chuẩn bị còn bốc khói ấm.",
        "Cơn gió thu mát lành thổi bay mọi âu lo áp lực công việc.",
        "Mầm non hoa mười giờ bắt đầu trổ bông đầu tiên.",
      ],
      place: "Ban công góc nhỏ",
    },
    right: {
      page: 25,
      title: "TRANG 25 • MỘT KHOẢNH KHẮC BIẾT ƠN",
      date: "Hôm nay, 25 Tháng 10",
      badge: "Đã gieo mầm trọn vẹn",
      photo: "Quán cà phê góc phố cùng bạn cũ",
      desc: "Khoảnh khắc nắng chiều đổ vàng trên ô cửa kính rêu phong, mùi cà phê mộc ấm nồng.",
      quote:
        "Gặp lại người bạn thân thời đại học sau gần 2 năm xa cách. Chúng mình không còn vội vã bàn về thành tựu hay tiền bạc, mà ngồi hàng giờ lắng nghe những buồn vui vụn vặt thường nhật. Cảm giác thật biết ơn vì tình bạn mộc mạc và chân thành này vẫn vẹn nguyên như ngày đầu.",
      tags: ["#tinhban", "#gocnho"],
    },
  },
  {
    left: {
      page: 26,
      day: "Thứ Bảy, 26 Tháng 10",
      season: "Một Ngày Dịu Sáng 🌤",
      mood: "Nhẹ nhõm & Rõ ràng",
      note: "Đi bộ chậm qua công viên sau cơn mưa đêm",
      quote:
        "Sau cơn mưa, con đường trước nhà sạch và sáng hơn. Mình đi bộ chậm, nghe tiếng lá còn ướt chạm vào nhau, tự nhiên thấy lòng có chỗ để nghỉ. Biết ơn vì những khoảng lặng nhỏ vẫn luôn tìm được đường quay về.",
      gratitude: [
        "Tin nhắn hỏi thăm đúng lúc từ một người bạn cũ.",
        "Mười phút đi bộ đủ làm đầu óc nhẹ đi rất nhiều.",
        "Bữa cơm tối giản dị nhưng cả nhà ngồi lại cùng nhau.",
      ],
      place: "Con đường sau mưa",
    },
    right: {
      page: 27,
      title: "TRANG 27 • GỬI LẠI NIỀM VUI",
      date: "Chủ Nhật, 27 Tháng 10",
      badge: "Một niềm vui được giữ lại",
      photo: "Bữa tối nhỏ bên gia đình",
      desc: "Căn bếp sáng đèn, tiếng nói chuyện chậm rãi, một món canh nóng vừa đủ cho ngày cuối tuần.",
      quote:
        "Tối nay cả nhà ăn cơm muộn hơn thường lệ. Không có chuyện gì đặc biệt, chỉ là ai cũng kể một chút về ngày của mình. Mình nhận ra sự bình yên đôi khi không cần được sắp đặt, chỉ cần mọi người còn ngồi gần nhau.",
      tags: ["#giadinh", "#buaan"],
    },
  },
  {
    left: {
      page: 28,
      day: "Thứ Hai, 28 Tháng 10",
      season: "Nhịp Làm Việc Êm 🌿",
      mood: "Tập trung & Biết đủ",
      note: "Hoàn thành một việc khó mà không tự ép mình quá sức",
      quote:
        "Hôm nay mình đóng lại một đầu việc kéo dài nhiều ngày. Không phải bằng sự vội vàng, mà bằng từng bước nhỏ rõ ràng. Biết ơn vì cơ thể đã nhắc mình nghỉ đúng lúc và vì mình đã biết nghe.",
      gratitude: [
        "Một buổi họp kết thúc sớm hơn dự kiến.",
        "Danh sách việc cần làm cuối cùng cũng ngắn lại.",
        "Ly nước ấm trên bàn đúng lúc cổ họng khô.",
      ],
      place: "Góc bàn làm việc",
    },
    right: {
      page: 29,
      title: "TRANG 29 • NHÌN LẠI ĐIỀU TỐT ĐẸP",
      date: "Thứ Ba, 29 Tháng 10",
      badge: "Một ngày đã đủ đầy",
      photo: "Bản nhạc cũ trong buổi chiều",
      desc: "Giai điệu quen vang nhẹ trong phòng, kéo theo một cảm giác được trở về với chính mình.",
      quote:
        "Có những ngày không cần một điều lớn lao để thấy biết ơn. Chỉ cần nghe lại bản nhạc từng thương, mình đã thấy nhiều phiên bản của mình được ôm lại thật dịu dàng.",
      tags: ["#congviec", "#amnhac"],
    },
  },
  {
    left: {
      page: 30,
      day: "Thứ Tư, 30 Tháng 10",
      season: "Buổi Sáng Trong Lành 🌱",
      mood: "Tươi mới & Chậm rãi",
      note: "Tưới cây trước khi mở điện thoại",
      quote:
        "Mình bắt đầu ngày mới bằng việc tưới mấy chậu cây nhỏ ngoài cửa. Đất thơm mùi ẩm, lá rung nhẹ dưới tia nước. Cảm giác được chăm sóc một điều bé nhỏ làm mình cũng mềm lại.",
      gratitude: [
        "Chậu húng quế mọc thêm vài lá non.",
        "Không khí sáng nay trong hơn mọi ngày.",
        "Mình đã ăn sáng tử tế trước khi làm việc.",
      ],
      place: "Hiên nhà xanh",
    },
    right: {
      page: 31,
      title: "TRANG 31 • MỘT LỜI CẢM ƠN",
      date: "Thứ Năm, 31 Tháng 10",
      badge: "Đã nói ra lòng biết ơn",
      photo: "Cuộc gọi ngắn với mẹ",
      desc: "Mười lăm phút hỏi han giản dị, đủ làm khoảng cách trong ngày trở nên gần hơn.",
      quote:
        "Mình gọi cho mẹ khi đang chờ xe. Câu chuyện chỉ xoay quanh bữa ăn, thời tiết, vài điều quen thuộc, nhưng khi cúp máy mình thấy lòng ấm hẳn. Biết ơn những kết nối không cần phô trương.",
      tags: ["#giadinh", "#yeuthuong"],
    },
  },
];

export const journalSpreadsEn: readonly JournalSpread[] = [
  {
    left: {
      page: 24,
      day: "Thursday, October 24",
      season: "Quiet Autumn 🍃",
      mood: "Calm & Warm",
      note: "A hot chamomile tea and soft sunrise light",
      quote: "I woke up earlier than usual, made a warm cup of chamomile tea, and watched sunlight slip through the balcony leaves. Happiness was simply a slower breath in the middle of the city.",
      gratitude: ["The warm tea Mom prepared.", "A cool autumn breeze easing the workday pressure.", "The first flower bud on the balcony."],
      place: "Small balcony corner",
    },
    right: {
      page: 25,
      title: "PAGE 25 • A GRATEFUL MOMENT",
      date: "Today, October 25",
      badge: "Fully planted",
      photo: "A corner cafe with an old friend",
      desc: "Late sun on mossy window glass, with the warm scent of coffee.",
      quote: "I met a close college friend after nearly two years. We did not rush through achievements or money. We simply listened to ordinary joys and worries, and I felt thankful this friendship still felt honest.",
      tags: ["#friendship", "#smallcorner"],
    },
  },
  {
    left: {
      page: 26,
      day: "Saturday, October 26",
      season: "A Soft Bright Day 🌤",
      mood: "Light & Clear",
      note: "A slow walk through the park after night rain",
      quote: "After the rain, the street looked cleaner and brighter. I walked slowly, heard wet leaves touch each other, and felt my heart find a place to rest.",
      gratitude: ["A timely check-in from an old friend.", "Ten minutes of walking made my mind lighter.", "A simple dinner where everyone sat together."],
      place: "The road after rain",
    },
    right: {
      page: 27,
      title: "PAGE 27 • SAVING JOY",
      date: "Sunday, October 27",
      badge: "One joy kept",
      photo: "A small family dinner",
      desc: "A lit kitchen, gentle conversation, and soup warm enough for the weekend.",
      quote: "Tonight the family ate later than usual. Nothing special happened, but everyone shared a little about their day. Peace sometimes only needs people sitting close.",
      tags: ["#family", "#meal"],
    },
  },
  {
    left: {
      page: 28,
      day: "Monday, October 28",
      season: "A Gentle Work Rhythm 🌿",
      mood: "Focused & Enough",
      note: "Finishing a hard task without pushing too far",
      quote: "Today I closed a task that had lasted many days. Not by rushing, but by taking clear small steps. I am grateful my body reminded me to rest, and that I listened.",
      gratitude: ["A meeting ended earlier than expected.", "The to-do list finally became shorter.", "Warm water arrived just when my throat felt dry."],
      place: "Desk corner",
    },
    right: {
      page: 29,
      title: "PAGE 29 • LOOKING BACK",
      date: "Tuesday, October 29",
      badge: "A day enough",
      photo: "An old song in the afternoon",
      desc: "A familiar melody filled the room and brought me back to myself.",
      quote: "Some days do not need anything grand to feel grateful. Hearing an old beloved song helped me hold many versions of myself with tenderness.",
      tags: ["#work", "#music"],
    },
  },
  {
    left: {
      page: 30,
      day: "Wednesday, October 30",
      season: "Fresh Morning 🌱",
      mood: "Fresh & Slow",
      note: "Watering plants before opening the phone",
      quote: "I began the day by watering the small pots near the door. Damp soil, leaves moving under the water, and caring for something tiny made me softer too.",
      gratitude: ["The basil grew a few new leaves.", "The morning air felt clearer than usual.", "I ate a real breakfast before working."],
      place: "Green doorstep",
    },
    right: {
      page: 31,
      title: "PAGE 31 • A THANK-YOU",
      date: "Thursday, October 31",
      badge: "Gratitude spoken",
      photo: "A short call with Mom",
      desc: "Fifteen simple minutes of checking in made the day feel closer.",
      quote: "I called Mom while waiting for a ride. The conversation was only food, weather, and familiar things, but after hanging up my heart felt warm.",
      tags: ["#family", "#care"],
    },
  },
];

export const badgeData: readonly BadgeItem[] = [
  { icon: "🌱", status: "Đã mở", title: "Mầm Bắt Đầu", copy: "Viết lời biết ơn đầu tiên của bạn.", unlocked: true },
  { icon: "🧘", status: "Đã mở", title: "Nhịp Viết Đều", copy: "Giữ lại những điều đáng trân trọng.", unlocked: true },
  { icon: "🌿", status: "Đang tiếp tục", title: "Thói Quen Biết Ơn", copy: "Duy trì việc viết qua từng ngày.", unlocked: true },
  { icon: "🌳", status: "Chưa mở", title: "Người Gieo Lan Tỏa", copy: "Chia sẻ điều tích cực với cộng đồng.", unlocked: false },
  { icon: "💧", status: "Đã mở", title: "Lời Cảm Ơn Bền Bỉ", copy: "Quay lại với việc thực hành khi cần.", unlocked: true },
  { icon: "🌸", status: "Đang tiếp tục", title: "Ghi Lại Điều Tốt Đẹp", copy: "Nhìn thấy điều đáng biết ơn trong ngày.", unlocked: true },
  { icon: "☀️", status: "Chưa mở", title: "Bắt Đầu Ngày Mới", copy: "Mở ngày bằng một lời biết ơn.", unlocked: false },
  { icon: "🍃", status: "Chưa mở", title: "Hành Trình Dài Hơn", copy: "Để lòng biết ơn trở thành một nhịp sống.", unlocked: false },
];

export const badgeDataEn: readonly BadgeItem[] = [
  { icon: "🌱", status: "Unlocked", title: "First Sprout", copy: "Write your first gratitude note.", unlocked: true },
  { icon: "🧘", status: "Unlocked", title: "Steady Rhythm", copy: "Keep what is worth cherishing.", unlocked: true },
  { icon: "🌿", status: "Continuing", title: "Gratitude Habit", copy: "Keep writing through the days.", unlocked: true },
  { icon: "🌳", status: "Locked", title: "Spreading Grower", copy: "Share something positive with the community.", unlocked: false },
  { icon: "💧", status: "Unlocked", title: "Resilient Thanks", copy: "Return to practice when you need it.", unlocked: true },
  { icon: "🌸", status: "Continuing", title: "Noticing Goodness", copy: "See one grateful thing in the day.", unlocked: true },
  { icon: "☀️", status: "Locked", title: "Begin The Day", copy: "Open the day with gratitude.", unlocked: false },
  { icon: "🍃", status: "Locked", title: "Longer Journey", copy: "Let gratitude become a rhythm of life.", unlocked: false },
];

export const feedCards: readonly FeedCard[] = [
  {
    avatar: "MN",
    name: "Mai Nhã",
    time: "25 phút trước",
    tag: "#BìnhYên",
    quote:
      "Biết ơn chuyến xe buýt sáng nay không bị kẹt, bác tài xế bật bài nhạc Trịnh dịu dàng, thấy lòng mình mềm mại hẳn.",
  },
  {
    avatar: "HL",
    name: "Hoàng Long",
    time: "1 giờ trước",
    tag: "#TĩnhLặng",
    quote:
      "Cảm ơn mẹ đã gửi cho thùng bưởi quê ngọt mát. Ăn từng múi bưởi mà nghe thoang thoảng mùi đất quê nhà và tình thương của mẹ.",
  },
  {
    avatar: "TA",
    name: "Tuệ An",
    time: "3 giờ trước",
    tag: "#NuôiDưỡng",
    quote:
      "Hôm nay mình lại viết được một lời biết ơn. Nhìn những bài viết khác trong cộng đồng, mình có thêm động lực để tiếp tục.",
  },
];

export const feedCardsEn: readonly FeedCard[] = [
  {
    avatar: "MN",
    name: "Mai Nha",
    time: "25 minutes ago",
    tag: "#Peaceful",
    quote: "Grateful the morning bus was not stuck in traffic, and the driver played gentle old music. My heart softened.",
  },
  {
    avatar: "HL",
    name: "Hoang Long",
    time: "1 hour ago",
    tag: "#Stillness",
    quote: "Thankful Mom sent a box of pomelos from home. Every bite carried the scent of soil and her care.",
  },
  {
    avatar: "TA",
    name: "Tue An",
    time: "3 hours ago",
    tag: "#Nourish",
    quote: "I wrote one more gratitude today. Reading other community notes gave me motivation to continue.",
  },
];

export const calendarDays = Array.from({ length: 19 }, (_, index) => index + 1);
