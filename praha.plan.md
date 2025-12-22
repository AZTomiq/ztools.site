# Praha.dev — The Living Practice Handbook (Master Plan)

## 1. Vision & Philosophy
*   **Identity**: A "Practice-First" Handbook for Career Growth.
*   **Slogan**: *"Practice first. Master later."*
*   **Core Philosophy**:
    *   **Micro-Mastery**: Knowledge is broken down into atomic "Practice Cards" (Theory + Code + Challenge).
    *   **SQL-First (MVP)**: Focus on the high-demand, high-practice skill of Data Manipulation.
    *   **Real-World Context**: No "Foo Bar". We solve "Production Incidents", "Log Analysis", and "Performance Turning".
    *   **Doing > Reading**: Instant execution in browser.

## 2. Product Model: The "Practice Card"
Standardized format (Schema v1.0) optimized for Logic & SEO:
1.  **The Hook (SSR)**: < 600 words. Key insight rendered as static HTML.
2.  **The Sandbox (Client)**: PGLite (Postgres WASM) via SharedWorker.
3.  **The Drill (Interactive)**:
    *   **Auto-Save Interceptor**: Every keystroke saved to `localStorage`. Never lose progress.
    *   **Mobile Helper**: specialized "Quick SQL Keys" toolbar (`SELECT`, `WHERE`, `JOIN` buttons) for mobile users.

## 3. Structural Hierarchy
*   **Practice Card**: The atomic unit (`schema_version: "1.0"`).
*   **Series (Tracks)**:
    *   **Flagship MVP**: **"Production Incidents: SQL Edition"**.
        *   *Scenario 1*: "Find the user who deleted the table" (Log recovery).
        *   *Scenario 2*: "This query takes 5 seconds. Make it take 50ms" (Indexing).
        *   *Scenario 3*: "Generate a Monthly Revenue Report from messy raw data".
*   **Tiers**:
    *   **Verified**: Core Team content.
    *   **Community**: Experimental submissions (Future).

## 4. Phased Roadmap

### Phase 1: The "Production-Ready" MVP (Month 1-2)
*   **Goal**: Demonstrate immense value to a specific niche (Backend/Data Devs).
*   **Scope**: **SQL Only**.
*   **Content**: 1 Flagship Series (10 scenarios) + 20 "Field Manual" cards.
*   **Tech Stack**:
    *   **FE**: Next.js + Tailwind.
    *   **Engine**: PGLite (Postgres WASM).
    *   **UX Criticals**:
        *   **SharedWorker**: Non-blocking UI thread.
        *   **WASM Caching**: Download once, run forever.
        *   **State Persistence**: Restore editor content on reload.
        *   **Mobile Experience**: Quick Input Bar + Read-Optimized Layout.

### Phase 2: Community Opening (Month 3-4)
*   **Goal**: Scale content with quality control.
*   **Features**:
    *   **Versioning System**: Content schema supports v1, v2 migration.
    *   Submission Form (JSON) with validator.
    *   Review Dashboard.

### Phase 3: The Ecosystem (Month 5+)
*   **Goal**: Retention & Revenue.
*   **Features**:
    *   **Certification**: Server-side validated "Final Exams" for verified badges.
    *   **Multi-Language**: Expansion to JS/Typescript (WebContainer).
    *   **Pro Accounts**: Cross-device sync, Team/Company training tracks.

## 5. Technical Architecture & Schemas

### Content Schema Example (v1.0)
```json
{
  "schema_version": "1.0",
  "id": "sql-indexing-basics",
  "title": "Why is my query slow? Intro to B-Tree",
  "type": "sql",
  "content": {
    "theory_mdx": "...", 
    "seed_sql": "CREATE TABLE users...; INSERT INTO users...",
    "solution_sql": "CREATE INDEX idx_email ON users(email);",
    "validation_query": "EXPLAIN ANALYZE SELECT * FROM users WHERE..."
  },
  "meta": {
    "difficulty": "medium",
    "tags": ["performance", "indexing"]
  }
}
```

### Risk Mitigation Strategy
1.  **Performance**: Strict performance budget. First Contentful Paint < 1s. Interactive < 3s (Cold), < 0.5s (Warm).
2.  **Quality**: No "Hello World" content. All content must solve a specific problem.
3.  **Cheating**: Client-side checks for practice (fast feedback), Server-side checks for exams (integrity).