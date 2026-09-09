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
  likes: number;
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
  hearts: number;
  comments: number;
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
  value: number;
  unlocked: boolean;
}>;

export type FeedCard = Readonly<{
  avatar: string;
  name: string;
  time: string;
  tag: string;
  quote: string;
  hearts: number;
  thanks: number;
}>;

export const navItems: readonly NavItem[] = [
  { href: "#", label: "Trang chủ" },
  { href: "#private-public", label: "Viết an yên" },
  { href: "#garden-spotlight", label: "Vườn hoa 365" },
  { href: "#milestones", label: "Huy hiệu" },
  { href: "#community", label: "Cộng đồng" },
];

export const moods: readonly MoodItem[] = [
  { icon: "🌿", label: "Bình yên" },
  { icon: "☀️", label: "Ấm áp" },
  { icon: "☁️", label: "Nhẹ lòng" },
];

export const landingStats = [
  { value: 50000, suffix: "+", label: "đóa hoa đã nở" },
  { value: 2400, suffix: "+", label: "bạn đồng hành" },
  { value: 100, suffix: "%", label: "riêng tư" },
] as const;

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
      likes: 16,
    },
    right: {
      page: 25,
      title: "TRANG 25 • MỞ LỐI AN YÊN",
      date: "Hôm nay, 25 Tháng 10",
      badge: "Đã gieo mầm trọn vẹn",
      photo: "Quán cà phê góc phố cùng bạn cũ",
      desc: "Khoảnh khắc nắng chiều đổ vàng trên ô cửa kính rêu phong, mùi cà phê mộc ấm nồng.",
      quote:
        "Gặp lại người bạn thân thời đại học sau gần 2 năm xa cách. Chúng mình không còn vội vã bàn về thành tựu hay tiền bạc, mà ngồi hàng giờ lắng nghe những buồn vui vụn vặt thường nhật. Cảm giác thật biết ơn vì tình bạn mộc mạc và chân thành này vẫn vẹn nguyên như ngày đầu.",
      tags: ["#tinhban", "#gocnho"],
      hearts: 28,
      comments: 6,
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
      likes: 21,
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
      hearts: 34,
      comments: 9,
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
      likes: 18,
    },
    right: {
      page: 29,
      title: "TRANG 29 • NHÌN LẠI BÌNH YÊN",
      date: "Thứ Ba, 29 Tháng 10",
      badge: "Một ngày đã đủ đầy",
      photo: "Bản nhạc cũ trong buổi chiều",
      desc: "Giai điệu quen vang nhẹ trong phòng, kéo theo một cảm giác được trở về với chính mình.",
      quote:
        "Có những ngày không cần một điều lớn lao để thấy biết ơn. Chỉ cần nghe lại bản nhạc từng thương, mình đã thấy nhiều phiên bản của mình được ôm lại thật dịu dàng.",
      tags: ["#congviec", "#amnhac"],
      hearts: 25,
      comments: 4,
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
      likes: 29,
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
      hearts: 41,
      comments: 8,
    },
  },
];

export const badgeData: readonly BadgeItem[] = [
  { icon: "🌱", status: "Đã đạt • 3/3 ngày", title: "Mầm Non Tỉnh Thức", copy: "Gieo hạt mầm đầu tiên vào tâm trí.", value: 1, unlocked: true },
  { icon: "🧘", status: "Đã đạt • 7/7 ngày", title: "Tuần Lễ An Yên", copy: "Trọn một tuần lắng lại cảm nhận sự sống.", value: 1, unlocked: true },
  { icon: "🌿", status: "Tiến độ 14/21 ngày", title: "Thói Quen 21 Ngày", copy: "Khoa học hình thành phản xạ biết ơn.", value: 0.66, unlocked: true },
  { icon: "🌳", status: "Mục tiêu 100 ngày", title: "Rừng Cây Đại Thụ", copy: "Biến an yên thành cội nguồn bền vững.", value: 0.2, unlocked: false },
  { icon: "💧", status: "Đã đạt • 30/30 ngày", title: "Giọt Nước Kiên Trì", copy: "Tưới mát lòng mình bằng những điều nhỏ.", value: 1, unlocked: true },
  { icon: "🌸", status: "Tiến độ 42/60 ngày", title: "Đóa Hoa Dịu Lành", copy: "Ghi lại yêu thương trước khi ngày khép lại.", value: 0.7, unlocked: true },
  { icon: "☀️", status: "Mục tiêu 90 ngày", title: "Nắng Mai Biết Ơn", copy: "Bắt đầu buổi sáng bằng một lời cảm ơn.", value: 0.35, unlocked: false },
  { icon: "🍃", status: "Mục tiêu 365 ngày", title: "Khu Vườn 365", copy: "Một năm chăm sóc tâm hồn thật bền bỉ.", value: 0.12, unlocked: false },
];

export const feedCards: readonly FeedCard[] = [
  {
    avatar: "MN",
    name: "Mai Nhã",
    time: "25 phút trước",
    tag: "#BìnhYên",
    quote:
      "Biết ơn chuyến xe buýt sáng nay không bị kẹt, bác tài xế bật bài nhạc Trịnh dịu dàng, thấy lòng mình mềm mại hẳn.",
    hearts: 42,
    thanks: 19,
  },
  {
    avatar: "HL",
    name: "Hoàng Long",
    time: "1 giờ trước",
    tag: "#TĩnhLặng",
    quote:
      "Cảm ơn mẹ đã gửi cho thùng bưởi quê ngọt mát. Ăn từng múi bưởi mà nghe thoang thoảng mùi đất quê nhà và tình thương của mẹ.",
    hearts: 68,
    thanks: 31,
  },
  {
    avatar: "TA",
    name: "Tuệ An",
    time: "3 giờ trước",
    tag: "#NuôiDưỡng",
    quote:
      "Vừa cán mốc 21 ngày viết liên tục. Lần đầu tiên kiên trì với thói quen chữa lành nhẹ nhàng đến vậy cùng Bé Mầm.",
    hearts: 112,
    thanks: 47,
  },
];

export const calendarDays = Array.from({ length: 19 }, (_, index) => index + 1);
