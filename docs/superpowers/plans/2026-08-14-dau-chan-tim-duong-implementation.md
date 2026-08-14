# Dau Chan Tim Duong Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the game around the approved 3-chapter review journey from `noidunglamgame.docx`, with 14 four-option scenes, immediate explanations, chapter-specific music, and matching 3D chapter moods.

**Architecture:** Keep the existing Vite/React/Zustand/React Three Fiber app. Replace the old 4-chapter dialogue data with 3 focused chapter JSON files, extend the dialogue store to support graded choices and immediate feedback nodes, update UI copy/stats to match "ho so nghien cuu", and reuse the existing 3D scene components with new chapter mapping and state cues.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, Framer Motion, Three.js, @react-three/fiber, @react-three/drei.

## Global Constraints

- Source content must follow `noidunglamgame.docx` and the approved content spec at `docs/superpowers/specs/2026-08-14-dau-chan-tim-duong-content-design.md`.
- The player is a self-insert young researcher, not Nguyen Tat Thanh or Nguyen Ai Quoc.
- Game has 3 linked chapters: "Nhung Con Duong Chua Mo", "Qua Nhung Dai Duong", and "Con Duong Duoc Xac Lap".
- Each scene has exactly 4 choices: 1 best answer, 1 near-correct answer, and 2 wrong answers.
- Every choice shows an immediate explanation before the player continues.
- Scoring/retry rules remain provisional; implement enough grading metadata for later validation.
- Music assets are `menu_music.mp3`, `chapter1_archive.mp3`, `chapter2_voyage.mp3`, and `chapter3_resolution.mp3`.
- Avoid new dependencies.

---

## File Structure

- Modify `src/data/chapter1.json`, `src/data/chapter2.json`, `src/data/chapter3.json`: approved chapter content, choices, feedback nodes, and summaries.
- Modify `src/stores/useDialogueStore.ts`: support 3 chapters, graded choice metadata, immediate feedback flow, and final game completion after chapter 3.
- Modify `src/stores/useGameStore.ts`: make chapter type `1 | 2 | 3`, rename user-facing stat semantics without large state refactors.
- Modify `src/ui/DialogueSystem.tsx`: present task-oriented choices and feedback text cleanly.
- Modify `src/ui/HUD.tsx`: update chapter labels and stat labels for the new 3-chapter review game.
- Modify `src/ui/MainMenu.tsx`: update menu copy if needed and keep leaderboard entry.
- Modify `src/ui/ResultScreen.tsx`: update final result copy and "chapter reached" denominator to 3.
- Modify `src/App.tsx`: map only 3 chapters and add chapter music fade handling.
- Modify `src/components/3d/VillageScene.tsx`, `src/components/3d/ValleyScene.tsx`, `src/components/3d/FactoryScene.tsx`: revise labels/state cues to match Chapter 1 archive, Chapter 2 voyage, and Chapter 3 organization themes.
- Leave `src/data/chapter4.json` unused for now to minimize deletion risk.

---

### Task 1: Dialogue Schema and Store Flow

**Files:**
- Modify: `src/stores/useDialogueStore.ts`
- Modify: `src/stores/useGameStore.ts`

**Interfaces:**
- Consumes: chapter JSON nodes with `type`, `id`, `speaker`, `text`, `prompt`, `options`, `next`.
- Produces: `DialogueOption` with optional `quality: 'best' | 'partial' | 'wrong'` and `feedback: string`.
- Produces: `DialogueNode` with optional `sceneCode: string`.

- [ ] **Step 1: Add graded option types**

Change `DialogueOption` to:

```ts
export type ChoiceQuality = 'best' | 'partial' | 'wrong';

export type DialogueOption = {
  key: string;
  label: string;
  consequence: string;
  ideologyDelta: number;
  forcesDelta: number;
  quality?: ChoiceQuality;
  feedback?: string;
};
```

- [ ] **Step 2: Add 3-chapter support**

Change `GameState.chapter` and `setChapter` types from `1 | 2 | 3 | 4` to `1 | 2 | 3`.

In `loadChapter`, remove `chapter4Data` usage and accept only chapters 1-3. Use:

```ts
const chapters = {
  1: { data: chapter1Data, startNode: 'ch1_start' },
  2: { data: chapter2Data, startNode: 'ch2_start' },
  3: { data: chapter3Data, startNode: 'ch3_start' },
} as const;
```

- [ ] **Step 3: Implement immediate feedback node creation**

In `makeChoice`, after updating stats, set the current node to a generated line node instead of jumping directly to `option.consequence`:

```ts
set({
  currentNode: {
    id: `${currentNode.id}_${option.key}_feedback`,
    type: 'line',
    speaker: option.quality === 'best'
      ? 'Ho so duoc khoi phuc'
      : option.quality === 'partial'
        ? 'Nhan dinh chua du'
        : 'Moi lien ket sai lech',
    text: option.feedback || '',
    next: option.consequence,
    sceneCode: currentNode.sceneCode,
  }
});
```

- [ ] **Step 4: Update chapter transition and ending**

In `advance`, when `nextId === 'next_chapter'`, load the next chapter only if current chapter is less than 3.

When `nextId === 'true_ending'`, save and submit the current score, then show a final result:

```ts
title: 'HO SO HOAN THIEN'
message: 'Nhung dau chan roi rac da duoc noi thanh mot hanh trinh co phuong huong.'
```

- [ ] **Step 5: Verify TypeScript via build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

---

### Task 2: Approved 3-Chapter Content

**Files:**
- Modify: `src/data/chapter1.json`
- Modify: `src/data/chapter2.json`
- Modify: `src/data/chapter3.json`

**Interfaces:**
- Consumes: `DialogueOption.quality` and `DialogueOption.feedback` from Task 1.
- Produces: valid dialogue nodes for 14 scenes plus chapter summaries.

- [ ] **Step 1: Replace Chapter 1 data**

Create nodes:

- `ch1_start`
- `ch1_scene_1` through `ch1_scene_4`
- feedback destinations through option `consequence`
- `ch1_summary`

Each scene is a `choice` node with exactly 4 options from the approved spec. Set points:

```json
"best": { "ideologyDelta": 10, "forcesDelta": 120 }
"partial": { "ideologyDelta": 4, "forcesDelta": 60 }
"wrong": { "ideologyDelta": -8, "forcesDelta": 0 }
```

- [ ] **Step 2: Replace Chapter 2 data**

Create nodes:

- `ch2_start`
- `ch2_scene_1` through `ch2_scene_5`
- `ch2_summary`

Use the approved scenes C2.1-C2.5. `ch2_summary.next` must be `next_chapter`.

- [ ] **Step 3: Replace Chapter 3 data**

Create nodes:

- `ch3_start`
- `ch3_scene_1` through `ch3_scene_5`
- `ch3_summary`

Use the approved scenes C3.1-C3.5. `ch3_summary.next` must be `true_ending`.

- [ ] **Step 4: Validate JSON structure**

Run this PowerShell command:

```powershell
node -e "const fs=require('fs'); for (const f of ['src/data/chapter1.json','src/data/chapter2.json','src/data/chapter3.json']) { const data=JSON.parse(fs.readFileSync(f,'utf8')); if (!Array.isArray(data.nodes)) throw new Error(f+' missing nodes'); for (const n of data.nodes) { if (!n.id || !n.type) throw new Error(f+' bad node'); if (n.type === 'choice' && (!Array.isArray(n.options) || n.options.length !== 4)) throw new Error(f+' '+n.id+' must have 4 options'); } } console.log('chapter data ok');"
```

Expected: prints `chapter data ok`.

- [ ] **Step 5: Verify build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

---

### Task 3: UI Copy and Result Surface

**Files:**
- Modify: `src/ui/DialogueSystem.tsx`
- Modify: `src/ui/HUD.tsx`
- Modify: `src/ui/MainMenu.tsx`
- Modify: `src/ui/ResultScreen.tsx`

**Interfaces:**
- Consumes: `DialogueOption.quality` and generated feedback nodes.
- Produces: Vietnamese UI copy with correct 3-chapter labels.

- [ ] **Step 1: Update dialogue prompt and continue copy**

In `DialogueSystem`, replace broken "Click de tiep tuc" copy with:

```tsx
<span className="font-sans text-brand-gold text-xs">Click de tiep tuc</span>
```

Keep choice rendering as 4 vertical buttons. Add a small quality-neutral helper label above choices:

```tsx
<p className="mt-2 text-xs uppercase tracking-widest text-gray-400">Chon cach xu ly ho so</p>
```

- [ ] **Step 2: Update HUD labels**

Use:

```ts
const chapterTitles = {
  1: 'Nhung Con Duong Chua Mo',
  2: 'Qua Nhung Dai Duong',
  3: 'Con Duong Duoc Xac Lap',
} as const;
```

Show `Chuong I/II/III`, "Do chinh xac ho so" for `ideology`, and "Tu lieu khoi phuc" for `forces`.

- [ ] **Step 3: Update menu copy**

Use clean Vietnamese copy without mojibake:

```text
Game Lich Su - On Tap Sau Thuyet Trinh
Dau Chan Tim Duong
Khoi phuc ho so con duong cuu nuoc
Nhap ten nhom / nguoi choi
Bat dau khoi phuc
Bang xep hang
```

- [ ] **Step 4: Update result screen**

Change chapter denominator from 4 to 3. Use labels:

```text
HO SO
DIEM HO SO
NHAN DINH TOT NHAT
NHAN DINH SAI LECH
TU LIEU KHOI PHUC
CHUONG DAT
LICH SU LUA CHON TOT NHAT
KHOI PHUC LAI HO SO
```

- [ ] **Step 5: Verify build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

---

### Task 4: Chapter Music

**Files:**
- Modify: `src/App.tsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: audio files in `public/`.
- Produces: menu music plus chapter-specific looping tracks.

- [ ] **Step 1: Define audio tracks**

In `App.tsx`, define:

```ts
const audioTracks = {
  menu: new Audio(`${import.meta.env.BASE_URL}menu_music.mp3`),
  1: new Audio(`${import.meta.env.BASE_URL}chapter1_archive.mp3`),
  2: new Audio(`${import.meta.env.BASE_URL}chapter2_voyage.mp3`),
  3: new Audio(`${import.meta.env.BASE_URL}chapter3_resolution.mp3`),
} as const;
```

Set each track to loop and preload.

- [ ] **Step 2: Replace menu-only audio effect**

Use one `useEffect` to select the active track:

```ts
const activeTrack = !isStarted ? audioTracks.menu : audioTracks[chapter];
```

Fade out all inactive tracks and fade active track to volume `0.35` after user interaction. Keep browser autoplay handling by registering click/keydown listeners.

- [ ] **Step 3: Update preload links**

In `index.html`, add preload links for:

```html
<link rel="preload" href="./chapter1_archive.mp3" as="audio" type="audio/mpeg" />
<link rel="preload" href="./chapter2_voyage.mp3" as="audio" type="audio/mpeg" />
<link rel="preload" href="./chapter3_resolution.mp3" as="audio" type="audio/mpeg" />
```

- [ ] **Step 4: Verify build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

---

### Task 5: 3D Scene Mapping and Chapter Mood

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/3d/VillageScene.tsx`
- Modify: `src/components/3d/ValleyScene.tsx`
- Modify: `src/components/3d/FactoryScene.tsx`

**Interfaces:**
- Consumes: `currentNode.id` and chapter number.
- Produces: 3 distinct chapter moods using existing scene components.

- [ ] **Step 1: Map 3 chapters only**

In `App.tsx`, render:

```tsx
{chapter === 1 && <VillageScene />}
{chapter === 2 && <ValleyScene />}
{chapter === 3 && <FactoryScene />}
```

Remove `MountainScene` import and rendering from active flow.

- [ ] **Step 2: Retheme Chapter 1 labels**

In `VillageScene`, revise labels from journey-only labels to archive labels:

```text
Thuoc dia
Can Vuong
Yen The
Duong loi moi
```

Use completed state when node id contains `summary` or feedback after best choices.

- [ ] **Step 3: Retheme Chapter 2 labels**

In `ValleyScene`, revise knowledge cluster labels to:

```text
Ben Nha Rong
Phap - My - Anh
Ban va thu
Luan cuong
```

Keep the kinetic floating-map feel to represent journey.

- [ ] **Step 4: Retheme Chapter 3 labels**

In `FactoryScene`, revise visible labels and cues toward:

```text
Bao chi
To chuc
Duong cach menh
Hoi nghi 1930
```

Use printing/factory visuals as the organizational preparation scene.

- [ ] **Step 5: Verify build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

---

### Task 6: Final Verification and Commit

**Files:**
- All modified files from Tasks 1-5.

**Interfaces:**
- Consumes: completed implementation.
- Produces: verified working build.

- [ ] **Step 1: Run data validation**

Run:

```powershell
node -e "const fs=require('fs'); for (const f of ['src/data/chapter1.json','src/data/chapter2.json','src/data/chapter3.json']) { const data=JSON.parse(fs.readFileSync(f,'utf8')); if (!Array.isArray(data.nodes)) throw new Error(f+' missing nodes'); for (const n of data.nodes) { if (!n.id || !n.type) throw new Error(f+' bad node'); if (n.type === 'choice' && (!Array.isArray(n.options) || n.options.length !== 4)) throw new Error(f+' '+n.id+' must have 4 options'); } } console.log('chapter data ok');"
```

Expected: prints `chapter data ok`.

- [ ] **Step 2: Run production build**

Run: `npm.cmd run build`

Expected: Vite build exits 0.

- [ ] **Step 3: Inspect diff**

Run: `git diff --stat`

Expected: changes are limited to data, UI, store, audio handling, scene labels, and plan docs.

- [ ] **Step 4: Commit implementation**

Run:

```powershell
git add src index.html docs/superpowers/plans/2026-08-14-dau-chan-tim-duong-implementation.md
git commit -m "Implement revised review game flow"
```
