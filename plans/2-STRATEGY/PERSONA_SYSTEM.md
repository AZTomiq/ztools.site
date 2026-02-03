# 🎭 Persona-Driven Hub Strategy

**Status**: ACTIVE (Implementation Phase)
**Goal**: Transform ZTools from a static utility site into an **Adaptive Workspace** that learns from and caters to specific user types.

---

## 👥 Persona Archetypes

| Persona                | Key Tools                                 | Core Value                        |
| ---------------------- | ----------------------------------------- | --------------------------------- |
| **Developer (dev)**    | JSON, JWT, Unix, Base64, Dev Blog         | Privacy-first, Fast Dev Workflows |
| **Professional (pro)** | Tax (VN), Social Insurance, OT, Lunar Cal | Premium Office/Freelance Support  |
| **Investor (finance)** | Compound Interest, Savings, Loan          | Accurate Financial Planning       |
| **Creator (creator)**  | Word Counter, Case Converter, Lorem Ipsum | Content Production Utilities      |

---

## 🛠️ Implementation Specs

### 1. Metadata (tool.yaml)

Each tool must define which personas it belongs to:

```yaml
id: tax-calc
personas: ["pro", "finance"]
```

### 2. User State (LocalStorage)

- Key: `ztools_persona`
- Values: `dev`, `pro`, `finance`, `creator`, `none` (default)
- Logic: Persistent across sessions.

### 3. Smart Sorting (Adaptive UI)

- The Homepage Masonry grid will prioritize tools matching the current persona.
- Highlight "Persona Picks" using a special border or sparkle icon.

### 4. Zero-Cache Deployment (Cache Busting)

- Append `?v={{packageVersion}}&h={{contentHash}}` to every CSS/JS link.
- Update Service Worker to purge old caches on version change.

---

## 🚀 Roadmap

### Phase 1: Foundation (Today)

- [ ] Logic: Create `persona.js` to manage state.
- [ ] Metadata: Tag top 20 tools with personas.
- [ ] UI: Basic Persona Switcher in Header.
- [ ] Build: Implement version-based cache busting.

### Phase 2: Intelligence (Next Week)

- [ ] Behavioral Learning: Auto-switch persona based on usage patterns.
- [ ] Personalized Greetings: Welcome messages per persona.
- [ ] Smart Search: Prioritize results based on persona.

### Phase 3: Ecosystem (Future)

- [ ] Specific "Persona Dashboards" for landing pages.
- [ ] Persona-exclusive "Master Tools".
