# Contributing to InteriorAI

Thanks for your interest in improving InteriorAI.

This project combines AI image generation, conversational design guidance, a polished frontend, and a small backend contact API. Because of that, contributions need to be thoughtful, tested, and aligned with the product quality bar.

## Before you contribute

Please read these files first:

- `README.md`
- `.env.example`
- `server.ts`
- `src/App.tsx`
- `src/services/geminiService.ts`

If your change touches UI, also review:

- `src/components/`
- `src/pages/`

## Ground rules

These rules are strict. Contributions that ignore them may be closed or asked to rework before review.

### 1. Do not commit secrets

Never commit:

- real API keys
- Gmail credentials
- `.env`
- personal tokens
- private URLs or internal credentials

Only update `.env.example` when documenting new required variables.

### 2. Do not break the core product flow

InteriorAI is built around this experience:

1. upload a room photo
2. choose a style
3. generate a redesigned image
4. refine the result in chat
5. save or download the final concept

Changes that weaken, remove, or confuse this flow are unlikely to be accepted unless there is a strong product reason.

### 3. Keep the UI premium

This is not a template-grade app. UI changes must feel intentional and polished.

Do not submit:

- generic or visually weaker redesigns
- inconsistent spacing and typography
- broken mobile layouts
- inaccessible color contrast
- cluttered controls or noisy visual additions

Any UI contribution should preserve:

- responsive behavior
- clean visual hierarchy
- smooth user flow
- consistent styling with the existing app

### 4. Be careful with AI prompt and model changes

Changes to `src/services/geminiService.ts` can affect output quality, cost, latency, and user trust.

If you change prompts, models, or response handling:

- explain why
- describe expected user impact
- mention any tradeoffs
- verify the app still works for both image generation and chat

Do not swap models or rewrite prompts casually.

### 5. Do not hardcode project-specific values

Avoid hardcoding:

- email addresses
- API endpoints that should be configurable
- environment-dependent settings
- secret-bearing values

Configuration belongs in environment variables or clearly documented constants.

### 6. Keep changes focused

One pull request should solve one clear problem.

Avoid mixing:

- docs + refactor + feature work
- UI overhaul + backend behavior changes
- unrelated cleanup with functional changes

Small, reviewable pull requests are strongly preferred.

## Local development

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend:

```bash
npm run dev
```

Before submitting, run:

```bash
npm run lint
npm run build
```

Your contribution should not introduce TypeScript errors or build failures.

## Code standards

### Frontend

- Use TypeScript consistently
- Preserve responsive behavior on desktop and mobile
- Reuse existing patterns before introducing new abstractions
- Keep components readable and reasonably scoped
- Do not add unnecessary dependencies

### Backend

- Keep the contact API simple and secure
- Validate inputs clearly
- Do not weaken error handling
- Do not introduce insecure email handling or unsafe request processing

### General

- Prefer small, clear functions over clever code
- Keep naming descriptive
- Avoid dead code and commented-out blocks
- Add comments only when they genuinely help explain non-obvious logic

## Testing expectations

At minimum, contributors should verify:

- the app starts successfully
- image upload still works
- style selection still works
- Gemini generation flow still works
- chat still works
- contact form still submits correctly
- `npm run lint` passes
- `npm run build` passes

If your change affects only docs, say so clearly in the pull request.

## Pull request checklist

Before opening a pull request, make sure:

- your branch is up to date
- the change is focused and reviewable
- secrets are not included
- docs are updated if behavior changed
- screenshots are included for visible UI changes
- manual test notes are included
- build and type-check pass locally

## Pull request description

Your PR should include:

- what changed
- why it changed
- files or areas affected
- how you tested it
- screenshots or screen recordings for UI work
- any follow-up work that remains

Low-context pull requests are harder to review and may be delayed.

## What may be rejected

The following are common reasons a contribution may be rejected or sent back for revision:

- breaking the main user flow
- introducing weaker UI or inconsistent styling
- committing secrets or unsafe config
- changing AI behavior without explanation
- adding unnecessary complexity
- making unrelated edits in the same PR
- skipping testing or review notes

## Suggested contribution areas

Good contributions include:

- UX polish that clearly improves usability
- accessibility improvements
- safer backend validation
- clearer error states
- better loading and empty states
- documentation improvements
- performance improvements with measurable value

## Communication

Be direct, specific, and respectful in issues and pull requests.

If you are proposing a larger change, open an issue first so the direction can be aligned before implementation.

## Final note

Quality matters more than volume here. A small, excellent contribution is much more valuable than a large, messy one.
