# Self‑hosting OpenResume

This fork is designed to run locally on your machine. It is a free, open‑source resume/CV builder and ATS scoring tool that runs entirely offline.

## Prerequisites

- **Node.js 18+** (includes npm)
- **npm**

## Quick start (npm)

1. `git clone https://github.com/alteixeira20/open-resume.git`
2. `cd open-resume`
3. `npm install`
4. `npm run build`
5. `npm start`
6. Open `http://localhost:3000`

## Quick start (Makefile)

1. `git clone https://github.com/alteixeira20/open-resume.git`
2. `cd open-resume`
3. `make install`
4. `make build`
5. `make run`
6. Open `http://localhost:3000`

## What runs locally

- Resume builder (PDF generation)
- Resume parser (PDF text extraction)
- ATS scoring (issues + breakdown)

No data is sent to third‑party services. The app runs in your browser on your machine.

## Optional tools

If you want to inspect PDF text extraction outside the app:

- macOS: `brew install poppler`
- Ubuntu/Debian: `sudo apt-get install poppler-utils`
- Arch: `sudo pacman -S poppler`

This gives you `pdftotext` and `pdfinfo` for local PDF inspection.
