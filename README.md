# Shanbel Dires Portfolio

Database-driven portfolio and admin dashboard for Shanbel Dires, built with React, Express, Prisma, and PostgreSQL.

The portfolio content is loaded from PostgreSQL through the backend API. There is no frontend demo-data fallback and no JSON file used as a portfolio or contact-message store.

## Features

- Responsive React portfolio built with Vite and Tailwind CSS
- PostgreSQL-backed profile, social links, portfolio sections, footer settings, CV, and contact messages
- Admin dashboard for managing portfolio content
- JWT access-token and HTTP-only refresh-token authentication
- Password reset workflow through Nodemailer
- Cloudinary image upload integration
- Prisma schema and CRUD services
- Credentials-only Prisma seed script

## Project structure

```text
My-Portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── portfolio/
│   │   ├── config/
│   │   │   └── iconMap.js
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   └── services/
    ├── .env.example
    └── package.json
```

## Requirements

- Node.js 20 or newer
- PostgreSQL
- SMTP account for contact notifications and password reset email
- Cloudinary account if image uploads are required

## Backend setup

Open a terminal in `backend/`:

```bash
npm install
```

Copy `.env.example` to `.env` and configure the required values:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret

ADMIN_NAME=Shanbel Dires
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=use-a-strong-admin-password
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are used only by the credentials seed script. The password is bcrypt-hashed before it is stored in the PostgreSQL `users` table. Do not commit `.env` or share its values.

Generate the Prisma client and apply the schema:

```bash
npm run prisma:generate
npm run prisma:push
```

Store or replace the database admin credentials:

```bash
npm run prisma:seed
```

The seed script only upserts the admin `User` record. It does not insert default profile, footer, project, experience, certificate, or social data.

Start the backend:

```bash
npm run dev
```

The API runs at [http://localhost:5000](http://localhost:5000). The health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Frontend setup

Open another terminal in `frontend/`:

```bash
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The admin login is available at [http://localhost:5173/admin/login](http://localhost:5173/admin/login). Use the email and password stored by `npm run prisma:seed`.

## Database-backed content

The public portfolio reads content from the following PostgreSQL models:

- `Profile`
- `SocialChannel`
- `Specialization`
- `Experience`
- `Project`
- `Certificate`
- `PortfolioSettings`
- `ContactMessage`

Admin changes are sent to the backend API and persisted with Prisma. If the database request fails, the UI reports the error rather than silently replacing the data with demo content.

Footer content, including quick links, social URLs, the email label, and the location label, is stored in `PortfolioSettings` and `SocialChannel` records.

## Useful commands

### Backend

```bash
npm run dev
npm start
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Security notes

- Never commit `.env` files or database connection strings.
- Never place plaintext passwords in source code or seed files.
- The seed reads credentials from environment variables and stores only a bcrypt hash.
- Rotate any database password that has been exposed publicly.
- Keep JWT secrets long, random, and different across environments.
