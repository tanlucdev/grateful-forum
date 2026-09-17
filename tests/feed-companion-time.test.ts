import assert from "node:assert/strict";
import { getCompanionTimeCopy } from "../app/feed/_components/feed-shell/companion-time.ts";

assert.equal(getCompanionTimeCopy(5).label, "Buổi sáng");
assert.equal(getCompanionTimeCopy(11).label, "Buổi trưa");
assert.equal(getCompanionTimeCopy(14).label, "Buổi chiều");
assert.equal(getCompanionTimeCopy(18).label, "Buổi tối");
assert.equal(getCompanionTimeCopy(23).label, "Đêm khuya");

console.log("feed companion time checks passed");
