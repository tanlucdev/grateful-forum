# Context tiếp tục: giới hạn diễn đàn cho khách

Cập nhật: 2026-10-24 (Asia/Ho_Chi_Minh).
Workspace: `/Users/nguyentanluc/tanlucdev/grateful`.
Branch hiện tại: `main`. Các sửa lỗi mới nhất **chưa commit, chưa push, chưa deploy**.

## Yêu cầu đã chốt

- Khách xem tối đa 5 bài thật, lấy từ Supabase; cần đăng nhập để xem thêm.
- Trang xem trước riêng: `/vi/feed/preview`, `/en/feed/preview`.
- Đăng nhập xong vào `/[locale]/feed` đầy đủ; người đã đăng nhập không bị giới hạn tổng số bài.
- Landing header có nút vào trang xem trước; hero cũng dẫn tới trang này.
- Nút header đã đổi thành “Xem thử”/“Preview”, đặt cạnh đăng nhập, giữ nhãn truy cập đầy đủ; chỉnh bố cục mobile/desktop.
- Người dùng báo vẫn xem được hết ở **`/feed`, chưa đăng nhập**, yêu cầu sửa triệt để.

## Những phần đã có trong main

Feature preview đã merge qua PR #43 (`6aaf15d`). Main sau đó có PR #44 (handwriting), #45 (profile rhythm). Không được hoàn tác những thay đổi khác này.

- `lib/feed/queries.ts`: xác thực server, khách tối đa 5 bài, không trả cursor; thành viên phân trang 8 bài.
- `lib/feed/access.ts`: policy truy cập; khách truyền cursor bị `FeedLoginRequiredError`.
- `app/api/feed/route.ts`: trả `401`, code `auth_required` khi khách tải tiếp.
- `/feed` server page chuyển khách sang `/feed/preview`; preview chuyển thành viên sang `/feed`.
- UI preview dùng chung `PublicFeedClient`, có lời mời đăng nhập ở cuối danh sách; link đăng nhập giữ `next` về feed đầy đủ.
- Catalog `vi/en` có các khóa tương ứng cho preview và nút landing.

## Kết quả điều tra gần nhất — cần phân biệt bằng chứng và suy luận

**Đã xác minh bằng HTTP local, không cookie:**

- `/api/feed` trả đúng 5 bài thật, `requiresLogin: true`, `nextCursor: null`.
- Gọi API với cursor bị `401`, không có `items`.
- `/vi/feed`, `/en/feed` chứa chuyển hướng sang preview. Next có thể stream redirect trong HTML với HTTP `200`; không chỉ kiểm tra status `307`.
- Trang preview render 5 bài cho mỗi layout. HTML chứa 10 thẻ bài vì cả mobile và desktop được render, CSS chỉ hiện một layout; đây là 5 bài trùng giữa hai layout, không phải 10 bài khác nhau.

**Chưa tái hiện trực tiếp phiên lỗi của người dùng.** Không kết luận chắc nguyên nhân họ gặp đã được chứng minh.

Lỗ hổng vòng đời state thấy trong mã: danh sách client đã tải không bị thu lại khi mất phiên; lỗi API `401` chỉ hiện lỗi chung. Không theo dõi đăng xuất ở tab khác; phản hồi tải cũ có thể cập nhật state. Đợt sửa hiện tại xử lý các nhánh này và ngăn cache API giữa các phiên.

## Thay đổi chưa commit hiện tại

1. `lib/feed/access.ts`
   - `GUEST_FEED_LIMIT = 5` dùng chung.
   - `toFeedPreview(items)` giữ tối đa 5 bài, xóa cursor, yêu cầu đăng nhập.
   - `appendFeedPage(current, next)` không ghép thêm bài nếu state hiện tại hoặc phản hồi đã bị giới hạn.
2. `app/[locale]/feed/_components/public-feed-client/index.tsx`
   - Gộp dữ liệu phân trang thành một state `page`; chuẩn hóa dữ liệu preview ngay khi khởi tạo.
   - `restrictToPreview()` thu danh sách về 5, dừng tải, hiện CTA; chuyển sang preview và refresh nếu đang ở feed đầy đủ.
   - Theo dõi `supabase.auth.onAuthStateChange` để xử lý mất phiên/phiên anonymous.
   - Xác minh lại user khi window `focus`/`pageshow`, phục vụ quay lại tab/trang từ lịch sử trình duyệt. Cleanup listener, tránh redirect từ callback sau unmount.
   - Dùng `accessRevision` bỏ phản hồi từ lượt tải bắt đầu trước khi mất quyền.
   - Nhận `ApiClientError` với `auth_required` thì chuyển về preview thay vì chỉ hiện lỗi chung.
   - File hiện khoảng 293 dòng; tránh tiếp tục nhồi logic.
3. `app/[locale]/feed/page.tsx`
   - Giữ `user`, thêm `key={user.id}` để reset state khi đổi tài khoản.
4. `lib/auth/current-user.ts`, `lib/feed/queries.ts`
   - Lỗi xác thực hoặc `user.is_anonymous` không được coi là thành viên đăng nhập đầy đủ.
5. `app/api/feed/route.ts`
   - Tất cả response success/error có `Cache-Control: private, no-store`.
6. `lib/api/feed.ts`
   - Fetch tải tiếp có `cache: "no-store"`, `credentials: "same-origin"`.
7. `tests/feed-access.test.ts`
   - Thêm kiểm tra thu danh sách 24 bài về 5; không mutate input; danh sách rỗng/ngắn; phản hồi muộn không mở lại preview; thành viên vẫn ghép được trang tiếp.
8. `tests/feed-access-http.test.ts` (file mới)
   - Kiểm tra API khách, cursor bị chặn, cache headers, redirect Việt/Anh, số thẻ preview và link đăng nhập.
   - Chạy riêng với server đang hoạt động, không nằm trong `test:logic` vì phụ thuộc HTTP.

## Kiểm tra đã chạy

Sau thay đổi cuối cùng, tất cả đều đạt:

```sh
npm run test:logic
npm run typecheck
npm run lint
npm run build
git diff --check
```

HTTP regression đã đạt trên local:

```sh
FEED_TEST_BASE_URL=http://localhost:3010 node --experimental-strip-types tests/feed-access-http.test.ts
```

Hai request Postman local có assertions đều đạt: preview đúng giới hạn + no-store; cursor trả 401 + no-store. Lưu ý Postman CLI trả exit code `1` cho response HTTP 401 dù assertion mong đợi 401 đã pass; đọc report thay vì chỉ dựa exit code.

Report tạm (không commit):

- `/tmp/grateful-feed-regression-preview.json`
- `/tmp/grateful-feed-regression-blocked.json`

## Môi trường và giới hạn xác minh

- Dev server do session này khởi chạy: `npm run dev -- --port 3010`; lúc bàn giao PID listener `93505`. Xác minh lại PID/cwd trước khi quản lý process.
- Không dùng bừa các port 3000/3001/3003/3005: chúng thuộc các dự án khác.
- Browser plugin trước đó bootstrap thất bại: `Cannot redefine property: process`. Chưa chạy được kiểm tra trực quan hoặc đăng xuất đa tab thực tế. Không được nói đã browser-test thành công.
- Chưa xác minh phiên lỗi trên trình duyệt hoặc deployment thật của người dùng.
- Chưa thay đổi Supabase RLS, public profile hay trang chi tiết bài. Đợt sửa này tập trung luồng `/feed` và API feed; không tuyên bố đã khóa toàn bộ truy cập dữ liệu public qua mọi đường.

## Session sau nên làm

1. Đọc file này, `AGENTS.md`, diff hiện tại; giữ nguyên các sửa chưa commit.
2. Khôi phục browser nếu có thể; tái hiện đường `/feed` với khách mới, phiên hết hạn, đăng xuất tab khác, Back/Forward và request tải tiếp đang chạy.
3. Kiểm tra signed-in vẫn xem tiếp bình thường; kiểm tra CTA và redirect sau đăng nhập. Nếu local đạt nhưng user vẫn gặp, cần URL deployment và phiên bản đang chạy để phân biệt mã cũ với lỗi hiện tại.
4. Rà soát phần sửa state/auth, tránh coi test helper là bằng chứng toàn bộ luồng trình duyệt đã đạt.
5. Sửa lỗi mới nếu có, chạy lại các kiểm tra cần thiết. Commit/push/deploy chỉ theo phạm vi được yêu cầu.

## Quy tắc repository cần giữ

- Đọc skill Next.js trước khi đổi cấu trúc/page/server-client; backend/API/review theo phần thay đổi. Skill Postman API Engineer là điểm vào khi làm API không tầm thường.
- UI mới/đổi cần khóa catalog đối xứng `vi/en`, không thêm copy thô; format theo locale.
- Trước handoff chạy `test:logic`, `typecheck`, `lint`, `build`.
- Nếu tạo branch, chỉ dùng prefix được AGENTS.md cho phép (`bugfix/` cho sửa lỗi).
- Sau khi tạo branch và commit, repo yêu cầu push `https://github.com/tanlucdev/begrateful.git` bằng tài khoản `tanlucdev`; trước mỗi `git push origin` phải xác minh `https://api.github.com/user` trả `login` chính xác `tanlucdev`. Không suy ra từ git author.
- Không tự spawn agent nếu người dùng hoặc skill/AGENTS.md không yêu cầu.
