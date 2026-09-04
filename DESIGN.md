---
name: BeGrateful
description: A calm Vietnamese gratitude journal built around daily reflection, sharing, and streak care.
colors:
  leaf: "#006d43"
  leaf-deep: "#145C34"
  leaf-soft: "#4ca374"
  mint: "#d1e9e0"
  sprout: "#99f3b6"
  background: "#f4fbf8"
  background-warm: "#f7f1e8"
  surface: "#ffffff"
  surface-low: "#eef5f2"
  surface-container: "#e8efec"
  surface-high: "#dde4e1"
  border: "#bccabe"
  border-soft: "#E3EFE9"
  text: "#161d1b"
  text-deep: "#1A2F2B"
  muted: "#3d4a41"
  muted-soft: "#6C8377"
  fire: "#a5393e"
  fire-soft: "#ffdad8"
  fire-text: "#852229"
  danger: "#ba1a1a"
typography:
  display:
    fontFamily: "Quicksand, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "0"
  headline:
    fontFamily: "Quicksand, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "0"
  title:
    fontFamily: "Quicksand, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "0"
  body:
    fontFamily: "Quicksand, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0"
  label:
    fontFamily: "Quicksand, Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  mobile-margin: "20px"
  desktop-gutter: "24px"
  desktop-container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-low}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.sprout}"
    textColor: "{colors.leaf-deep}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  chip-neutral:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-high}"
    textColor: "{colors.text-deep}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: BeGrateful

## Overview

**Creative North Star: "The Living Journal Garden"**

BeGrateful is an Operate-mode journaling app. The UI should feel like a quiet daily companion: soft enough for reflection, structured enough for repeated use, and warm without becoming decorative.

The current visual world is plant-led, mint-green, rounded, mobile-first, and Vietnamese-first. Agents should preserve the feeling of "gieo mầm": entries are seeds, streaks are gentle momentum, calendar history is a garden, and the mascot can guide without taking over the task.

**Key Characteristics:**
- Light mint backgrounds, white surfaces, leaf-green actions.
- Rounded controls, generous touch targets, compact text hierarchy.
- Soft shadows and tonal layers instead of heavy borders.
- Real photo or mascot assets from `public/stitch` when imagery is needed.
- Public sharing stays optional; private writing stays the center.

## Colors

The palette is a living-garden system: leaf greens carry action and identity, mint tones carry calm surfaces, rose/fire tones mark streaks and risk.

### Primary
- **Leaf Green** (`#006d43`): brand color, primary CTA, active navigation, focus, trust actions.
- **Deep Leaf** (`#145C34`): stronger mobile CTA, active calendar day, high-emphasis green text.
- **Soft Leaf** (`#4ca374`): selected desktop nav tab and soft active fills.

### Secondary
- **Mist Mint** (`#d1e9e0`): soft accent panels, badges, entry prompts, selected mood backing.
- **Sprout Green** (`#99f3b6`): growth/progress states, achievement chips, garden heat levels.

### Tertiary
- **Fire Rose** (`#a5393e`): streak icon, warmth, habit energy.
- **Fire Wash** (`#ffdad8`): streak pill background and low-risk alert tint.
- **Danger Red** (`#ba1a1a`): destructive or moderation danger only.

### Neutral
- **App Background** (`#f4fbf8`): default Stitch/app shell background.
- **Warm Legacy Background** (`#f7f1e8`): admin/moderation fallback surfaces only.
- **Surface White** (`#ffffff`): cards, input focus, raised containers.
- **Surface Low** (`#eef5f2`): nav containers, prompts, secondary panels.
- **Surface Container** (`#e8efec`): chips, inactive calendar cells, subtle dividers.
- **Surface High** (`#dde4e1`): inputs, softer elevated fields.
- **Border** (`#bccabe`) and **Border Soft** (`#E3EFE9`): structure without heaviness.
- **Text Deep** (`#1A2F2B`) and **Text** (`#161d1b`): headings and body.
- **Muted Leaf** (`#3d4a41`) and **Soft Muted** (`#6C8377`): metadata, helper text, inactive nav.

### Named Rules

**The Leaf Means Action Rule.** Use `#006d43` for identity, primary action, active state, focus, and trust. Do not spend it on passive decoration.

**The Rose Is Earned Rule.** Rose/fire colors are for streaks, warmth, warnings, and moderation. Do not use them as a second brand color.

## Typography

**Display Font:** Quicksand, with Manrope/system fallback.
**Body Font:** Quicksand on Stitch surfaces; Manrope/system fallback remains acceptable for admin/legacy surfaces.
**Icon Font:** Material Symbols for Stitch-native surfaces; lucide-react for existing React utility controls.

**Character:** Rounded, friendly, readable. Use weight and spacing for hierarchy; avoid oversized marketing type inside app screens.

### Hierarchy
- **Display** (700, `32px/40px`): page-level app headings on desktop and major route titles.
- **Headline** (600-700, `24px/32px`): section headers, profile names, calendar module titles.
- **Title** (600, `20px/28px`): card headers, prompts, desktop nav brand.
- **Body** (400, `16px/24px`): main copy, journal text, explanatory lines.
- **Body Large** (400, `18px/28px`): entry content where reading is the primary act.
- **Label** (500-700, `11px-14px`, optional `0.04em` uppercase): metadata, chips, dates, compact controls.

### Named Rules

**The App-Type Rule.** Route headings may be bold; component text stays compact. Do not scale font size with viewport width.

## Layout

Mobile first. Primary mobile width is `max-w-[420px]` or `max-w-md`, with `20px-24px` horizontal margins and a fixed bottom nav. The write action is privileged: center-raised bottom tab on feed/profile, full-width CTA on calendar, fixed or highly reachable action on writing surfaces.

Desktop uses a centered `1200px` container, `24px` gutters, fixed top header, and simple grids. Feed uses a main column plus aside (`lg:grid-cols-12`, 8/4 split). Profile and calendar use module grids, never a persistent app sidebar.

Spacing rhythm: `8px` micro gaps, `12px-16px` control gaps, `24px` card padding, `32px` section gaps. Keep dense operational surfaces scanable; leave breathing room around writing areas.

## Elevation & Depth

Depth is soft and ambient. Surfaces are mostly white or mint tonal layers with light shadow. Use shadows to separate fixed headers, bottom nav, cards, floating CTAs, and focused writing areas; avoid hard outlines unless the surface needs structure.

### Shadow Vocabulary
- **Header:** `0 1px 8px rgba(26,47,43,0.02-0.04)` with backdrop blur.
- **Soft Card:** `0 2px 12px rgba(26,47,43,0.03)` or `0 4px 16px rgba(22,60,42,0.05)`.
- **Raised Card:** `0 8px 30px rgba(26,47,43,0.04-0.05)`.
- **Primary CTA:** `0 8px 16px rgba(0,109,67,0.15)`; stronger calendar CTAs may use `0 10px 30px rgba(0,168,107,0.28)`.

### Named Rules

**The Soft Lift Rule.** At rest, use tonal contrast first, shadow second. Hover may increase shadow slightly; do not add heavy depth to every card.

## Shapes

The shape language is rounded and organic but still app-like. Use `8px` for utility/admin cards, `12px` for nav tabs, buttons, and inputs, `16px` for composer panels, and `24px` for expressive feed/calendar cards. Pills are for chips, badges, avatars, filters, and compact metadata.

Avatars are circular. Calendar heat dots and progress bars use fully rounded or tiny rounded cells. Avoid nested cards; a card can contain soft rows, chips, image wells, or tonal panels, but not another card pretending to be a full section.

## Components

### Buttons
- **Shape:** `12px` rounded for main CTAs; pill for compact utility actions; circle for icon-only controls.
- **Primary:** leaf green or green gradient, white text, `44px-48px` minimum height, icon plus text when helpful.
- **Secondary:** mint/neutral fill, muted text, no heavy border.
- **Hover / Focus:** subtle color shift, slightly stronger shadow, visible `3px` focus outline or green ring.
- **Disabled:** keep layout stable; lower opacity, remove CTA shadow.

### Chips
- **Style:** rounded-full, `11px-12px` label, `6px 12px` or `6px 14px` padding.
- **Selected:** sprout/mint fill with deep leaf text.
- **Neutral:** surface container fill with muted text.
- **Use:** moods, filters, streaks, category labels, visibility metadata.

### Cards / Containers
- **Corner Style:** `16px-24px` for main product surfaces; `8px` for moderation/admin utility.
- **Background:** white primary, mint low surfaces for prompts/asides.
- **Shadow Strategy:** soft card shadow, stronger only for floating or focused writing surfaces.
- **Border:** use `#E3EFE9` or `#bccabe` only when structure matters.
- **Internal Padding:** `16px` mobile compact, `24px-32px` desktop main panels.

### Inputs / Fields
- **Style:** rounded `12px` or pill, muted mint fill, text deep, placeholder `#bccabe`.
- **Focus:** white background plus green ring or border.
- **Textarea:** large, quiet, resize disabled, `18px/28px` for journal writing.
- **Validation:** explicit status text; keep local-save/auth failures visible.

### Navigation
- **Mobile:** fixed bottom nav, blurred surface, safe-area padding. Write action may rise above the bar.
- **Desktop:** fixed top header, `1200px` container, brand left, segmented nav center, streak/profile right.
- **Active State:** green fill or sprout fill with deep green text. Inactive state uses muted leaf text.

### Journal Entry
- **Mobile:** compact white card, avatar row first, timestamp muted, body `15px/22px`.
- **Desktop:** larger rounded cards, category dot/label, body `18px/28px`, optional rounded image well.
- **Privacy:** anonymous and public states must be legible without relying on color alone.

### Calendar / Garden
- **Heat Cells:** rounded small cells, green intensity ladder, today gets green fill plus ring.
- **Metrics:** white card, uppercase label, large numeric value, progress bar when useful.
- **Mascot Whisper:** mint gradient panel with mascot/avatar asset; supportive copy, never blocking.

### Moderation
- **Style:** quieter legacy token surface is acceptable. Keep admin UI dense, clear, and action-first.
- **Actions:** icon plus label, `44px` minimum target, destructive actions visually distinct through text/icon and danger color.

## Do's and Don'ts

- Do use `journal-write-theme` tokens for all core app surfaces unless intentionally building admin/legacy utility UI.
- Do keep the first screen useful: feed, write, calendar, profile, auth, or moderation task directly visible.
- Do use real existing assets from `public/stitch` for mascot, avatars, plant imagery, and entry photos.
- Do keep Vietnamese copy warm, short, and action-oriented.
- Do preserve visible labels, keyboard focus, status text, and `44px` touch targets.
- Don't create marketing-style heroes for app routes.
- Don't add purple gradients, beige-only palettes, decorative blobs, nested cards, or oversized app typography.
- Don't use emoji as the only icon system in new UI; Material Symbols or lucide icons should carry controls.
- Don't make sharing feel required; writing privately must remain first-class.
- Don't invent future design tokens. Add tokens only when code actually uses them.
