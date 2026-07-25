# ⚡ Priyanshu Ghosh — Developer Portfolio

> **Full Stack Java & React Developer**  
> Dark Brutalism Design • Headless GitHub Data Store • Interactive 3D Canvas • Protected Admin CMS

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js&logoColor=white)](https://pmndrs.github.io/react-three-fiber/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🎨 Visual Identity & Architecture

Built with a **Dark Brutalism** design philosophy:
- Deep navy canvas (`#0a0f1e`) paired with sharp blue borders (`#1A56DB`) and vibrant green highlights (`#4fcea6`).
- JetBrains Mono technical typography combined with Sora headlines.
- Zero border radius on interactive blocks for a raw, terminal aesthetic.
- Zero traditional database dependency — leverages GitHub REST & CDN API for live Headless CMS capabilities.

---

## 🚀 Key Features

- 🌌 **Interactive 3D Hero Scene**: Custom React Three Fiber (R3F) canvas with smooth camera particle interaction.
- 💻 **Tech Stack & Projects Showcase**: Interactive project cards with 3D motion tilt, modal deep-dives, live demo links, and GitHub repository links.
- 🎓 **Certifications & Education Timeline**: Highlighted engineering certifications (JPMorgan Chase & Co. Job Sim) and academic status.
- 📷 **Media & Blogs Gallery**: Categorized photography/creative showcase and blog posts.
- 🔐 **Protected Admin Portal (`/admin`)**:
  - Live GitHub API integration for updating projects, skills, certifications, media, and timeline.
  - Drag-and-Drop image uploader that directly uploads media to GitHub repository assets.
  - Security Questions password reset recovery flow.
  - Section visibility toggle to control public sections dynamically.
- ✉️ **Contact Form**: Integrated direct messaging powered by EmailJS.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Design Tokens |
| **Animations** | Framer Motion + React Three Fiber / Three.js |
| **Data Layer (Read)** | GitHub Raw CDN (`raw.githubusercontent.com`) |
| **Data Layer (Write)** | GitHub Contents API via Axios & REST |
| **Forms & Email** | EmailJS |
| **Deployment** | Vercel |

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/PG300604/portfolio-website-vercel.git
cd portfolio-website-vercel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_ADMIN_SECRET=your_admin_secret
VITE_GH_TOKEN=your_github_personal_access_token
VITE_GH_OWNER=PG300604
VITE_GH_REPO=portfolio-data
VITE_GH_BRANCH=main

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
