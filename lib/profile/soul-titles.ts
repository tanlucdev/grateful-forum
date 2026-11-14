export const soulTitles = ["tam-hon-an-yen", "nguoi-gieo-hat", "trai-tim-tinh-lang", "mam-xanh-kien-tri"] as const;
export type SoulTitle = (typeof soulTitles)[number];

export function toSoulTitle(value: unknown): SoulTitle {
  return soulTitles.find((title) => title === value) ?? soulTitles[0];
}
