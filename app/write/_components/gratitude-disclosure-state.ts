export const GRATITUDE_PLACEHOLDERS = [
  "Điều đầu tiên...",
  "Một người/khoảnh khắc...",
  "Một điều nhỏ hôm nay...",
] as const;

export function getGratitudeInputs(gratitudes: string[]) {
  return gratitudes.length >= 3 ? gratitudes : [...gratitudes, ...Array.from({ length: 3 - gratitudes.length }, () => "")];
}

export function getGratitudeSummary(gratitudes: string[]) {
  const filledCount = gratitudes.filter((item) => item.trim()).length;
  return {
    complete: filledCount >= 3,
    text: filledCount >= 3 ? "Đủ 3 điều" : filledCount > 0 ? `${filledCount}/3 đã viết` : "0/3",
  };
}
