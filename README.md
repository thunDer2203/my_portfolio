# 🗂️ Portfolio as a Service

A full-stack **multi-user portfolio platform** where anyone can sign up and get their own personalized portfolio website at `yourdomain.com/<username>`.

Built with **Next.js**, **Express**, **PostgreSQL**, **Prisma**, and deployed on **Vercel**.

🔗 **Live Demo:** [my-portfolio-chi-orcin-71.vercel.app](https://my-portfolio-chi-orcin-71.vercel.app)

---

## ✨ Features

- **Multi-user support** — each user gets a public portfolio at `/<username>`
- **JWT-based auth** — register, login, logout with secure HttpOnly cookies
- **Admin CMS** — manage all portfolio sections from a dedicated dashboard
- **Cloudinary integration** — image uploads for projects and profile
- **Resume upload & download** — upload PDF resume, public download via `/<username>/download`
- **Contact form** — visitors can send messages stored in the database
- **Social links** — add and manage links to GitHub, LinkedIn, Twitter, etc.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Zustand |
| Backend | Node.js, Express 5, ESM modules |
| Database | PostgreSQL (NeonDB) via Prisma ORM |
| Storage | Cloudinary (images), Cloudinary (resume PDFs) |
| Auth | JWT (HttpOnly cookies), bcryptjs |
| Deployment | Vercel (frontend), any Node host (backend) |

---

## 📁 Project Structure

```
my_portfolio/
├── frontend/          # Next.js app
│   ├── app/           # App router pages
│   └── ...
└── backend/           # Express API server
    ├── index.js       # Entry point
    ├── routes/        # Route handlers
    │   ├── auth.route.js
    │   ├── about.route.js
    │   ├── project.route.js
    │   ├── skill.route.js
    │   ├── experience.route.js
    │   ├── social.route.js
    │   ├── resume.route.js
    │   ├── contact.route.js
    │   └── portfolio.route.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   ├── upload.middleware.js
    │   └── resumeUpload.js
    ├── lib/
    │   ├── db.js          # Prisma client
    │   └── utils.js       # JWT helpers
    └── prisma/
        └── schema.prisma  # Database schema
```

---

## 🗄️ Database Schema

The Prisma schema covers the following models, all scoped per user:

- **User** — name, email, username, title, role (`admin` / `user`)
- **About** — heading, content, optional profile image
- **Skill** — name, category, level (0–100), icon, description
- **Project** — title, slug, short/long description, image, GitHub/live URLs, tech stack, featured flag
- **Experience** — company, role, location, description, start/end dates, `currentlyWorking` flag
- **Education** — institution, degree, field, grade, years
- **Certificate** — title, issuer, issue date, credential URL, image
- **Achievement** — title, description
- **SocialLink** — platform, URL, icon
- **Resume** — title, Cloudinary file URL
- **ContactMessage** — name, email, subject, message, `isRead` flag

---

## 🔌 API Reference

All API routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | — | Create a new account |
| `POST` | `/login` | — | Login and set JWT cookie |
| `POST` | `/logout` | — | Clear JWT cookie |
| `GET` | `/check` | Cookie | Validate session, refresh token |
| `GET` | `/me` | Cookie | Get current user details |

### Portfolio (Public) — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get public user profile |

### About — `/api/about`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get about section by username |
| `GET` | `/secure` | ✅ | Get own about section |
| `POST` | `/` | ✅ | Create or replace about section |

### Projects — `/api/projects`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get projects by username |
| `GET` | `/secure` | ✅ | Get own projects |
| `POST` | `/` | ✅ | Replace all projects (accepts array) |

### Skills — `/api/skills`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get skills by username |
| `GET` | `/secure` | ✅ | Get own skills |
| `POST` | `/` | ✅ | Replace all skills (accepts array) |
| `DELETE` | `/:id` | ✅ | Delete a skill by ID |

### Experience — `/api/experience`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get experience by username |
| `GET` | `/secure` | ✅ | Get own experience |
| `POST` | `/` | ✅ | Replace all experiences (accepts array) |

### Social Links — `/api/socials`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:username` | — | Get socials by username |
| `GET` | `/secure` | ✅ | Get own socials |
| `POST` | `/` | ✅ | Replace all socials (accepts array) |

### Resume — `/api/resume`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get own resume metadata |
| `GET` | `/:username/download` | — | Redirect to resume file (public) |
| `POST` | `/upload` | ✅ | Upload resume PDF to Cloudinary |

### Contact — `/api/contact`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | — | Submit a contact message |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g. [NeonDB](https://neon.tech))
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/thunDer2203/my_portfolio.git
cd my_portfolio
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

Run migrations and start:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## 🚀 Deployment

- **Frontend** — deploy to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` to your backend URL in Vercel's environment variables.
- **Backend** — deploy to Railway, Render, or any Node-compatible host. Set all `.env` variables in the platform's dashboard.
- **Database** — [NeonDB](https://neon.tech) recommended (free tier available).
- After deploying the backend, run `npx prisma migrate deploy` to apply migrations in production.

---

## 🔒 Reserved Usernames

The following usernames cannot be registered to avoid routing conflicts:

- `secure`
- `secured`

---

## 📄 License

MIT — feel free to fork and build your own portfolio platform on top of this.
