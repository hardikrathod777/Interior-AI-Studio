<div align="center">
  <h1>Interior AI Studio</h1>
  <p>An AI-powered interior design consultant built with React, Vite, Google Gemini, and a secure contact form.</p>
</div>

## Overview

`interior-ai-studio` is a responsive interior design assistant that combines AI-driven room suggestions with a secure email contact workflow. Visitors can send messages through the contact form, and the backend delivers them via Gmail SMTP.

## Features

- Modern React + Vite frontend
- Google Gemini AI integration for interior design assistance
- Contact form with server-side email delivery using Gmail
- Responsive UI and polished design
- Privacy, terms, and contact pages included

## Getting started

### Prerequisites

- Node.js 18+ installed
- A Gmail account with an app password if using 2FA

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file using `.env.example` as a template and add:

```env
GEMINI_API_KEY=your_gemini_api_key
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
CONTACT_EMAIL=rathodhardik0914@gmail.com
```

- `GEMINI_API_KEY` is required for AI features.
- `GMAIL_USER` is the Gmail address used for sending contact emails.
- `GMAIL_PASS` should be a Gmail app password if your account uses 2FA.
- `CONTACT_EMAIL` is the destination address for contact form submissions.

## Running the app

Start the backend server in one terminal:

```bash
npm run dev:backend
```

Start the frontend in a separate terminal:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project structure

- `src/` — frontend React application
  - `pages/ContactPage.tsx` — contact form and submission UI
  - `components/` — reusable UI components
  - `services/` — integration helpers
- `server.ts` — Express backend for email delivery
- `.env.example` — sample environment configuration
- `vite.config.ts` — Vite config and API proxy setup

## Deployment notes

- Store `GMAIL_USER` and `GMAIL_PASS` securely in production.
- Use a dedicated Gmail account for sending application emails.
- Configure your deployment platform to run both frontend and backend or host them together.

## Support

If you want, I can help add:

- deployment instructions for Vercel, Render, or Cloud Run
- form spam protection
- contact submission storage and management
