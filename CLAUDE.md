# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development Server:** `npm run dev` (Starts Next.js on `localhost:3000`)
- **Build:** `npm run build` (Builds the production application)
- **Start Production Server:** `npm run start` (Starts the built application)
- **Lint:** `npm run lint` (Runs ESLint)
- **Tests:** *No test suite (e.g., Jest or Vitest) is currently configured in this project.*

## Architecture and Structure

This repository is a Next.js application that serves as a real estate website clone (Batdongsan clone). It uses the **Next.js App Router** (Next.js 16+), **React 19**, **Tailwind CSS 4**, and **TypeScript**.

### Key Directories

- `src/app/`: Defines the routing and pages using the App Router.
  - Core domain routes include:
    - `ban-can-ho-chung-cu/`: Apartments for sale
    - `properties/`: Property detail pages
    - `nha-moi-gioi/`: Real estate brokers
    - `doanh-nghiep/`: Business directory
    - `tin-tuc/`: News and articles
- `src/components/`: Contains modular React components organized using **Atomic Design** principles:
  - `atoms/`: Basic UI primitives (`Icon`, `Button`, `Badge`, `Input`, `Select`, `Avatar`, `Logo`, `Skeleton`).
  - `molecules/`: Compound components built from atoms (`Modal`, `Dropdown`, `Pagination`, `Breadcrumb`, `FormField`, `FavoriteButton`).
  - `templates/`: Page-level layout compositions (`PublicPageLayout`, `TwoColumnLayout`).
  - Core layouts and cards (`Header`, `Footer`, `PropertyCard`, `ListingCard`, `HeroSearch`, `SearchFilterBar`).
- `src/hooks/`: Custom stateful React hooks (`useClickOutside`, `useBodyScrollLock`, `useDropdown`, `useEscapeKey`).
- `src/types/` & `src/adapters/` & `src/config/`: Centralized interfaces, API mapping adapters, and static configuration options.
- `public/`: Static assets.

### Technology Stack Notes
- **Styling:** Handled via Tailwind CSS v4 and PostCSS (`globals.css`, `postcss.config.mjs`).
- **Configuration:** Written in TypeScript/ESM (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`).