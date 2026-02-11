# 🧪 Unit Test Master Plan (Chuẩn chỉnh)

Để iZTools trở thành một nền tảng tin cậy, đặc biệt là các công cụ tính toán tài chính (Thuế, Lãi kép, Bảo hiểm), chúng ta cần một hệ thống Unit Test chuyên nghiệp.

## 1. Nguyên tắc cốt lõi (Core Principles)

- **Logic Separation (Tách biệt logic):** Tuyệt đối không viết code tính toán chung với code thao tác DOM.
  - `logic.js`: Chỉ chứa hàm thuần túy (Pure Functions), nhận vào tham số và trả về kết quả.
  - `script.js`: Chỉ chứa code lắng nghe event, đọc value từ input và hiển thị kết quả ra HTML.
- **Fast Execution:** Unit test cho logic phải chạy trên môi trường Node.js thuần (không cần JSDOM) để đạt tốc độ tối đa.
- **Data-Driven Testing:** Sử dụng bộ test cases (dataset) phong phú để kiểm tra các trường hợp biên (edge cases).

---

## 2. Cấu trúc thư mục tiêu chuẩn

Mỗi feature sẽ tuân thủ cấu trúc:

```text
src/features/[feature-name]/
├── logic.js          # Chứa các hàm tính toán (Export)
├── logic.test.js     # Unit test cho logic.js (Dùng Vitest)
├── script.js         # DOM interaction (Sử dụng logic.js)
├── index.ejs
└── ...
```

---

## 3. Lộ trình triển khai (Implementation Steps)

### Giai đoạn 1: Chuẩn hóa Hạ tầng (Infrastructure)

- [x] **Setup Vitest Configuration:** Cấu hình Vitest để tự động nhận diện các file `.test.js` trong thư mục `src/features`.
- [x] **Coverage Tooling:** Cấu hình `v8` hoặc `istanbul` để xuất báo cáo coverage dạng HTML. (Dùng `vitest --coverage`)
- [x] **Base Helper Library:** Tạo các helper dùng chung cho test (ví dụ: `formatCurrency`, `approxEquals`).

### Giai đoạn 2: Refactor & Test các Tool "Trọng điểm"

Ưu tiên các tool có logic phức tạp:

- [x] **Tax Calculator (Thuế TNCN):** (Đã có logic.js) -> Nâng cấp bộ dataset test cho năm 2025/2026.
- [x] **Compound Interest (Lãi kép):** Tách `logic.js` từ `script.js` và viết test cases cho lãi nhập gốc hàng tháng/quý/năm.
- [x] **Loan Calculator (Vay vốn):** Tách logic tính dư nợ giảm dần và trả đều hàng tháng.
- [x] **Social Insurance (Bảo hiểm xã hội):** Kiểm tra các mức trần đóng bảo hiểm mới nhất.
- [x] **Savings Interest (Lãi tiết kiệm):** Đã tách logic và viết test.
- [x] **Percentage Calculator (Tính phần trăm):** Đã tách logic và viết test.
- [x] **Refactored All Logic Based Tools:** (Business Tax, OT, Inflation, Investment, Freelancer, Unit Converter, Word Counter).

### Giai đoạn 3: Automating & Quality Gate

- [ ] **Pre-commit Hook:** Sử dụng `husky` để đảm bảo test phải pass mới được commit.
- [x] **Build Integration:** Tích hợp `npm test` vào script build để ngăn chặn build lỗi logic. (Đã ép buộc test pass mới được deploy qua CLI).
- [x] **Regression Suite:** Xây dựng bộ test suite cho mọi tool quan trọng.

---

## 4. Ví dụ một Unit Test "Chuẩn chỉnh" (Vitest)

```javascript
import { describe, it, expect } from "vitest";
import { calculateInterest } from "./logic.js";

describe("Compound Interest Logic", () => {
  const testCases = [
    { principal: 100, rate: 10, time: 1, expected: 110 },
    { principal: 100, rate: 10, time: 2, expected: 121 },
  ];

  it.each(testCases)(
    "should return $expected when principal is $principal",
    ({ principal, rate, time, expected }) => {
      expect(calculateInterest(principal, rate, time)).toBe(expected);
    },
  );
});
```
