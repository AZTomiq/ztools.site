# 🎯 Remaining Tasks Summary - Session 2025-12-19

**Created**: 2025-12-19 10:50  
**Status**: READY TO EXECUTE

---

## ✅ TASK 1: Test cron-parser và đánh dấu Phase 2 hoàn thành - **COMPLETED**

### Actions Taken:
- [x] Verified cron-parser has complete translations (in `locales/vi.yaml` and `locales/en.yaml`)
- [x] Checked built HTML output - all translations rendering correctly
- [x] Updated `plans/in-progress/phase-2.md` to mark Phase 2 as COMPLETE
- [x] Marked Cron Expression Parser as done

### Results:
- ✅ Phase 2 officially COMPLETE
- ✅ All Developer Utilities (Priority 1 of Phase 3) COMPLETE
- ✅ Ready to move to Phase 3 Priority 2 (Image & PDF Tools)

---

## ⏳ TASK 2: Setup testing infrastructure (Vitest + integrity checks)

### Plan:
1. **Install Vitest**
   ```bash
   npm install -D vitest @vitest/ui
   ```

2. **Create test structure**
   ```
   tests/
   ├── integrity.test.js      # Build & config validation
   ├── locales.test.js        # Translation completeness
   └── units/                 # Logic tests
       ├── tax.test.js
       ├── unit-converter.test.js
       └── loan.test.js
   ```

3. **Write integrity tests**
   - Check all `tool.yaml` files have required fields
   - Verify all translation keys exist
   - Scan dist/ for missing translations

4. **Extract testable logic**
   - Refactor `tax/script.js` → export functions
   - Refactor `unit-converter/script.js` → export functions
   - Write unit tests with sample data

5. **Add npm scripts**
   ```json
   {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage"
   }
   ```

### Estimated Time: 2-3 hours

---

## ⏳ TASK 3: Fix minor issues (navigation menu titles)

### Issues Found:
1. **Tool titles in mega menu show English on Vietnamese pages**
   - Example: Line 179 shows "Salary & Tax Master" instead of "Bộ Công Cụ Thuế & Lương Master"
   - Example: Line 386 shows "Date & Time Master" instead of "Bộ Công Cụ Ngày Giờ Master"

2. **devToolkit missing translations**
   - Line 449 shows raw key `devToolkit.title`

### Fix Plan:

#### Option A: Update tool.yaml to use titleKey properly
```yaml
# salary-tax-master/tool.yaml
id: salary-tax-master
titleKey: "salaryTaxMaster.title"  # Use this in navigation
description: "..."  # Keep for fallback
```

#### Option B: Update build.js to use titleKey in navigation
Modify the navigation rendering logic to:
1. Check if `titleKey` exists
2. Use `t(titleKey)` for navigation
3. Fall back to `description` if titleKey missing

### Estimated Time: 30-60 minutes

---

## ⏳ TASK 4: Bắt đầu Phase 3 - Image & PDF Tools

### Priority 2 - Image & PDF Tools (from phase-2.md):
- [ ] Image Compressor (Client-side)
- [ ] Image Resizer / Format Converter
- [ ] PDF Viewer & Basic Metadata Editor

### Recommended First Tool: **Image Compressor**

#### Why Image Compressor First?
1. **High demand** - Very useful tool
2. **Client-side only** - No backend needed
3. **Good libraries available**:
   - `browser-image-compression` (NPM)
   - Canvas API (native)
4. **SEO friendly** - "compress image online", "reduce image size"

#### Implementation Plan:

**1. Create tool structure**
```
src/features/image-compressor/
├── index.ejs
├── script.js
├── style.css
├── tool.yaml
└── locales/
    ├── vi.yaml
    └── en.yaml
```

**2. Features to implement**:
- Upload image (drag & drop + file picker)
- Adjust quality slider (0-100%)
- Preview before/after
- Show file size reduction
- Download compressed image
- Support formats: JPG, PNG, WebP

**3. Library to use**:
```html
<script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2/dist/browser-image-compression.js"></script>
```

**4. Key functionality**:
```javascript
async function compressImage(file, quality) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: quality / 100
  };
  
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}
```

### Estimated Time: 3-4 hours

---

## ⏳ TASK 5: Continue with remaining Image/PDF tools

### After Image Compressor:
1. **Image Resizer** (2-3 hours)
   - Resize by width/height
   - Maintain aspect ratio
   - Multiple output sizes

2. **Image Format Converter** (2 hours)
   - Convert between JPG, PNG, WebP, GIF
   - Use Canvas API

3. **PDF Viewer** (3-4 hours)
   - Use `pdf.js` library
   - View PDF in browser
   - Extract metadata

### Total Estimated Time for Phase 3 Priority 2: 10-13 hours

---

## 📊 Progress Summary

| Task | Status | Time Spent | Remaining |
|------|--------|------------|-----------|
| 1. Test cron-parser & mark Phase 2 done | ✅ DONE | 30 min | - |
| 2. Setup testing infrastructure | ⏳ TODO | - | 2-3 hours |
| 3. Fix minor navigation issues | ⏳ TODO | - | 30-60 min |
| 4. Start Phase 3 - Image Compressor | ⏳ TODO | - | 3-4 hours |
| 5. Continue Image/PDF tools | ⏳ TODO | - | 10-13 hours |

**Total Remaining**: ~16-20 hours of work

---

## 🎯 Recommended Next Steps

### Immediate (Today):
1. ✅ ~~Task 1~~ - DONE
2. **Task 2** - Setup testing (high priority for quality)
3. **Task 3** - Fix navigation (quick win)

### Tomorrow:
4. **Task 4** - Image Compressor (start Phase 3)

### This Week:
5. **Task 5** - Complete Image/PDF tools suite

---

## 📝 Notes

- **Token Usage**: This session used ~94k tokens
- **Browser Subagent**: Hit rate limit, using HTML verification instead
- **Phase 2**: Officially COMPLETE ✅
- **Phase 3**: Started (Developer Utilities done, moving to Image/PDF)

---

**Last Updated**: 2025-12-19 10:50  
**Next Session**: Continue with Task 2 (Testing Infrastructure)
