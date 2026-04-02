# InteriorAI

<div align="center">

### Reimagine any room with AI-powered interior styling

Upload a room photo, transform it into curated design styles, refine the concept with an AI consultant, and keep your favorite redesigns in a polished, responsive web app.

[![React](https://img.shields.io/badge/React-19-111111?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-111111?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-111111?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-Powered-111111?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

## Why this project stands out

InteriorAI is more than a demo form wrapped around an image model. It is a complete interior-design experience with:

- AI room restyling from a real uploaded image
- Multiple curated design aesthetics like Scandinavian, Bohemian, Industrial, Minimalist, and Mid-Century Modern
- A conversational design assistant that can discuss layout, decor, styling, and shopping ideas
- A before/after comparison flow for visual validation
- Local saved-design gallery for quick revisit, download, and cleanup
- Contact, privacy, and terms pages for a more production-ready feel
- Express + Nodemailer backend for handling contact submissions

## Experience overview

The app is designed around a simple, high-impact workflow:

1. Upload a room photo.
2. Pick an interior style.
3. Let Gemini generate a redesigned version of the same space.
4. Compare original and generated imagery side by side.
5. Continue refining ideas in the built-in AI chat.
6. Save or download your favorite versions.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6, TypeScript |
| Styling | Tailwind CSS 4 |
| Motion | Motion |
| Icons | Lucide React |
| AI | Google Gemini via `@google/genai` |
| Backend | Express |
| Email | Nodemailer with Gmail SMTP |
| Content UI | React Markdown |

## Core features

### AI room reimagination
- Accepts a user-uploaded room image
- Sends the image and style prompt to Gemini image generation
- Returns a redesigned room concept while keeping the original layout recognizable

### Interactive design chat
- Lets users ask follow-up questions about the room
- Uses the current image as context for more grounded responses
- Supports iterative design thinking instead of a one-shot output

### Saved design gallery
- Stores favorite generations in browser `localStorage`
- Lets users reopen, download, and remove saved concepts
- Keeps the product feeling personal without requiring auth

### Built-in contact flow
- Includes a validated contact page
- Sends submissions through a backend API
- Delivers messages to your configured inbox with Gmail SMTP

## Project structure

```text
.
|- src/
|  |- components/
|  |  |- ChatInterface.tsx
|  |  |- CompareSlider.tsx
|  |  |- StyleCarousel.tsx
|  |- lib/
|  |  |- utils.ts
|  |- pages/
|  |  |- ContactPage.tsx
|  |  |- PrivacyPage.tsx
|  |  |- TermsPage.tsx
|  |- services/
|  |  |- geminiService.ts
|  |- App.tsx
|  |- main.tsx
|- server.ts
|- .env.example
|- vite.config.ts
```

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm
- A Google Gemini API key
- A Gmail account plus app password if you want the contact form to send emails

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root based on `.env.example`.

```env
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-gmail-app-password"
CONTACT_EMAIL="your-inbox@example.com"
APP_URL="http://localhost:3000"
```

### Gemini API key behavior

This project currently asks the user to enter the Gemini API key inside the app UI. The key is stored in browser cookies so the frontend can keep working across visits.

That means:

- `GMAIL_USER`, `GMAIL_PASS`, and `CONTACT_EMAIL` are needed for the contact backend
- the Gemini key is entered in the app itself through the `API Key` button

## Run the project

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite frontend on port `3000` |
| `npm run dev:backend` | Starts the Express contact API on port `4000` |
| `npm run build` | Builds the frontend for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type-checking |

## API flow

### Frontend
- The frontend proxies `/api/*` requests to `http://127.0.0.1:4000` during development
- Uploaded images stay in the browser and are passed to Gemini when generation is requested

### Backend
- `POST /api/contact`
- Validates `name`, `email`, and `message`
- Sends an email using your configured Gmail SMTP credentials

Example request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I want help redesigning my living room."
}
```

## Product notes

- Saved designs are stored only in the user's browser, not in a database
- Contact submissions are sent by email, not persisted in app storage
- Image generation and chat both depend on a valid Gemini API key
- Development uses a frontend/backend split, while production can be served behind one domain with the backend exposed for `/api/contact`

## Production readiness ideas

If you want to push this project further, strong next upgrades would be:

- rate limiting and spam protection on the contact endpoint
- file-size and MIME validation before AI submission
- persistent user accounts and cloud gallery storage
- prompt history and saved chat sessions
- deployment setup for Vercel, Render, Railway, or Docker
- analytics and error tracking

## License

This project is licensed under the [MIT License](./LICENSE).

## Author

Built by Hardik Rathod.
