# Bếp Nhà Mình

Website cộng đồng nấu ăn cá nhân, phi thương mại. M1b đã thay trang chủ tạm bằng giao diện Google Stitch và thêm bốn trang chi tiết công thức dựng tĩnh từ MDX.

M1c bổ sung `/cong-thuc` (tìm kiếm, lọc theo URL, món đã lưu) và `/hom-nay-an-gi` (bốc món từ MDX), cùng `sitemap.xml` và `robots.txt`.

Phần mở rộng M1c có `/thuc-don-tuan`, `/thuc-don-tuan/[slug]` từ MDX và `/chinh-sach-rieng-tu`. Trang thực đơn chọn tuần theo ngày tại Việt Nam; nếu không có tuần hiện tại, chọn tuần gần nhất. Bình luận thực đơn đang là UI tĩnh, chờ M2. Tính năng Thử thách tuần đã được bỏ khỏi dự án.

## Chạy local

1. `npm install`
2. Sao chép `.env.example` thành `.env.local`, thay bằng Measurement ID GA4 thật và tên miền thật.
3. `npm run dev`

Google Analytics chỉ được tải khi deploy Vercel Production và `NEXT_PUBLIC_GA_MEASUREMENT_ID` có dạng `G-...`. Dùng `npm run build` và `npm run typecheck` để kiểm tra.

## Nội dung M1b

- Thiết kế gốc nằm ở `design/stitch/trang-chu/` và `design/stitch/chi-tiet-cong-thuc/`. Token được định nghĩa trong `app/globals.css` theo `design/DESIGN.md`.
- Công thức ở `content/recipes/*.mdx`, được đọc bằng `gray-matter`, kiểm tra frontmatter bằng `zod`, và render nội dung với `next-mdx-remote/rsc`.
- Trang chi tiết được dựng tĩnh qua `generateStaticParams`; slug không có trả 404. Mỗi món có title, description và ảnh Open Graph riêng.
- Ảnh PNG hiện là minh họa placeholder do dự án tạo; cần thay bằng ảnh món thật có quyền sử dụng trước khi nghiệm thu nội dung.
- Lưu yêu thích hoạt động bằng localStorage. Chấm sao, lượt thích và bình luận là giao diện chờ M2, chưa kết nối Supabase và chưa hiển thị số liệu giả.
- `view_recipe` được gửi một lần cho mỗi lượt mở trang chi tiết trên Production, kèm `recipe_slug`.

## M1c

- Thiết kế được lưu trong `design/stitch/danh-sach-cong-thuc/` và `design/stitch/hom-nay-an-gi/`. Bản export Góp công thức và Hỏi bếp cũng đã lưu để triển khai ở M2.
- `/cong-thuc` lọc toàn bộ ở client theo `q`, `loai`, `do-kho`, `thoi-gian`, `yeu-thich=1` và `sap-xep`. Tìm kiếm cập nhật URL sau khoảng 300 ms bằng `replace`; bộ lọc dùng `push`.
- Yêu thích dùng localStorage và đồng bộ cùng lúc giữa nút tim và bộ lọc, kể cả khi đổi tab trình duyệt. Không cần đăng nhập.
- `/hom-nay-an-gi` chọn món ngẫu nhiên từ công thức hiện có sau khi lọc theo loại món, thời gian và khẩu phần. Nút bốc món gửi GA4 `random_dish` kèm `recipe_slug` trên Production.
- Sitemap chỉ chứa các trang đã dựng; tên miền lấy từ `SITE_URL`. Giao diện Góp công thức và Hỏi bếp vẫn chờ M2.

## Deploy M1a

Project đã được deploy Production với `SITE_URL=https://thanhtuyennt1405.id.vn` và GA4 Measurement ID thật trong Vercel Environment Variables. `thanhtuyennt1405.id.vn` đã được thêm ở Settings → Domains. Sau khi DNS và HTTPS hợp lệ, kiểm tra GA4 Realtime bằng một lượt truy cập thật.

Các trang chưa có export Stitch riêng sẽ được dựng sau khi nhận thiết kế trong `design/stitch/` và `design/DESIGN.md`.

### Trạng thái M1a hiện tại

- Vercel project: ha120204s-projects/cong-dong-nau-an
- Production deployment: https://cong-dong-nau-an.vercel.app (Vercel Authentication đang bật cho địa chỉ vercel.app; custom domain được ngoại lệ)
- GA4 Measurement ID và SITE_URL đã đặt trong Production Environment.
- Custom domain thanhtuyennt1405.id.vn đã được gắn vào project. ZoneDNS có hai bản ghi A cho host @: 216.198.79.1 và 64.29.17.1. Vercel đã xác nhận cấu hình hợp lệ, cấp chứng chỉ HTTPS và trả HTTP 200 trên domain. Bản HTML production có mã GA4 và email liên hệ.
- GA4 chỉ tải trên Vercel Production, không tải khi chạy local để lượt truy cập phát triển không đi vào báo cáo.

## Vận hành các mốc sau

- Kiểm tra nội dung mới và ẩn spam trong Supabase Table Editor.
- Theo dõi job dọn `rate_limit_buckets` và lịch sử chạy.
- Nếu dùng Supabase Free, theo dõi trạng thái project vì project ít hoạt động có thể bị tạm dừng; kiểm tra kết nối trước đợt nghiệm thu.

## Quyết định đã chốt cho M2

- Bình luận, câu hỏi và câu trả lời hiển thị ngay; dev hậu kiểm bằng cột `hidden`. Chỉ công thức người dùng gửi có `status = pending`.
- Khi triển khai Supabase ở M2, `comments.target_type` chỉ nhận `recipe` và `weekly_menu`.
- Lượt thích là thao tác bật/tắt: server thêm hoặc xóa theo `(recipe_slug, visitor_hash)`; chấm sao được đổi bằng upsert theo cùng khóa. Các thao tác cập nhật/xóa chỉ dùng key có quyền cao trên server.
- Đọc `recipe_stats`, bình luận và hỏi đáp bằng yêu cầu không cache; nội dung MDX vẫn build từ file.
- Rate limit dùng RPC SQL tăng bộ đếm nguyên tử: `INSERT ... ON CONFLICT DO UPDATE SET hits = hits + 1 RETURNING hits`. Chỉ `service_role` được `EXECUTE`. Dọn bucket cũ bằng Supabase Cron, hoặc Vercel Cron nếu không dùng được Supabase Cron.
- Khi kết nối Supabase, hỗ trợ cặp key legacy `anon`/`service_role` hoặc cặp mới `publishable`/`secret` tùy project. Key có quyền cao và key dùng ở server không được đưa vào `NEXT_PUBLIC_*` hoặc client bundle.
- Trang `/chinh-sach-rieng-tu` cần bản export Stitch trước khi dựng giao diện. Email liên hệ hiện tại do chủ website cung cấp; có thể thay đổi sau.
