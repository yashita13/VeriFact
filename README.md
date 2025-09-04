This is a Next.js app scaffold for an AI-powered misinformation detection UI.

Features added in this demo:
- Landing page with hero, features, and how-it-works sections.
- Navbar displayed on all pages.
- Upload/Analyze form to accept:
  - Text input
  - URL input
  - File upload: image/audio/video (client-side validated types)
- Redirect to a Results page that shows a structured analysis scaffold: classification, reasoning, credibility score placeholder, sources, and next steps.

Note: This demo does not integrate Google Cloud APIs yet. Files are not uploaded; only metadata (name, type) and textual inputs are passed via query parameters to preview the UI flow.

## Getting Started

Install dependencies (includes GSAP for animations), then run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Workflow:
1. On the home page, click "Start Free Detection" or scroll to the Analyze section.
2. Provide text, a URL, or upload an image/audio/video file (supported formats only).
3. Click "Analyze Now" to be redirected to /results where a demo analysis UI is shown.

## Providing Assets for a Cooler Landing Page
To customize the new animated hero to your brand, provide the following (optional but recommended):
- Logo: SVG or transparent PNG. Place as /public/logo.svg or /public/logo.png and I can wire it into the Navbar.
- Background image or short looping video (5–10s, MP4/WebM, 1920x1080): place in /public/bg.mp4 or /public/bg.jpg.
- Color palette: 2–3 brand hex colors (primary, accent, neutral) to replace the current purple/pink gradients.
- Headline and subheading you want on the hero.
- Any icon set for features (SVGs) to replace text-only cards.

Put files under the public/ folder:
- public/logo.svg (or .png)
- public/bg.mp4 (or bg.jpg)
- public/icons/*.svg (optional)

If you provide ai.jpeg in public/ it will be used as the hero background automatically. Place img.png in public/ and it will be used for the favicon and navbar logo. Tell me the exact filenames if you want different names and I will hook them up.

## Next Steps (not implemented in this demo)
- Integrate Cloud Vision (OCR), Speech-to-Text, and Vertex AI for embeddings and reasoning.
- Add language detection/translation and entity extraction.
- Persist uploads to storage and pass an ID to the results page.
- Replace placeholders with real credibility scoring and explanations.
