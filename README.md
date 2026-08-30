# VAADIVASAL (வாடிவாசல்) — Cultural Heritage Simulation

A browser-playable cultural heritage simulation of **Eru Thazhuvuthal** (ஏறு தழுவுதல் / Jallikattu), celebrating Tamil Nadu's 2,000-year-old Pongal tradition.

This is explicitly a **non-combat, non-violent simulation**. Victory is based purely on agility, respect, timing, and embracing the hump (திமில்) of the sacred Kangayam bull without weapons or harm.

---

## 🐂 Tech Stack

- **Framework**: Next.js (Pages Router) + React + TypeScript
- **2D Game Engine**: Phaser 3 (Arcade Physics, loaded client-side with dynamic import `ssr: false`)
- **UI Chrome**: Tailwind CSS + Lucide Icons
- **Audio**: Web Audio API Sound Synthesizer (Zero audio files — 100% procedural Thavil drums, Kombu horns, crowd cheers)
- **Visuals**: Procedural Canvas Vector Textures (Zero external image files — 0 missing asset 404 errors)

---

## 🎮 Core Game Loop & Screens

1. **Village Intro Screen**: Cultural heritage framing, Pongal context, sound controls, and CTA to enter the Vaadivasal.
2. **Vaadivasal Release Cutscene**: Authentic Dravidian temple & Vaadivasal gate, Thavil drum crescendo, doors swing open, and bull bursts into the arena.
3. **Dynamic Proximity & Approach-Angle Selection**:
   - 1 AI-controlled Kangayam Bull with steering behaviors & randomized veering.
   - 4 AI competitors (*Velan, Muthu, Kannan, Marudhu*) plus the Player.
   - Continuous 4-factor scoring: **Distance**, **Timing**, **Position (Flank)**, and **Approach Angle**.
   - Guaranteed selection win by attempt 3.
4. **Timing-Based Taming Minigame**:
   - 4-Stage grip meter (`பிடி 1` to `பிடி 4`).
   - Moving needle and green target zone (shrinks on each stage).
   - Balance focus meter & stylized bull resistance with non-violent feedback.
5. **Honor & Result Screen**:
   - Cultural titles (e.g. *வீரத் தமிழன் • Valorous Champion*), Valour Points score, reaction speed, and grips locked.
   - "Play Again" loops back cleanly to Step 1.

---

## 🕹️ Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move / Flank** | `WASD` or `Arrow Keys` | On-Screen Direction D-Pad or Drag |
| **Grip / Tame** | `SPACEBAR` | On-Screen [GRIP HUMP] Button or Click |
| **Audio Toggle** | Click Top Bar Sound Icon | Click Top Bar Sound Icon |

---

## 🚀 How to Run End-to-End Demo

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

4. **Build & Verify Production Bundle**:
   ```bash
   npm run build
   ```
