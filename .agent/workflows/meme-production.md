---
description: Pipeline chuẩn 5 bước để sản xuất Meme cho iZTools (Dev Reality + Master Persona)
---

# 🐸 Meme Production Workflow

Quy trình này đảm bảo chất lượng nội dung "mặn", visual nhất quán và không xả rác code.

## Bước 1: Ideation (Batch)

- Agent sử dụng dàn nhân vật **Tèo, Tý, Tủn, Tẹt, Sếp** và map vào các **iZTools Master**.
- Output: Bảng 5-10 ý tưởng kèm: ID, Master, Scenario, Visual Description.

## Bước 2: Idea Approval

- Người dùng (User) lựa chọn các ID được duyệt.
- Chỉ các ID được duyệt mới được đi tiếp bước sau.

## Bước 3: Image Generation

- Sử dụng tool `generate_image` với prompt mô tả chi tiết.
- Style mặc định: **"Funny hand-drawn sketch style, bựa style, white background"**.

## Bước 4: Visual Verification

- Show hình ảnh đã gen cho User xem.
- Kiểm tra tính thẩm mỹ và độ khớp với kịch bản.

// turbo

## Bước 5: Bulk Commit & Build

- Sử dụng CLI chính của dự án để đóng gói Base64 vào database.
- Lệnh: `node bin/aztomiq.js meme:commit --title="[Nội dung]" --image="[Path]" --tags="[Tag1,Tag2]"`

---

**LƯU Ý:**

- Tuyệt đối không tạo file script lẻ (`add-meme-*.js`).
- Không dùng ảnh placeholder nếu server 429, hãy đợi hoặc thử lại sau.
- Luôn chạy `aztomiq build` sau khi commit để cập nhật frontend.
