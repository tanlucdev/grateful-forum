// Local-only Supabase HTTP fixture; never deploy as an authentication service.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Postman handlers load as CommonJS.
const http = require("node:http");
const userId = "00000000-0000-4000-8000-000000000001";
const dateAt = (daysAgo) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
};
const rows = [];
function add(createdAt, index, user_id = userId, extra = {}) {
  rows.push({ id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`, user_id, created_at: createdAt.toISOString(), visibility: index <= 5 ? "anonymous" : "private", gratitudes: ["synthetic gratitude"], hidden_at: null, owner_deleted_at: null, ...extra });
}
for (let index = 0; index < 1101; index++) add(dateAt(40), index + 1);
for (let index = 0; index < 14; index++) add(dateAt(20 - index), 1102 + index);
for (let index = 0; index < 3; index++) add(dateAt(2 - index), 1116 + index);
add(dateAt(0), 1119, "00000000-0000-4000-8000-000000000002");
add(dateAt(0), 1120, userId, { hidden_at: new Date().toISOString() });
add(dateAt(0), 1121, userId, { owner_deleted_at: new Date().toISOString() });
add(new Date(Date.now() + 86400000), 1122);
rows.sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));

let mode = "normal";
http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const send = (status, value) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(value)); };
  if (url.pathname === "/__test-state" && req.method === "POST") {
    mode = req.body.mode;
    return send(200, { mode: req.body.mode });
  }
  if (url.pathname === "/auth/v1/user") {
    if (!req.headers.authorization?.startsWith("Bearer ")) return send(401, { message: "Not signed in" });
    return send(200, { id: userId, aud: "authenticated", role: "authenticated", email: "fixture@example.test", app_metadata: {}, user_metadata: { display_name: "Rewards fixture" } });
  }
  if (url.pathname === "/rest/v1/profiles") return send(200, { id: userId, timezone: "Asia/Ho_Chi_Minh", display_name: "Rewards fixture", avatar_url: null, calendar_tour_seen_at: null });
  if (url.pathname === "/rest/v1/entries") {
    if (mode === "error") return send(503, { code: "fixture_failure", message: "Synthetic storage failure" });
    const q = url.searchParams;
    // Reject an unscoped reward read, rather than letting a permissive fixture hide it.
    if (q.get("user_id") !== `eq.${userId}` || q.get("hidden_at") !== "is.null" || q.get("owner_deleted_at") !== "is.null") return send(400, { message: "Missing owner or visibility filters" });
    let filtered = mode === "empty" ? [] : rows.filter((row) => row.user_id === userId && !row.hidden_at && !row.owner_deleted_at);
    if (q.has("created_at")) filtered = filtered.filter((row) => row.created_at <= q.get("created_at").slice(4));
    if (q.has("or")) {
      const cursor = q.get("or").match(/created_at\.gt\.([^,]+),and\(created_at\.eq\.[^,]+,id\.gt\.([^\)]+)/);
      if (!cursor) return send(400, { message: "Unsupported cursor" });
      filtered = filtered.filter((row) => row.created_at > cursor[1] || (row.created_at === cursor[1] && row.id > cursor[2]));
    }
    if (q.get("order")?.startsWith("created_at.desc")) filtered.reverse();
    const limit = Math.min(Number(q.get("limit") || 1000), 1000);
    const columns = q.get("select").split(",");
    return send(200, filtered.slice(0, limit).map((row) => Object.fromEntries(columns.map((key) => [key, row[key]]))));
  }
  return send(501, { message: "Outside rewards fixture contract" });
}).listen(process.env.PORT || 4011);
