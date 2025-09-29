# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 application that generates QR codes from URLs or text input. Built with React 19, TypeScript, and Tailwind CSS, using shadcn/ui components.

## Commands

**Development:**
```bash
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture

**Tech Stack:**
- Next.js 15 with App Router (`src/app/`)
- React Server Components with client components where needed
- TypeScript (strict mode disabled in tsconfig.json)
- Tailwind CSS 4.x with shadcn/ui components
- pnpm as package manager

**Key Dependencies:**
- `qrcode-svg` - QR code generation
- `jspdf` - PDF export functionality
- `lucide-react` - Icon system
- shadcn/ui components (Button, Input, Card)

**Directory Structure:**
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx           # Home page (wraps QrCodeGenerator in Suspense)
│   ├── globals.css        # Global Tailwind styles
│   └── fonts/             # Geist font files
├── components/
│   ├── qr-code-generator.tsx  # Main QR code component (client component)
│   └── ui/                    # shadcn/ui components
└── lib/
    └── utils.ts           # cn() utility for className merging
```

**Import Aliases:**
- `@/*` maps to `src/*`
- shadcn/ui configured with aliases: `@/components`, `@/lib/utils`, `@/components/ui`

**QR Code Generator Component** (`src/components/qr-code-generator.tsx`):
- Client component (`'use client'`)
- Accepts `?input=` URL parameter for pre-filling text
- Auto-generates QR code when URL param is present
- Generates QR codes with configurable padding, dimensions, and error correction level (ECL: "M")
- Exports to SVG or PDF formats
- PDF export converts SVG to canvas, then to PNG, centered on page at 60% width

**Webpack Configuration:**
- `fs` fallback disabled in `next.config.mjs` (required for jsPDF client-side usage)

**Styling:**
- Uses Tailwind CSS with shadcn/ui default theme
- CSS variables enabled for theming
- Base color: neutral
- No prefix on utility classes

## Development Notes

- The main page wraps `QrCodeGenerator` in `Suspense` to handle client component hydration
- QR code generation happens client-side using `qrcode-svg` library
- PDF generation uses canvas conversion: SVG → Blob → Image → Canvas → PNG → PDF
- TypeScript strict mode is disabled (`strict: false`)
- Component uses `dangerouslySetInnerHTML` to render SVG QR codes