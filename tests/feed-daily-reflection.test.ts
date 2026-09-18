import assert from "node:assert/strict";
import {
  dailyReflectionQuotes,
  getDailyReflectionQuote,
} from "../app/feed/_components/feed-shell/daily-reflection-quotes.ts";

assert.equal(dailyReflectionQuotes.length, 100);
assert.equal(new Set(dailyReflectionQuotes.map((quote) => quote.text)).size, 100);
assert.ok(dailyReflectionQuotes.every((quote) => quote.source === "BeGrateful biên soạn"));
assert.equal(
  getDailyReflectionQuote(new Date(2026, 8, 17)),
  getDailyReflectionQuote(new Date(2026, 8, 17, 23, 59)),
);
assert.notEqual(
  getDailyReflectionQuote(new Date(2026, 8, 17)),
  getDailyReflectionQuote(new Date(2026, 8, 18)),
);

console.log("feed daily reflection checks passed");
