# OpenResume - ATS Scoring Version

This repository is a fork of [OpenResume](https://github.com/xitanggg/open-resume/) by Xitang (full credit to the original creator). The upstream project delivers an open-source resume builder and parser; this fork keeps that foundation while adding a fully local, deterministic ATS scoring engine with API and CLI access.

The goal remains the same—help everyone produce modern, ATS-friendly resumes—but now with additional guidance on how an Application Tracking System might interpret a given PDF.

Official site for the original project: [https://open-resume.com](https://open-resume.com)

## ⚒️ Resume Builder

OpenResume's resume builder allows user to create a modern professional resume easily.

![Resume Builder Demo](https://i.ibb.co/jzcrrt8/resume-builder-demo-optimize.gif)

It has 5 Core Features:
| <div style="width:285px">**Feature**</div> | **Description** |
|---|---|
| **1. Real Time UI Update** | The resume PDF is updated in real time as you enter your resume information, so you can easily see the final output. |
| **2. Modern Professional Resume Design** | The resume PDF is a modern professional design that adheres to U.S. best practices and is ATS friendly to top ATS platforms such as Greenhouse and Lever. It automatically formats fonts, sizes, margins, bullet points to ensure consistency and avoid human errors. |
| **3. Privacy Focus** | The app only runs locally on your browser, meaning no sign up is required and no data ever leaves your browser, so it gives you peace of mind on your personal data. (Fun fact: Running only locally means the app still works even if you disconnect the internet.) |
| **4. Import From Existing Resume PDF** | If you already have an existing resume PDF, you have the option to import it directly, so you can update your resume design to a modern professional design in literally a few seconds. |
| **5. Successful Track Record** | OpenResume users have landed interviews and offers from top companies, such as Dropbox, Google, Meta to name a few. It has been proven to work and liken by recruiters and hiring managers. |

## 🔍 Resume Parser

OpenResume’s second component is the resume parser. For those who have an existing resume, the resume parser can help test and confirm its ATS readability.

![Resume Parser Demo](https://i.ibb.co/JvSVwNk/resume-parser-demo-optimize.gif)

You can learn more about the resume parser algorithm in the ["Resume Parser Algorithm Deep Dive" section](https://open-resume.com/resume-parser).

### Local ATS Score

This fork introduces a deterministic ATS scoring pipeline that runs completely offline. It reuses the original parsing stages, then grades the resulting data across four dimensions (0–100 total):

1. **Parsing reliability (40 pts)** – Verifies whether critical fields were correctly extracted by the parser: name, email, phone, location, public links, education entries, and work experiences. Partial data yields partial credit, with issue messages for missing or ambiguous values.
2. **Structure (20 pts)** – Checks single-column layout heuristics, heading detection, bullet consistency, and document length. Suspected multi-column layouts or tables are penalized.
3. **Keywords vs. job description (30 pts, optional)** – If a job description is supplied, the score measures overlap between contract-critical tech keywords, impact verbs, and environment/tools phrases using stemming and contextual text search. Missing matches are reported per category.
4. **Readability (10 pts)** – Rewards quantifiable accomplishments, plain URLs, and robust punctuation while flagging run-together words and a lack of metrics.

When no job description is provided, the score rescales the other three categories to 100 so results remain comparable. The return payload always includes a breakdown plus a de-duplicated issues list (e.g., `"Education details incomplete"`, `"Likely multi-column layout"`).

The scoring engine is exposed in three ways:

- **Parser Playground** – Upload a PDF on `/resume-parser`; immediately see the score card, breakdown, and improvement tips alongside the structured parse.
- **API endpoint** – `POST /api/ats-score` with `textItems` (and optional `lines`, `sections`, `resume`, `jobDescription`). It returns `{ score, breakdown, issues }`.
- **CLI utility** – Run `npm run ats-score -- --file resume.pdf [--job job.txt] [--json]` to analyze local PDFs from the terminal.

`textItems` should match the shape returned by `readPdf`. Passing precomputed `lines`, `sections`, or `resume` objects avoids recomputing them. All computation remains local—no external services or network calls.

## 📚 Tech Stack

| <div style="width:140px">**Category**</div> | <div style="width:100px">**Choice**</div> | **Descriptions** |
|---|---|---|
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | TypeScript is JavaScript with static type checking and helps catch many silly bugs at code time. |
| **UI Library** | [React](https://github.com/facebook/react) | React’s declarative syntax and component-based architecture make it simple to develop reactive reusable components. |
| **State Management** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Redux toolkit reduces the boilerplate to set up and update a central redux store, which is used in managing the complex resume state. |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Tailwind speeds up development by providing helpful css utilities and removing the need to context switch between tsx and css files. |
| **Web Framework** | [NextJS 13](https://github.com/vercel/next.js) | Next.js supports static site generation and helps build efficient React webpages that support SEO. |
| **PDF Reader** | [PDF.js](https://github.com/mozilla/pdf.js) | PDF.js reads content from PDF files and is used by the resume parser at its first step to read a resume PDF’s content. |
| **PDF Renderer** | [React-pdf](https://github.com/diegomura/react-pdf) | React-pdf creates PDF files and is used by the resume builder to create a downloadable PDF file. |

## 📁 Project Structure

OpenResume is created with the NextJS web framework and follows its project structure. The source code can be found in `src/app`. There are a total of 4 page routes as shown in the table below. (Code path is relative to `src/app`)

| <div style="width:115px">**Page Route**</div> | **Code Path** | **Description** |
|---|---|---|
| / | /page.tsx | Home page that contains hero, auto typing resume, steps, testimonials, logo cloud, etc |
| /resume-import | /resume-import/page.tsx | Resume import page, where you can choose to import data from an existing resume PDF. The main component used is `ResumeDropzone` (`/components/ResumeDropzone.tsx`) |
| /resume-builder | /resume-builder/page.tsx | Resume builder page to build and download a resume PDF. The main components used are `ResumeForm` (`/components/ResumeForm`) and `Resume` (`/components/Resume`) |
| /resume-parser | /resume-parser/page.tsx | Resume parser page to test a resume’s AST readability. The main library util used is `parseResumeFromPdf` (`/lib/parse-resume-from-pdf`) |

## 💻 Local Development

### Method 1: npm

1. Download the repo `git clone https://github.com/alteixeira20/open-resume.git`
2. Change the directory `cd open-resume`
3. Install the dependency `npm install`
4. Build a production ready version `npm run build`
5. Start the App with 'npm start'
6. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live

### Method 2: Docker

1. Download the repo `git clone https://github.com/alteixeira20/open-resume.git`
2. Change the directory `cd open-resume`
3. Build the container `docker build -t open-resume .`
4. Start the container `docker run -p 3000:3000 open-resume`
5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live
