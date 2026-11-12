// Stable IDs are persisted as nullable strings; unknown legacy values stay neutral.
export const washiPatterns = {
  calm: { backgroundColor: "#c5e9dc" },
  warm: { backgroundColor: "#f4cdd0" },
  cream: { backgroundColor: "#f1e5bc" },
  sky: { backgroundColor: "#c4e2f4" },
  dots: { backgroundColor: "#e6efdd", backgroundImage: "radial-gradient(#6b9275 1px, transparent 1px)", backgroundSize: "8px 8px" },
  stripes: { backgroundImage: "repeating-linear-gradient(45deg, #e8d3da 0 5px, #faf0f0 5px 10px)" },
  gingham: { backgroundColor: "#f3eee4", backgroundImage: "linear-gradient(90deg, #87b0a54d 50%, transparent 50%), linear-gradient(#87b0a54d 50%, transparent 50%)", backgroundSize: "12px 12px" },
  leaves: { backgroundColor: "#e4efde", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='14'%3E%3Cpath d='M4 10Q2 2 12 3Q13 10 4 10Z' fill='%23769b72'/%3E%3C/svg%3E\")" },
} as const;
export type WashiId = keyof typeof washiPatterns;
export const washiIds = ["calm", "warm", "cream", "sky", "dots", "stripes", "gingham", "leaves"] as const satisfies readonly WashiId[];
export function washiStyle(value: string) {
  return Object.hasOwn(washiPatterns, value) ? washiPatterns[value as WashiId] : { backgroundColor: "#e6e2d9" };
}
