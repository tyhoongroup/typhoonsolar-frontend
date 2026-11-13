# Typhoon Solar - Web Application

Enterprise Rooftop Solar Operations Platform (ERP, CRM & Customer Tracking) built with Next.js 14, React 18, Tailwind CSS, and Lucide Icons.

## Features
- **Role-Centric UI**: Dynamic color themes & tailored dashboards matching exact enterprise mobile app specifications:
  - `ACCOUNTANT`: Deep Burgundy & Berry Crimson
  - `SALESPERSON`: Royal Blue & Sky Blue
  - `PORTAL_USER`: Petrol Teal & Mint Cyan
  - `MATERIAL_MANAGER`: Olive Green & Lime Green
  - `INSTALLATION_TEAM`: Deep Chocolate & Warm Orange
  - `OPS_MANAGER`: Midnight Navy & Sunlight Gold
  - `SERVICE_TECH`: Charcoal & Canary Yellow
  - `CUSTOMER TRACKER`: Forest Pine & Spring Mint
  - `ADMIN`: Midnight Indigo & Electric Violet
- **10-Stage Pipeline Visualizer**: Interactive stage trackers, document uploaders, SR number dispatch, and subsidy approvals.
- **Milestone Payment Manager**: Real-time payment ledger, receipt generator, and settlement tracker.
- **Customer Live Tracking**: Dedicated public tracker portal (`/track/[token]`) with live stage progress, query banners, and salesperson contact cards.
- **Progressive Web App (PWA) Ready**: Mobile-first responsive layouts for field teams.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI & Styling**: React 18, Tailwind CSS, Lucide React, Sonner Toast
- **State & Notifications**: Firebase Cloud Messaging (Web Push)
- **API Proxy**: Seamless `/api` reverse proxy to Backend API

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Production Build
```bash
npm run build
npm start
```

