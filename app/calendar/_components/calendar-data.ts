export const avatar =
  "https://lh3.googleusercontent.com/aida/AEtjO1U5Hn6qblq7R8CiD-a8xIX7ky01idz9YmxPXvcqFE0mwtPHeUWflMzuNKF4ckEwAecgGhS_xYp4c80295CVt_xkom6poh14rSVwjJrsMWg08kRThogXibBwkRnVtWjeAUm7UXXjigpL1Sw13Pdy27kbPp_3oOLTMkk7-mcFKG2LO5_oNNtEf1HqZB3m75Ur1aY-d3DTnNxhIt4V0yHeX-mCkY-eGmh-MIrxR0bus4U_SMpYsxcCrLTb2LE";

export const coffee =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBUVXHd4gCYf7XuKImfMkZBDsVpu2ujk90NLk-v0AiI90f3n3Ii-0-PiUNqAa9Iz-F-K3XhzJ-7NKQrqT5h7BXS97XgOikD6mQhtA0vIwLrbiIv94BlE3aQ0eAK_7q2OQdQN4dWh6RcrKshK7nlhJqbcbGHp_EcmPbMFMWH8Tk1KzF9iW-B68_u_C06X";

export const heatPattern = ["seed", "bloom", "sprout", "seed", "bloom", "sprout", "seed", "bloom", "empty"] as const;
export const monthDays = [30, ...Array.from({ length: 31 }, (_, index) => index + 1), 1, 2, 3];

export const badges = [
  ["🌱", "Khởi đầu an lành", "Hoàn thành 7 ngày ghi nhật ký đầu tiên liên tục.", "✓ Đã đạt"],
  ["🔥", "Chiếc mầm kiên trì", "Duy trì liên tục 21 ngày hình thành nếp sống chánh niệm.", "14/21 ngày"],
  ["☀️", "Ánh dương ban mai", "10 lần bắt đầu ngày mới bằng việc viết trước 08:00 sáng.", "✓ Đã đạt"],
  ["💚", "Trái tim rộng mở", "Gieo năng lượng tích cực bằng việc chia sẻ 5 bài lên cộng đồng.", "✓ Đã đạt"],
] as const;
