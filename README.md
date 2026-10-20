# Shanbel Dires - Portfolio & Admin System

Modern, high-performance portfolio application for **Shanbel Dires** (Full-Stack Software Engineer & Network Architect), featuring modular React architecture, a dynamic database-driven content pipeline, JWT Access/Refresh token authentication, an Admin Dashboard, Nodemailer email contact integration, and Cloudinary media management.

---

## 📁 Project Architecture

```
Portfolio/
├── frontend/                     # Modular React Application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # Admin Layout, ProtectedRoute
│   │   │   ├── layout/           # Sticky Navbar, Glassmorphism Footer
│   │   │   └── portfolio/        # Hero, About, Specializations, Experience, Projects, Certificates, Contact, UniversalModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Access / Refresh token session state
│   │   │   └── PortfolioContext.jsx # Live DB state with resilient demo fallback
│   │   ├── data/
│   │   │   └── defaultPortfolioData.js # Original, full dataset used as zero-downtime fallback
│   │   ├── pages/
│   │   │   ├── PortfolioHome.jsx # Main portfolio single-page application
│   │   │   └── admin/            # Login, Forgot Password, Reset Password, Dashboard
│   │   ├── services/
│   │   │   └── api.js            # Axios client with automatic 401 token refresh interceptor
│   │   ├── App.jsx               # Client routes & dark mode
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── backend/                      # Node.js + Express API (PostgreSQL + Cloudinary + Nodemailer)
    ├── src/
    │   ├── config/               # DB, Cloudinary & Mailer setups
    │   ├── middleware/           # Auth tokens, Multer image upload
    │   ├── routes/               # Auth, Portfolio, Contact, Upload
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Key Features

1. **Fully Modularized Frontend**:
   - Zero hardcoded text in components. Every section receives dynamic data from `PortfolioContext`.
   - **Resilient Fallback**: If PostgreSQL or Express is loading, offline, or returns empty records, the system seamlessly displays your complete default portfolio data.
   - Preserves all original styles, brand colors (LinkedIn `#0A66C2`, Telegram `#229ED9`, Gmail `#EA4335`, GitHub `#181717`), carousels, and responsive layouts.

2. **Admin Dashboard (`/admin/dashboard`)**:
   - **Security**: Dual-token authentication with short-lived Access Tokens and HTTP-only Refresh Tokens.
   - **Password Recovery**: Complete Forgot Password & Reset Password workflows.
   - **Full Content Management**:
     - **Profile & Hero**: Edit avatar, name, role, university, location, about narrative, and statistics.
     - **Projects**: Add, edit, and delete projects with Cloudinary image upload, tags, and source code links.
     - **Certificates**: Add, edit, and delete credentials with certificate image upload and verified skill checklists.
     - **Specializations**: Manage learning tracks, technical scope, and competencies.
     - **Experience**: Manage career history, leadership positions, achievements, and tech stacks.
     - **Contact Inquiries**: Review visitor messages submitted via the contact form.

3. **Email & Cloudinary Ready**:
   - Contact form sends emails via Nodemailer and stores them in PostgreSQL.
   - Image upload pipeline directly uploads media to Cloudinary.

---

## 🛠️ How to Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
5. To access the Admin Portal, visit [http://localhost:5173/admin/login](http://localhost:5173/admin/login) or click the **Admin** badge in the navigation bar.
