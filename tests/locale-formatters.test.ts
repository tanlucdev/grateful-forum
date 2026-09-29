import assert from "node:assert/strict";
import { formatRelative, type FeedCopy } from "../app/[locale]/feed/_components/feed-data.ts";

const copy: FeedCopy = {
  anonymous: "",
  anonymousShare: "",
  public: "",
  publicShare: "",
  relative: { minute: (count) => `${count}m ago`, hour: (count) => `${count}h ago`, yesterday: "Yesterday", day: (count) => `${count}d ago` },
};
const now = Date.now;
Date.now = () => Date.parse("2026-09-28T12:00:00Z");
assert.equal(formatRelative("2026-09-28T11:59:00Z", "en", copy), "1m ago");
assert.equal(new Intl.DateTimeFormat("vi", { month: "long" }).format(new Date("2026-09-01T00:00:00Z")), "Tháng 9");
assert.equal(new Intl.DateTimeFormat("en", { month: "long" }).format(new Date("2026-09-01T00:00:00Z")), "September");
Date.now = now;
console.log("locale formatter checks passed");
