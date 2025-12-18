

# Kế hoạch Phát triển ZTools - Your Digital Toolbox, Simplified

## 🎯 Triết lý & Mục tiêu (Core Philosophy)

*   **Vision**: "Your Digital Toolbox, Simplified" - Bộ công cụ số hoàn chỉnh nhất cho người Việt
*   **Mục tiêu**: Xây dựng bộ công cụ **Best-in-class**, tối ưu SEO và UX/UI (Web Vitals xanh lè)
*   **Chiến lược**: **Build-time Assembly** (Ghép HTML lúc build) để đảm bảo SEO & Performance
*   **Core Values**:
    *   **Minimal Cost**: Vận hành 0đ
    *   **Privacy First**: Xử lý 100% Client-side
    *   **Polish UI**: Giao diện sạch, đẹp, không quảng cáo rác
    *   **Comprehensive**: Đầy đủ công cụ từ A-Z

## 🏗️ Kiến trúc Kỹ thuật (Technical Architecture)

*   **Mô hình**: Custom SSG (Static Site Generator) siêu nhẹ
*   **Tech Stack**: Node.js Script + EJS Template + Vanilla JS/CSS3
*   **Cấu trúc thư mục**:
    ```text
    /src
    ├── /includes      # Components (Header, Footer, Head)
    ├── /pages         # Nội dung từng trang (index.ejs)
    ├── /assets        # JS, CSS, Images
    └── /locales       # i18n (vi.json, en.json)
    ```
*   **Build Process**: `npm run build` → Ghép template → Output `/dist` (HTML tĩnh)

## 🌐 Chiến lược Domain & SEO

*   **Domain**: 1 Domain chính (Authority Brand)
*   **URL Structure**: Clean URLs `/vi/tool-slug/` và `/en/tool-slug/`
*   **SEO**: Auto-gen Sitemap, Canonical tags, Structured Data (JSON-LD)
*   **Default Language**: Vietnamese (vi) - Phục vụ thị trường Việt Nam

---

## 📋 Roadmap Công cụ - 300+ Tools

### 💼 Group 1: Tiền / Thuế / Lương (Job & Income) - 10 tools
*Phục vụ người đi làm, nhân sự, kế toán*

- [x] **Tính thuế TNCN 2025/2026**
    - [x] Tính xuôi (Gross → Net) & Tính ngược (Net → Gross)
    - [x] So sánh Luật 2025 vs Nghị quyết 110/2025
    - [x] Biểu đồ dòng tiền & So sánh lương
- [x] **Tính thuế TNDN** (Thu nhập doanh nghiệp)
- [x] **Tính BHXH & Hưu trí**
    - [x] BHXH bắt buộc vs Tự nguyện
    - [x] Dự tính lương hưu / BHXH 1 lần
- [ ] **Tiện ích Lương thưởng**
    - [ ] Tính tiền tăng ca (OT)
    - [ ] Tính KPI, Thưởng Tết, Lương tháng 13
- [ ] **Tip Calculator** (Tính tiền boa)
- [ ] **Discount Calculator** (Tính giảm giá)
- [ ] **Salary Calculator** (Tính lương)

### 💰 Group 2: Tài chính & Ngân hàng (Finance) - 15 tools
*Evergreen traffic - Luôn có nhu cầu tìm kiếm*

- [x] **Tính lãi vay (Loan Calculator)**
    - [x] Dư nợ giảm dần vs Dư nợ ban đầu
    - [x] Lịch trả nợ chi tiết
- [ ] **Mortgage Calculator** (Tính vay mua nhà)
- [x] **Compound Interest Calculator** (Lãi kép)
- [x] **Lãi suất tiết kiệm**
- [ ] **Currency Converter** (Chuyển đổi tiền tệ)
- [x] **Percentage Calculator** (Tính phần trăm)
- [ ] **Statistics Calculator** (Thống kê)
- [ ] **Fraction Calculator** (Phân số)
- [ ] **Expression Evaluator** (Tính biểu thức)
- [ ] **GCD/LCM Calculator** (Ước chung/Bội chung)
- [ ] **Pythagorean Calculator**
- [ ] **Prime Number Checker**
- [ ] **Fibonacci Generator**
- [ ] **Credit Card Validator**

### 🏥 Group 3: Sức khỏe & Đời sống (Health & Lifestyle) - 9 tools

- [x] **BMI Calculator** (Chuẩn IDI/WPRO cho người Việt)
- [x] **Lunar Calendar Converter** (Xem âm lịch)
    - [x] Hiển thị âm lịch hôm nay
    - [x] Chọn ngày để convert Dương lịch ↔ Âm lịch
    - [x] Hiển thị Can Chi, Giờ Hoàng Đạo
    - [x] Xem ngày tốt xấu (Tốt/Xấu cho việc gì)
- [ ] **Age Calculator** (Tính tuổi)
- [ ] **Date Calculator** (Tính ngày)
- [ ] **Date Difference Calculator**
- [ ] **Countdown Timer**
- [ ] **Stopwatch**
- [ ] **Pomodoro Timer**
- [ ] **Timezone Converter**

### 📝 Group 4: Text Tools - 36 tools
*Công cụ xử lý văn bản đa dạng*

- [x] **Word Counter** (Đếm từ)
- [ ] **Character Counter** (Đếm ký tự)
- [ ] **Sentence Counter** (Đếm câu)
- [ ] **Line Counter** (Đếm dòng)
- [x] **Text Case Converter** (Chuyển đổi chữ hoa/thường)
- [x] **Text Formatter - Clear Style** (Xóa định dạng, normalize text)
    - [x] Remove extra spaces
    - [x] Normalize line breaks
    - [x] Trim lines
    - [x] Normalize quotes & symbols
    - [x] Case transformation
    - [x] Modern 2-column UI with gradients
- [x] **Lorem Ipsum Generator**
- [ ] **Text Diff Checker** (So sánh văn bản)
- [ ] **Find & Replace** (Tìm & thay thế)
- [ ] **Duplicate Line Remover**
- [ ] **Text to Image**
- [ ] **Add Prefix to Lines**
- [ ] **Join Strings** (Nối chuỗi)
- [ ] **Split String** (Tách chuỗi)
- [ ] **Repeat String** (Lặp chuỗi)
- [ ] **Pick Random Item**
- [ ] **Text to Unicode Font**
- [ ] **Text to Speech**
- [ ] **Reading Time Estimator**
- [ ] **Bionic Reading Converter**
- [ ] **Text to Handwriting**
- [ ] **Text Reverser** (Đảo ngược)
- [ ] **Text Sorter** (Sắp xếp)
- [ ] **Text Trimmer** (Cắt khoảng trắng)
- [ ] **ASCII Art Generator**
- [ ] **Letter Frequency Counter**
- [ ] **Word Frequency Counter**
- [ ] **Random Text Generator**
- [ ] **Shuffle Letters/Words/Lines**
- [ ] **Spoof Unicode Text**
- [ ] **Remove Unicode Font**
- [ ] **Zalgo Text Generator**
- [ ] **Palindrome Checker**
- [ ] **Text Truncator**
- [ ] **Multiple Whitespace Remover**
- [ ] **Đọc số thành chữ** (Numbers to Vietnamese Words)
- [ ] **Chữ thành số** (Vietnamese Words to Numbers)

### 🔄 Group 5: Conversion Tools - 33 tools
*Chuyển đổi đơn vị & định dạng*

- [ ] **Base64 Encoder/Decoder**
- [ ] **URL Encoder/Decoder**
- [ ] **Unit Converter** (Đơn vị đo lường)
- [ ] **HTML Entities Encoder**
- [ ] **RGB/Hex Converter**
- [ ] **JSON to YAML Converter**
- [ ] **Markdown to HTML**
- [ ] **Unix Timestamp Converter**
- [ ] **Number Base Converter**
- [ ] **CSV to JSON Converter**
- [ ] **Convert Hex to Text**
- [ ] **Advanced Color Converter**
- [ ] **Speed Converter**
- [ ] **Data Storage Converter**
- [ ] **Length Converter**
- [ ] **Weight Converter**
- [ ] **Temperature Converter**
- [ ] **Time Unit Converter**
- [ ] **Convert IP to Hex**
- [ ] **Binary to Negabinary**
- [ ] **Convert Dog Age**
- [ ] **Convert ASCII Art to Image**
- [ ] **Convert ASCII to Decimal**
- [ ] **Convert Decimal to ASCII**
- [ ] **Convert Bytes to ASCII**
- [ ] **Octal Converter**
- [ ] **IP Address Converter**
- [ ] **Roman Numerals Converter**
- [ ] **Binary to Text Converter**
- [ ] **Unicode to UTF-8 Converter**
- [ ] **UTF-8 to Hex Converter**
- [ ] **Hex to UTF-8 Converter**
- [ ] **UTF-8 to Binary Converter**

### 🔐 Group 6: Encoding/Decoding & Security - 25 tools
*Mã hóa, giải mã và bảo mật*

- [ ] **JWT Decoder/Encoder**
- [ ] **QR Code Generator**
- [ ] **Hash Generator** (MD5, SHA-1, SHA-256)
- [ ] **Morse Code Translator**
- [ ] **Barcode Generator**
- [ ] **Advanced Barcode Generator**
- [ ] **HTML Encoder/Decoder**
- [ ] **String Encoder**
- [ ] **String Escaper**
- [ ] **ROT13 Cipher**
- [ ] **Caesar Cipher**
- [ ] **Atbash Cipher**
- [ ] **Vigenère Cipher**
- [ ] **Punycode Converter**
- [ ] **XML Encoder/Decoder**
- [ ] **SQL Encoder/Decoder**
- [ ] **UTF-8 Validator**
- [ ] **Base32 Encoder/Decoder**
- [x] **Password Generator**
- [ ] **Password Strength Checker**
- [ ] **AES Encryption/Decryption**
- [ ] **MAC Address Generator**
- [ ] **Credit Card Test Number Generator**

### 📊 Group 7: Data Processing & JSON Tools - 39 tools
*Xử lý dữ liệu và JSON*

- [x] JSON Formatter (Unified with Tree View)
- [x] JSON Validator (Supports Relaxed JSON)
- [x] JSON to Types (TypeScript, Go, Java)
- [x] JSON Tree Viewer (Integrated)
- [x] JSON Path Finder
- [x] JSON Minifier
- [x] JS Object to JSON (Relaxed JSON Parser)
- [ ] Obfuscate JSON
- [x] Analyze JSON
- [x] SQL to JSON (Basic INSERT Parser)
- [x] CSV to JSON
**
- [ ] **CSV Viewer**
- [ ] **Sort CSV Data**
- [ ] **Change CSV Delimiter**
- [ ] **Convert CSV to Text Columns**
- [ ] **XML Formatter**
- [ ] **XML Validator**
- [ ] **XML Minifier**
- [ ] **SQL Formatter**
- [ ] **List Sorter**
- [ ] **List Deduplicator**
- [ ] **List Shuffler**
- [ ] **List Randomizer**
- [ ] **Grep Tool**
- [ ] **Diff Checker**
- [ ] **Diff Merger**
- [ ] **Array Operations**
- [ ] **Column Extractor**
- [ ] **Find List Length**
- [ ] **Find Unique List Items**
- [ ] **Find Duplicate List Items**
- [ ] **Convert Hex to Image**
- [ ] **Reverse Hex Digits**
- [ ] **Count Binary Ones/Zeros**
- [ ] **Invert Binary Bits**
- [ ] **Shuffle Binary Bits**
- [ ] **HTML Entity Counter**
- [ ] **YAML Validator**

### ⚙️ Group 8: Generator Tools - 49 tools
*Tạo mã, dữ liệu và thiết kế*

- [x] **UUID Generator**
- [ ] **Random Number Generator**
- [ ] **Random String Generator**
- [ ] **Random Color Generator**
- [ ] **Fake Data Generator**
- [ ] **Dummy Data Generator**
- [ ] **Mock API Data Generator**
- [ ] **CSS Gradient Generator**
- [ ] **CSS Box Shadow Generator**
- [ ] **Gradient Generator**
- [ ] **Color Palette Generator**
- [ ] **Regex Builder & Tester**
- [ ] **Cron Expression Builder**
- [ ] **CSS Loader Generator**
- [ ] **CSS Glassmorphism Generator**
- [ ] **CSS Cubic Bezier Generator**
- [ ] **CSS Clip Path Generator**
- [ ] **CSS Background Pattern Generator**
- [ ] **Invoice Generator**
- [ ] **URL Slug Generator**
- [ ] **Meta Tag Generator**
- [ ] **Open Graph Generator**
- [ ] **Twitter Card Generator**
- [ ] **Hashtag Generator**
- [ ] **Table Generator**
- [ ] **Box Shadow Designer**
- [ ] **Border Radius Designer**
- [ ] **String Generator**
- [ ] **Number Sequence Generator**
- [ ] **Hilbert Curve Generator**
- [ ] **Fractal Tree Generator**
- [ ] **Dendrite Fractal Generator**
- [ ] **Pythagoras Tree Generator**
- [ ] **Sierpinski Triangle Generator**
- [ ] **CSS Checkbox Generator**
- [ ] **CSS Switch Generator**
- [ ] **CSS Text Glitch Generator**
- [ ] **CSS Triangle Generator**
- [ ] **CSS Border Radius Generator**
- [ ] **Bio Generator**
- [ ] **Robots.txt Generator**
- [ ] **.htaccess Generator**
- [ ] **Sitemap Generator**
- [ ] **Schema Markup Generator**
- [ ] **Pascal's Triangle**
- [ ] **Generate Pi Digits**
- [ ] **Look and Say Sequence**
- [ ] **Generate Random Matrix**

### 🖼️ Group 9: Image Tools - 43 tools
*Xử lý ảnh client-side*

- [ ] **Image to Base64**
- [ ] **Base64 to Image**
- [ ] **Image Resizer**
- [ ] **Image Compressor**
- [ ] **Image Cropper**
- [ ] **Image Rotate & Flip**
- [ ] **Favicon Generator**
- [ ] **Blur Image**
- [ ] **Pixelate Image**
- [ ] **Image Filters & Effects**
- [ ] **Color Picker**
- [ ] **Transparent PNG Maker**
- [ ] **Change PNG Colors**
- [ ] **Rotate PNG**
- [ ] **PNG to WebP Converter**
- [ ] **WebP to PNG Converter**
- [ ] **JPG Quality Changer**
- [ ] **Grayscale JPG**
- [ ] **Transparent JPG**
- [ ] **Add Border to JPG**
- [ ] **Pixelate JPG**
- [ ] **Change GIF Speed**
- [ ] **Extract GIF Frames**
- [ ] **Remove GIF Background**
- [ ] **Add Text to GIF**
- [ ] **Reverse GIF**
- [ ] **Transparent WebP**
- [ ] **Replace WebP Colors**
- [ ] **Remove WebP Background**
- [ ] **Pixelate WebP**
- [ ] **Crop WebP**
- [ ] **Sharpen Image**
- [ ] **Instagram Post Generator**
- [ ] **Tweet Generator**
- [ ] **Tweet to Image**
- [ ] **Social Media Image Resizer**
- [ ] **Image Watermark**
- [ ] **Image Border Tool**
- [ ] **SVG Optimizer**
- [ ] **SVG to PNG Converter**
- [ ] **Ghép ảnh online**

### 🔢 Group 10: Number & Math Tools - 32 tools
*Công cụ toán học và số học*

- [ ] **Calculator** (Máy tính)
- [ ] **Scientific Calculator**
- [ ] **Words to Numbers**
- [ ] **Numbers to Words**
- [ ] **Calculate Number Sum**
- [ ] **Sort Numbers**
- [ ] **Add Commas to Integers**
- [ ] **Number Formatter**
- [ ] **Enumerate Integers**
- [ ] **Generate Integer Pairs**
- [ ] **Increment Integer Digits**
- [ ] **Reverse Integer Digits**
- [ ] **Visualize L-System**

### 🛠️ Group 11: Utility & Developer Tools - 29 tools
*Công cụ tiện ích cho developer*

- [ ] **Code Beautifier**
- [ ] **Code Minifier**
- [ ] **Code to Image**
- [ ] **Color Contrast Checker**
- [ ] **Regex Tester**
- [ ] **User Agent Parser**
- [ ] **IP Lookup**
- [ ] **Timer & Stopwatch**
- [ ] **Advanced Color Picker**
- [ ] **Email Validator**
- [ ] **Phone Number Validator**
- [ ] **URL Validator**
- [ ] **Emoji Picker**
- [ ] **Device Info**
- [ ] **Draw Memento Mori Calendar**
- [ ] **Draw Digital Clock**
- [ ] **Subnet Calculator**
- [ ] **Dice Roller**
- [ ] **Coin Flipper**
- [ ] **CURL to Code** (Fetch/Axios/Python)
- [ ] **ObjectId Generator**
- [ ] **Cron Expression Tester**

### 📄 Group 12: PDF Tools - 14 tools
*Xử lý PDF (cần xem xét serverless hoặc WASM)*

- [ ] **Merge PDF**
- [ ] **Split PDF**
- [ ] **PDF to Image**
- [ ] **Image to PDF**
- [ ] **Rotate PDF**
- [ ] **Extract PDF Pages**
- [ ] **Delete PDF Pages**
- [ ] **Protect PDF**
- [ ] **Unlock PDF**
- [ ] **Watermark PDF**
- [ ] **Organize PDF**
- [ ] **Sign PDF**
- [ ] **PDF Reader**
- [ ] **Flatten PDF**
- [ ] **PDF to Word** (Client-side/Serverless)

---

## 📊 Tổng kết Roadmap

| Category            | Tools Count   | Status           |
| ------------------- | ------------- | ---------------- |
| Job & Income        | 10            | 3/10 ✅           |
| Finance             | 15            | 5/15 ✅           |
| Health & Lifestyle  | 9             | 2/9 ✅            |
| Text Tools          | 36            | 4/36 ✅           |
| Conversion Tools    | 33            | 0/33             |
| Encoding/Security   | 25            | 1/25 ✅           |
| Data Processing     | 39            | 11/39 ✅          |
| Generators          | 49            | 2/49 ✅           |
| Image Tools         | 43            | 0/43             |
| Number & Math       | 32            | 0/32             |
| Utility & Dev Tools | 29            | 0/29             |
| PDF Tools           | 14            | 0/14             |
| **TOTAL**           | **334 tools** | **28/334 (8.4%)** |

---

## 🎯 Chiến lược Triển khai (Implementation Strategy)

### Phase 1: Foundation (Hoàn thành ✅)
- [x] Setup build system
- [x] Create layout & components
- [x] Implement i18n (vi/en)
- [x] Deploy first 3 tools (Tax, BMI, JSON, Loan)

### Phase 2: Quick Wins (Ưu tiên cao - 3 tháng)
*Tập trung vào các tool có traffic cao và dễ làm*

**Priority 1 - Text Tools** (20 tools)
- Word Counter, Character Counter, Case Converter
- Find & Replace, Text Diff
- Lorem Ipsum, Random Text Generator

**Priority 2 - Conversion Tools** (15 tools)
- Base64, URL Encoder/Decoder
- Unit Converters (Length, Weight, Temperature)
- Timestamp, Color Converters

**Priority 3 - Generators** (10 tools)
- UUID, Password Generator
- QR Code, Barcode
- Random Number/String

**🔥 HIGH PRIORITY - UX Enhancements** (Sau khi hoàn thành Lunar Calendar)
*Cải thiện trải nghiệm người dùng*

1. **Search Feature** 
   - [ ] Tìm kiếm tools từ menu/header
   - [ ] Auto-complete suggestions
   - [ ] Keyboard shortcuts (Ctrl/Cmd + K)
   - [ ] Search by category, name, description
   - [ ] Recent searches history

2. **Bookmark Creator**
   - [ ] Cho phép user chọn tools theo checklist
   - [ ] Tạo bookmark folder structure: zTools > Category > Tool
   - [ ] Export bookmarks as HTML file
   - [ ] One-click import to browser
   - [ ] Save user preferences (localStorage)
   - [ ] Share bookmark collection via URL

### Phase 3: Developer Tools (3-6 tháng)
*Công cụ cho developer - traffic chất lượng cao*

- JWT Decoder, Hash Generator
- Regex Tester, SQL Formatter
- Code Beautifier/Minifier
- Cron Expression Builder

### Phase 4: Advanced Tools (6-12 tháng)
*Công cụ phức tạp hơn, cần WASM hoặc serverless*

- Image Processing (resize, compress, filters)
- PDF Tools (merge, split, convert)
- Advanced Math Tools
- Data Visualization

### Phase 5: Content & SEO (Liên tục)
*Tối ưu nội dung và SEO*

1. **Tool Content Enrichment**:
    - [ ] Mô tả (Description)
    - [ ] Hướng dẫn sử dụng (How-to)
    - [ ] FAQ
    - [ ] Examples & Use cases

2. **Essential Pages**:
    - [ ] Privacy Policy
    - [ ] Terms of Service
    - [ ] About / Contact
    - [ ] Blog (Hướng dẫn sử dụng tools)

---

## 🎨 UI/UX Guidelines

### Design Principles
1. **Simplicity First**: Giao diện đơn giản, dễ hiểu
2. **Mobile-First**: Tối ưu cho mobile trước
3. **Fast & Responsive**: Load nhanh, không lag
4. **Consistent**: Nhất quán về màu sắc, typography, spacing
5. **Accessible**: Hỗ trợ keyboard, screen reader

### Component Library
- Form inputs với validation
- Buttons (primary, secondary, danger)
- Cards & containers
- Modals & tooltips
- Loading states
- Error states
- Success messages

---

## 🚀 Technical Considerations

### Performance Targets
- **Load Time**: < 0.5s (First Contentful Paint)
- **SEO Score**: 100/100 on PageSpeed Insights
- **Accessibility**: WCAG 2.1 AA compliant
- **Zero CLS**: Không nhảy layout

### Technology Choices

**For Image Processing:**
- Use WASM libraries (e.g., `@squoosh/lib`)
- Client-side only, no server upload

**For PDF Processing:**
- Consider `pdf-lib` (client-side)
- Or serverless functions (Vercel/Netlify)

**For Complex Calculations:**
- Use Web Workers for heavy computations
- Keep UI responsive

### Code Organization
```
/src/pages/[category]/[tool-name]/
├── index.ejs          # Page template
├── [tool-name].css    # Tool-specific styles
└── [tool-name].js     # Tool logic
```

---

## 📈 Success Metrics

### Traffic Goals
- **Month 1-3**: 1,000 users/month
- **Month 4-6**: 10,000 users/month
- **Month 7-12**: 50,000+ users/month

### Quality Metrics
- **Bounce Rate**: < 40%
- **Avg. Session Duration**: > 2 minutes
- **Pages per Session**: > 2.5
- **Return Visitor Rate**: > 30%

### SEO Goals
- Rank top 3 for Vietnamese keywords
- Featured snippets for key tools
- High-quality backlinks from tech blogs

---

## 💡 Monetization Strategy (Future)

1. **Google AdSense** (Primary)
   - Sau khi có 10,000+ users/month
   - Đặt quảng cáo không ảnh hưởng UX

2. **Affiliate Links** (Secondary)
   - Link đến sản phẩm liên quan (hosting, tools)
   - Amazon Associates

3. **Premium Features** (Optional)
   - API access
   - Batch processing
   - No ads version

---

## 🎯 Cam kết Chất lượng

- ✅ **Privacy First**: 100% client-side processing
- ✅ **No Tracking**: Chỉ dùng privacy-friendly analytics
- ✅ **Open Source**: Có thể mở nguồn một số tools
- ✅ **Free Forever**: Core tools luôn miễn phí
- ✅ **Made in Vietnam**: Phục vụ người Việt trước tiên

---

**Last Updated**: 2025-12-17  
**Current Status**: 🚀 Phase 2 (Quick Wins) In Progress  
**Recent Achievements**:
- ✅ **Full i18n Refactor**: Migrated to modular JSON resources for all tools.
- ✅ **New Generators**: Password Generator, UUID Generator.
- ✅ **Text Tools**: Lorem Ipsum, Word Counter, **Text Formatter with Modern UI**.
- ✅ **Job & Income**: Business Tax, Social Insurance.
- ✅ **Finance Tools**: Loan Calculator, Compound Interest, Savings Interest, Percentage Calculator.
- ✅ **Data Processing**: JSON Toolkit (11 tools unified).
- ✅ **Health & Lifestyle**: BMI Calculator, **Lunar Calendar Converter** 🌙.
- ✅ **SEO Enhancement**: Dynamic sitemap, schema markup, canonical tags.
- ✅ **UI/UX**: Text Formatter redesigned with 2-column layout, gradients, and smooth animations.
**Next Milestone**: Implement Search Feature & Bookmark Creator (High Priority UX Enhancements).