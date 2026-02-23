
# 🎯 The Andb Executive Roadmap (2026)

**Mission:** Transform `The Andb` from a personal tool into a commercial-grade database management product.

**Current Status:** Phase 6.5 (Polish & Pro Features) — SSH Integration Complete

---

## 📊 Strategic Timeline

| Phase         | Focus Area             | Key Deliverables                             | Timeline     | Status         |
| :------------ | :--------------------- | :------------------------------------------- | :----------- | :------------- |
| **Phase 0**   | **Decoupling**         | CoreBridge, NestJS DI, String Tokens         | Jan 2026     | ✅ Complete    |
| **Phase 1-4** | **Foundation**         | MySQL Driver, Comparison Engine, CLI         | Jan 2026     | ✅ Complete    |
| **Phase 5**   | **Monorepo**           | Electron Build, License, Legacy Archive      | Feb 2026     | ✅ Complete    |
| **Phase 6**   | **Secure Connections** | Restricted User Setup (SCA), Trust UI        | Feb 2026     | ✅ Complete    |
| **Phase 6.5** | **SSH & Polish**       | Native SSH Tunneling, Distribution Prep      | Feb 2026     | 🚧 In Progress |
| **Phase 7**   | **Enterprise**         | PostgreSQL, Resilient Execution, AST Parsing | Feb-Mar 2026 | ⏳ Planned     |
| **Phase 8**   | **Commercialization**  | Pro License, Team Tools, Cloud Auth          | Mar 2026+    | ⏳ Planned     |

---

## 📦 Package Structure

| Package          | Role                           | Tech Stack                 |
| ---------------- | ------------------------------ | -------------------------- |
| `@the-andb/core` | Pure business logic, stateless | NestJS, TypeScript, mysql2 |
| `@the-andb/ui`   | Electron + Vue 3 desktop       | Vue 3, Pinia, Tailwind     |
| `@the-andb/cli`  | Terminal interface             | nest-commander             |
| `andb-www`       | Landing page & docs            | Astro/Static               |

**Core Principle:** All logic in `core`. UI/CLI are adapters only.

---

## 🏆 Phase 6.5 Deliverables (Current)

### ✅ Completed

- **SSH Tunneling**: Native `ssh2` integration in Core (`ssh-tunnel.ts`)
- **MysqlDriver**: Auto-detect `sshConfig` and establish tunnel before connect
- **OrchestrationService**: Map UI ssh object → Core ISshConfig

### 🎯 Remaining

- **Distribution**: macOS v3.1.0 build with code signing
- **Connection Templates**: SSH fields in global template manager
- **Error Handling**: SSH-specific error messages

---

## 🗺️ Phase 7: Enterprise Features (Feb-Mar 2026)

| Feature                 | Priority | Description                                          |
| ----------------------- | -------- | ---------------------------------------------------- |
| **PostgreSQL Driver**   | High     | Implement `IDriver` for Postgres with schema support |
| **Resilient Execution** | High     | Retry policies, Connection pooling                   |
| **AST Parsing**         | Medium   | Semantic comparison (ignore whitespace, aliases)     |
| **Topological Sort**    | Medium   | DDL dependency graph for safe migration order        |
| **Pre-flight Checks**   | Medium   | Replication lag, active queries, disk space          |

---

## 💰 Phase 8: Commercial Strategy (Mar 2026+)

### Open Core Model

- **Community Edition (Free):** Core engine, MySQL/PostgreSQL, CLI, Basic UI
- **Pro Edition (Paid):** SSH Tunneling\*, Safe Mode, Team Collaboration, Priority Support

\*Note: SSH is currently in Community but may move to Pro tier

### Pro Features Pipeline

| Feature           | Description                             |
| ----------------- | --------------------------------------- |
| Transaction Guard | Auto-commit OFF, explicit confirmation  |
| Team Sync         | Shared projects, audit logs             |
| Cloud Auth        | AWS RDS IAM, GCP Cloud SQL integration  |
| Data Masking      | Sanitize prod data for dev environments |

---

## 📊 Feature Parity Status

| Area             | Legacy           | Next-Gen            | Status     |
| ---------------- | ---------------- | ------------------- | ---------- |
| Architecture     | Monolithic JS    | Modular NestJS (DI) | ✅ Done    |
| MySQL Driver     | mysql2           | mysql2 + SSH        | ✅ Done    |
| Dump Driver      | N/A              | FileStorage-based   | ✅ Done    |
| SSH Tunneling    | Separate utility | Driver-integrated   | ✅ Done    |
| Tables Compare   | Text Diff        | Semantic Diff       | ✅ Done    |
| Views/Routines   | Text Diff        | Normalized Diff     | ✅ Done    |
| Migration        | String Concat    | MigratorService     | ✅ Done    |
| PostgreSQL       | Experimental     | Dedicated Driver    | ⏳ Planned |
| Transaction Safe | N/A              | Virtual Dry Run     | ⏳ Planned |

---

## 📅 History

| Date   | Event                                                       |
| ------ | ----------------------------------------------------------- |
| Feb 05 | SSH Tunneling migrated to Core (ssh-tunnel.ts, MysqlDriver) |
| Feb 03 | Restricted User Setup (SCA) flow completed                  |
| Feb 02 | Monorepo unified, License updated to Proprietary            |
| Jan 29 | CoreBridge pattern, NestJS DI stabilized                    |
| Jan 27 | CLI ported to nest-commander                                |

---

_Verified by Engineering Team: Feb 2026_

BIG PLAN: ĐẬP HEO LÌ XÌ TẾT (BỰA EDITION)
1. TỔNG QUAN----------------Đây là game mini-event Tết với cơ chế đơn giản: mỗi người chơi có 1–3 lượt đập heo để nhận lì xì.Mục tiêu: tạo trải nghiệm vui, nhanh, hài hước, mang không khí Tết và có yếu tố bất ngờ.2. FLOW TRẢI NGHIỆM NGƯỜI CHƠI----------------Bước 1: Setup- Người chơi chọn số lượt: 1, 2 hoặc 3.- Xem danh sách mệnh giá lì xì: 10k, 20k, 50k, 100k, 200k, 500k.- Bấm nút "Bắt đầu".Bước 2: Màn hình Grid Heo- Hiển thị lưới 3x3 gồm 9 con heo giống nhau.- Mỗi con chỉ khác nhau màu nền nhẹ (hồng, vàng, xanh, tím).- Người chơi chọn 1 con để đập.Bước 3: Đập heo- Có animation búa đập, hiệu ứng vỡ, confetti và tiếng "bốp".Bước 4: Reveal kết quả- Hiện loại heo: Thường / Vàng / Kim Cương.- Hiện 1 câu chúc Tết bựa ngẫu nhiên.- Kích hoạt 1 thử thách nhanh ngẫu nhiên (hát, múa, làm toán, đọc cửu chương).- Cuối cùng hiển thị số tiền lì xì nhận được.Bước 5: Quay lại Grid- Nếu còn lượt, người chơi tiếp tục đập con khác.- Nếu hết lượt, chuyển sang màn tổng kết.3. HỆ THỐNG HEO----------------Heo Thường (70%):- Dễ đập, lì xì nhỏ (10k, 20k, 50k).Heo Vàng (25%):- Lì xì trung bình (50k, 100k, 200k).Heo Kim Cương (5%):- Lì xì lớn (200k, 500k).4. QUOTA & LÌ XÌ----------------Admin thiết lập:- Danh sách mệnh giá.- Quota từng mệnh giá.- Tổng ngân sách tối đa.Hệ thống sẽ:- Tạo sẵn pool lì xì dựa trên quota.- Xáo trộn ngẫu nhiên.- Mỗi lượt đập lấy 1 bao từ pool.5. THỬ THÁCH NHANH----------------- Hát 1 câu bài Tết.- Múa 5 giây.- Làm toán nhanh (ví dụ: 3+5=?).- Đọc cửu chương đơn giản.=> Hoàn thành có thể nhận bonus nhỏ, nhưng không phạt nếu bỏ qua.6. TỔNG KẾT----------------Hiển thị:- Số lượt đã chơi.- Tổng tiền lì xì nhận được.- Badge vui (ví dụ: Đại Gia Lì Xì, Tay Đập Vàng).

Thought for 11s

Refining Smash Engine - Bựa Edition Planning
I have updated the
implementation_plan.md
to integrate the "Bựa Edition" requirements (3x3 grid, prize pool, Tet humor, etc.). I am now updating the
task.md
to align with this new roadmap and will then request user review.

Files Edited
Task
Implementation Plan
Progress Updates
1
Updating Implementation Plan for Tet-themed Smash Game

2
Updating task.md with Bựa Edition milestones and requesting user review

Tao đã cập nhật Plan cho bản Đập Heo Lì Xì Tết (Bựa Edition) dựa trên yêu cầu mới của mày:

Cơ chế Grid 3x3: Người chơi sẽ chọn 1 trong 9 con heo trên lưới.
Hệ thống Quota (Admin): Admin có thể thiết lập số lượng bao lì xì cho từng mệnh giá (10k, 20k... 500k). Hệ thống sẽ rút ngẫu nhiên từ Pool này.
Yếu tố "Bựa": Animation đập heo kèm theo các Câu chúc Tết bựa và Thử thách nhanh (hát, múa, làm toán...) ngẫu nhiên.
Decoupling xong: Tao đã hoàn thành việc tách Layout Admin (3 cột chuẩn) và Smart Routing. Bây giờ chỉ cần tập trung làm gameplay "Bựa Edition" này là xong.
