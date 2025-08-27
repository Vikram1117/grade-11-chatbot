# Grade 11 Tutor Chatbot — Fix for TSX parse error

## Why you saw `Unexpected token (1:0)` in `/index.tsx`
That error happens when a file with TypeScript/TSX syntax is parsed by a tool that does not expect TSX (no TypeScript transpiler configured). It commonly occurs if a stray `index.tsx` exists, or if the bundler configuration expects JS but finds TSX. This project avoids TSX entirely and adds a proactive check to catch stray `.tsx` files.

## Quick start (safe sequence)
1. Export or copy the canvas contents into a project folder.
2. From the project root run:

```bash
npm install
npm run check:tsx   # ensures there are no .tsx files
npm run test:nlu   # quick NLU unit tests (node-based)
npm run dev
```

3. Open the dev server URL printed by Vite (usually http://localhost:5173).

## Deploying to Vercel
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. In Vercel, add an Environment Variable named `OPENAI_API_KEY` with your key.
4. Deploy. The serverless function at `/api/openai` will be available and will use `process.env.OPENAI_API_KEY` securely.

## If you still see the same error
- Run `npm run check:tsx`. If it reports `.tsx` files, remove or rename them (eg. `index.tsx` → `index.jsx`) and retry.
- If there are no `.tsx` files and you still see the error, paste the **exact** stack trace and the path of the file shown in the stack. I will debug further.