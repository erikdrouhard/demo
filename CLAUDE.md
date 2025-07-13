# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript. The project is set up with:

### Core Technologies
- **Next.js 15** with App Router and Turbopack for development
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Shadcn/ui** components configured with "new-york" style and slate base color

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components (mapped to `@/components`)
- `lib/` - Utility functions and shared logic (mapped to `@/lib`)
- `public/` - Static assets

### Shadcn/ui Configuration
- Style: "new-york"
- Base color: slate
- Icon library: lucide-react
- Components path: `@/components/ui`
- CSS location: `app/globals.css`

### Key Files
- `lib/utils.ts` - Contains the `cn()` utility function for merging Tailwind classes
- `components.json` - Shadcn/ui configuration
- `app/layout.tsx` - Root layout with Geist fonts
- `app/globals.css` - Global styles and Tailwind imports

### Path Aliases
- `@/*` maps to project root
- Component imports should use `@/components`
- Utility imports should use `@/lib/utils`

### Development Notes
- Uses ESLint with Next.js and TypeScript configurations
- Configured for React Server Components (RSC)
- No database or ORM setup detected yet

### Code Best Practices
- Always use clear and descriptive variable names