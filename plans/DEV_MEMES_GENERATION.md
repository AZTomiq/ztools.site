# DEV Memes Generation Pipeline (Standard 5-Step Process)

## 🎯 Objective

Create high-quality, relatable DEV memes for iZTools.site using a controlled multi-agent pipeline.

## 🤖 The 5-Step Workflow

### Step 1: Ideation (Agent 1)

- **Goal**: Generate 10-20 "niche" concepts based on "iZTools Studio Cast" (Tèo, Tý, Tủn, Tẹt, Sếp).
- **Output**: A list of ideas with Title and Visual Description.

### Step 2: Idea Review (User/Agent 3)

- **Goal**: Filter and approve the best ideas.
- **Manual Action**: User picks IDs (e.g., "Approved: 1, 4, 5").

### Step 3: Image Generation (Agent 2)

- **Goal**: Generate images for approved ideas using `generate_image`.
- **Constraint**: Use "Hand-drawn Sketch" style for consistency.

### Step 4: Visual Verification (User/Agent 3)

- **Goal**: Review the generated images. Check for text accuracy and "vibe".
- **Manual Action**: User approves the final visual.

### Step 5: Bulk Commit (Final Build)

- **Goal**: Convert approved images to Base64 and append to `memes.json`.
- **Tool**: `node bin/aztomiq.js meme:commit --ids=1,4,5`
- **Action**: Automates the Base64 conversion and JSON update in one go.

## 🛠 Storage

- **Data**: `src/features/dev-memes/memes.json`
- **Assets**: Temporary images stored in `.gemini/cache/` before conversion.
