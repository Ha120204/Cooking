# Bếp Nhà Mình — Design system

Nguồn: Google Stitch, project 10706340174886776625, screen f1f2275f4e014409840280cce79b5749. Bản này được chép từ đặc tả người dùng cung cấp ngày 09/11/2026. Các mục “Quyết định triển khai” ở cuối là chuẩn ưu tiên nếu nội dung phía trên khác nhau.

## Tinh thần

Website cộng đồng nấu ăn cá nhân, phi thương mại. Giao diện tiếng Việt, mobile first, ấm và gần gũi như bếp nhà Việt. Ưu tiên chữ dễ đọc và vùng chạm lớn khi đang nấu. Không có giá bán, quảng cáo, đăng nhập hay trang admin.

## Token màu

| Token | HEX | Vai trò |
| --- | --- | --- |
| `primary` | `#C2542D` | Nền CTA, trạng thái yêu thích |
| `primary-hover` | `#9E3F1D` | Nền hover, chữ/link nhấn |
| `primary-light` | `#F8ECE8` | Nền badge và bước nấu |
| `secondary` | `#3E7B52` | Độ khó, mẹo bếp, thành công |
| `secondary-light` | `#EBF3EE` | Nền tag xanh |
| `canvas` | `#FBF9F5` | Nền trang |
| `surface` | `#FFFFFF` | Card, modal, điều hướng |
| `surface-dim` | `#F5EFEB` | Ghi chú, ô nhập |
| `text-main` | `#26211E` | Tiêu đề và chữ chính |
| `text-secondary` | `#635952` | Mô tả và thông tin phụ |
| `text-muted` | `#8C8178` | Icon hoặc chữ từ 18px trở lên |
| `border` | `#E6DED6` | Viền mặc định |
| `border-hover` | `#D4C7BA` | Viền hover |
| `star` | `#E5A124` | Sao đánh giá |
| `success` | `#3E7B52` | Phản hồi thành công |
| `error-border` | `#D93829` | Viền ô lỗi |
| `error-text` | `#B42318` | Chữ báo lỗi |

Không dùng `primary` làm màu chữ trên canvas. Nút nền `primary` dùng chữ trắng. Link và chữ nhấn dùng `primary-hover`. `text-muted` chỉ dùng cho icon hoặc chữ lớn (≥18px).

## Typography

Font: Be Vietnam Pro qua `next/font/google`, subset `vietnamese`, weight 400/500/600/700. Fallback: Plus Jakarta Sans, system UI, Segoe UI, Roboto, sans-serif. Chừa line-height đủ cho dấu tiếng Việt.

| Token | Size | Line-height | Weight | Dùng cho |
| --- | --- | --- | --- | --- |
| `display` | 32px | 40px | 700 | Hero desktop, tên món lớn |
| `h1` | 24px | 32px | 700 | Tiêu đề mobile, danh mục |
| `h2` | 20px | 28px | 600 | Đầu mục, card lớn |
| `h3` | 18px | 26px | 600 | Tên card, bước nấu |
| `body-lg` | 16px | 26px | 400/500 | Hướng dẫn nấu |
| `body-md` | 14px | 22px | 400/500 | Mô tả, nguyên liệu, bình luận |
| `body-sm` | 12px | 18px | 500 | Badge, ngày đăng |

## Khoảng cách và bố cục

- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48px tương ứng `space-1/2/3/4/5/6/8/10/12`.
- Mobile <640px: 1 cột, lề 16px, bottom navigation cao 60px.
- Tablet 640–1023px: lưới 2 cột, lề 24px.
- Desktop ≥1024px: lưới 3 hoặc 4 cột, lề 32px, nội dung rộng tối đa 1200px.
- Radius: 6px (`sm`), 12px (`md`), 16px (`lg`), 9999px (`full`). Recipe card dùng `md` = 12px.
- Shadow thường: `0 2px 8px rgba(38, 33, 30, 0.05)`.
- Shadow hover: `0 8px 24px rgba(194, 84, 45, 0.12)`.
- Focus cho mọi thành phần tương tác: `outline: 2px solid #9E3F1D; outline-offset: 2px`.
- Vùng chạm tối thiểu 44×44px.

## Mẫu component

### Header và điều hướng

Desktop: logo Bếp Nhà Mình, tìm kiếm, liên kết Công thức, Thực đơn tuần, Thử thách tuần, Hỏi bếp, Hôm nay ăn gì?, nút “+ Góp công thức”. Mobile: bottom navigation 4 tab Trang chủ (`/`), Tìm món (`/cong-thuc`), Yêu thích (`/cong-thuc?yeu-thich=1`; đọc localStorage), Góc bếp (`/hoi-bep`).

### RecipeCard

Ảnh món 4:3 (hoặc 1:1 trong danh sách mobile), góc 12px. Nút yêu thích tròn nổi ở góc trên phải. Hiển thị độ khó, thời gian nấu, tên món, đánh giá từ `recipe_stats`. Có đánh giá: “4.9 (128 đánh giá)”. Không có đánh giá: ẩn sao và hiện “Chưa có đánh giá”. Không hiển thị avatar/tác giả vì MDX chưa có trường author.

### Community

Khung bình luận có nền `surface-dim`, viền `border`, tên hiển thị và nội dung. MVP không có upload ảnh.

### Trạng thái

- Loading: skeleton tông ấm, hiệu ứng pulse nhẹ.
- Empty: lời mời khám phá, ví dụ “Gian bếp này chưa nhóm lửa...”.
- Validation: viền `error-border`, chữ `error-text` và thông báo cụ thể.
- Error: nêu vấn đề và hành động thử lại.

## Quyết định triển khai

1. Project dùng Tailwind v4: khai báo token trong `@theme` ở `app/globals.css`, không tạo `tailwind.config.js`.
2. Font Be Vietnam Pro dùng `next/font/google` với subset tiếng Việt và các weight 400/500/600/700.
3. Các chỉnh sửa về tương phản, radius 12px, route điều hướng, bỏ tác giả trên card, bỏ upload ảnh là chuẩn ưu tiên.
4. Trang chủ tạm M1a được thay bằng giao diện Stitch sau khi có export trang chủ. Không tự suy ra bố cục trang từ tài liệu design system này.
5. Mỗi trang cần export riêng trong `design/stitch/<ten-trang>/` gồm HTML/Tailwind và ảnh chụp trước khi chuyển sang Next.js component. Trang thiếu export phải hỏi người dùng, không tự thiết kế.
