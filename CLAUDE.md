# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

卓纬大圆机 — A cross-platform mobile app (Uniapp 3.0 + Vue 3) for managing circular knitting machine configurations. Primary target is Android via native plugin support. The app communicates with hardware over USB serial to read/write device registers, manage needle measurement workflows, and persist configurations locally.

## Development Commands

```bash
npm run dev:h5              # Web dev server (fastest iteration)
npm run dev:mp-weixin       # WeChat mini program dev
npm run build:h5            # Web production build
npm run build:mp-weixin     # WeChat mini program build
```

For Android builds, use HBuilderX IDE (configured in `.hbuilderx/launch.json`).

## Architecture

### Page Structure (4 pages)

| Path | Purpose |
|------|---------|
| `pages/index/index.vue` | Main dashboard — ECharts pie chart, machine config grid display, measurement/adjustment workflows, USB connection handling |
| `pages/settings/index.vue` | Config list management — lists saved machine-settings, allows use/edit/delete |
| `pages/settings/add.vue` | Create/edit configurations — combos (出圈/含圈/平圈) and arranges (组合/针门) |
| `pages/params/index.vue` | Threshold settings — 平圈/含圈基准线阀值, persists to device registers |

### Core Business Concepts

- **Combo types** (组合): `出圈`, `含圈`, `平圈` — the needle/stitch types arranged in a sequence
- **Arrange types** (排列): `组合` (group of combos repeated N times), `针门` (needle gate — single unit)
- **Tolerance types** (允许误差): `rongCha` (max), `rongCha2` (min) — thresholds for color-coded status (green/yellow/red) in the dashboard grid

### Data Flow

- **Config persistence**: All machine-settings saved under localStorage key `machine-settings-config` as an array
- **Inter-page communication**: `uni.$emit('configSelect', data)` from settings list → main dashboard receives via `uni.$on('configSelect', ...)` in index's `onMounted`
- **Page lifecycle**: settings/index uses `onShow` to reload storage (data may change from add/edit page), add.vue uses `onLoad` for edit-index params
- **Config item structure**: `{ alias: string, combos: Array<{id, label}>, arranges: Array<{id, label, multiplier?}> }`

### Native Plugin — UsbModule

- **Plugin ID**: `UsbModule` (class `io.dcloud.uniplugin.UsbModule`, v1.0.36)
- **Location**: `nativeplugins/UsbModule/` (Android `.aar` files)
- **Dependencies**: `usb-serial-for-android-v3.10.0.aar`, `crashreport-4.1.9.3.aar`
- **Registration**: `uni.requireNativePlugin("UsbModule")` — at `src/utils/helpers.js` top level AND `src/pages/index/index.vue` inside `#ifdef APP-PLUS`
- **API**: `module.init(key)`, `module.connect()`, `module.read(address, count, callback)`, `module.write(address, value, length, callback)`

### USB Communication Layer

Implemented in `src/utils/helpers.js`:
- **`UsbOperationQueue`** — serializes all USB read/write operations to prevent concurrent access conflicts
- **`writeWithConfirm(address, value, length)`** — enqueues register writes with callback confirmation
- **`readWithConfirm(address, count=1)`** — enqueues register reads; handles big-endian parsing and signed 16-bit conversions for the current-value register (0x15) and data registers (≥0x100). Also handles 32-bit signed conversion for `count=2` reads

### Key Register Map

| Address | Purpose |
|---------|---------|
| `0x10` | Auth write-test register |
| `0x11` | Initialize data register |
| `0x12` | 总路数寄存器 (total road count) |
| `0x13` | 路号寄存器 (current road index) |
| `0x15` | 当前值寄存器 (current read value — signed 16-bit) |
| `0x17` | Clear-to-zero register |
| `0x1B` | Auth command register (指令寄存器) |
| `0x1C–0x23` | Auth data registers (8 addr) |
| `0x30+` | Road type registers (one per road, written during config) |
| `0xFA` | Run mode register (0=measure, 1=stop) |
| `0xFB` | Measurement status register (0=running, 1=done, 2=failed) |
| `0x100+` | Data registers (start at 0x102 per-road, signed 16-bit) |

### Auth Flow (`src/utils/auth.js`)

1. Write `100` to register `0x10` and verify
2. Execute command `0x01` to read device ID from registers `0x1C–0x23`
3. Fetch certificate from `https://www.gdfszhiwei.com/api/devices/encrypted?device_id=...`
4. Write certificate to device, execute command `0x02`
5. Generate 16-byte random, write to device, execute command `0x03`
6. Execute command `0x04` and read encrypted response from device
7. XOR random with device ID → POST to `https://www.gdfszhiwei.com/api/encrypt` → compare with device response
8. Execute command `0x05` → expect status `0x20`
- **Offline fallback**: Caches certificate, random, XOR result, and server-encrypted response in localStorage for reuse

### Shared Utilities

| File | Purpose |
|------|---------|
| `src/utils/helpers.js` | `sleep()`, `writeWithConfirm()`, `readWithConfirm()`, `UsbOperationQueue` |
| `src/utils/auth.js` | Device authentication flow, register-level commands |
| `src/utils/battery.js` | Battery monitoring (5-min interval, alerts below 20%) |

### Shared Components

- **`src/components/NumberKeyboard.vue`** — Custom numeric keyboard overlay used on index.vue, add.vue, and params/index.vue. Emits `{ field, value }` on confirm. Supports both decimal (for mm values) and integer (for quantities) modes

### Styling

- `@tdesign/uniapp` (v0.8.1) — primary UI framework
- `src/styles/common.css` — shared page-level styles
- `src/styles/config-card.css` — reusable config card styles used in index and params pages
- `src/styles/type-icons.css` — SVG-like icons for 出圈/含圈/平圈/针门 types

### Path Aliases

- `@` → `src/` (configured in `vite.config.js`)

### Measurement Workflow (index page)

1. User taps "织针测量" → measurement loop begins on register `0xFA`
2. Device reports progress via register `0xFB` and current road index via `0x13`
3. Each road's value read from register `0x102 + roadIndex * 5`
4. On completion (`0xFB === 1`), all road values read once more and "测量完成" dialog shown
5. Edit mode ("织针调节"): user clicks grid items to set adjustment values, dialog shows real-time current value refreshed every 1s

### Filter System

Dashboard grid items filterable by tolerance status: "全部" (all), "最大误差" (red), "中误差" (yellow) — controlled via `t-action-sheet` on index page

## Agent skills

### Issue tracker

Issues are tracked as GitHub issues; use the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles with default label strings. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one CONTEXT.md + docs/adr/ at repo root. See `docs/agents/domain.md`.
