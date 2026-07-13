<div align="center">

# Rolebix Client

### A modern full-stack job marketplace for seekers, recruiters, and administrators.

[![Live App](https://img.shields.io/badge/Live_App-Rolebix-7c3aed?style=for-the-badge)](https://rolebix-client-side.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Frontend Repository:** https://github.com/Tahaimage8/Rolebix-client-side  
**Backend Repository:** https://github.com/Tahaimage8/Rolebix-server-side  
**Live Website:** https://rolebix-client-side.vercel.app

</div>

---

## Overview

Rolebix is a role-based career marketplace where job seekers can discover and track opportunities, recruiters can manage companies, jobs, and applicants, and administrators can monitor platform activity, moderate job listings, and review payment records.

The application uses the Next.js App Router, Better Auth, MongoDB, Stripe, Tailwind CSS, HeroUI, Motion, and a separate Express API.

## Core Features

### Public experience

- Responsive landing page with hero, feature, workflow, pricing, and CTA sections
- Job discovery with search and filters
- Job details pages
- Company discovery
- Pricing and subscription plans
- Responsive navbar and footer
- Dark, modern, mobile-friendly interface

### Authentication and account

- Email and password authentication with Better Auth
- MongoDB-backed sessions
- Role-based accounts
- Protected dashboard routes
- Editable `/profile` page
- Profile details, skills, preferences, social links, resume URL, and open-to-work status

### Job seeker workspace

- Personalized seeker dashboard
- Application statistics and recent activity
- Latest job opportunities
- Application history
- Individual application details
- Recruiter status tracking
- Application timeline
- Resume and cover-letter access

### Recruiter workspace

- Recruiter dashboard
- Company profile management
- Job creation and management
- Applicant list by company-owned jobs
- Candidate search and filtering
- Application status workflow:
  - Applied
  - Reviewing
  - Shortlisted
  - Interview
  - Hired
  - Rejected

### Admin workspace

- Platform overview dashboard
- User, job, company, application, and payment statistics
- Job moderation and status control
- Payment history and revenue summary
- Recent user, job, and payment activity
- Admin-only route protection

### Payments

- Stripe-based plan checkout
- Seeker and recruiter plans
- Subscription information stored in MongoDB
- Admin payment-history view
- Payment status, plan, currency, amount, and Stripe reference tracking

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 |
| UI runtime | React 19 |
| Styling | Tailwind CSS 4 |
| Components | HeroUI 3 |
| Authentication | Better Auth |
| Database access | MongoDB Node.js Driver |
| Payments | Stripe |
| Animation | Motion |
| Icons | Gravity UI Icons and React Icons |
| Notifications | React Toastify |
| Deployment | Vercel |

## Project Structure

```text
src/
├── app/
│   ├── api/                     # Next.js API proxies and auth routes
│   ├── auth/                    # Sign-in and registration
│   ├── dashboard/
│   │   ├── admin/               # Admin dashboard, jobs, payments
│   │   ├── recruiter/           # Recruiter workspace
│   │   └── seeker/              # Seeker workspace and applications
│   ├── jobs/                    # Job listing and details
│   ├── profile/                 # Editable user profile
│   └── page.js                  # Public homepage
├── components/
│   ├── dashboard/
│   ├── profile/
│   └── ...
├── lib/
│   ├── api/                     # Server-side API helpers
│   ├── core/                    # Session and fetch utilities
│   └── auth.js                  # Better Auth configuration
└── ...
```

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/jobs` | Browse jobs |
| `/jobs/[id]` | Job details |
| `/companies` | Browse companies |
| `/pricing` | Subscription plans |
| `/auth/register` | Create account |
| `/auth/signin` | Sign in |
| `/profile` | View and edit personal profile |
| `/dashboard/seeker` | Seeker dashboard |
| `/dashboard/seeker/applications` | Seeker application history |
| `/dashboard/seeker/applications/[id]` | Application details |
| `/dashboard/recruiter` | Recruiter dashboard |
| `/dashboard/recruiter/applications` | Recruiter applicant management |
| `/dashboard/admin` | Admin dashboard |
| `/dashboard/admin/jobs` | Admin job moderation |
| `/dashboard/admin/payments` | Admin payment history |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB database
- Running Rolebix backend
- Stripe account for payment testing

### Installation

```bash
git clone https://github.com/Tahaimage8/Rolebix-client-side.git
cd Rolebix-client-side
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_URI=http://localhost:5000

MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secure_random_secret

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

For production, use the deployed API URL:

```env
NEXT_PUBLIC_BASE_URI=https://rolebix-server-side.vercel.app
BETTER_AUTH_URL=https://rolebix-client-side.vercel.app
```

Never commit `.env.local` or production secrets.

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Backend Integration

The client communicates with the Rolebix Express API through:

```env
NEXT_PUBLIC_BASE_URI=http://localhost:5000
```

Server Components use authenticated server-side helpers, while browser updates such as profile editing and job-status moderation use protected Next.js proxy routes.

Backend repository:

```text
https://github.com/Tahaimage8/Rolebix-server-side
```

## Role Model

| Role | Main capabilities |
|---|---|
| Seeker | Browse jobs, apply, track applications, edit profile |
| Recruiter | Manage company, jobs, applicants, and hiring status |
| Admin | View platform metrics, moderate jobs, inspect payments |

## Deployment

The client is designed for deployment on Vercel.

1. Import the GitHub repository into Vercel.
2. Add all required environment variables.
3. Set the production backend URL in `NEXT_PUBLIC_BASE_URI`.
4. Deploy the project.
5. Add the production domain to the Better Auth trusted configuration when required.

## Development Notes

- This project is under active development.
- Use role-specific accounts when testing protected dashboards.
- Keep the frontend and backend environment URLs synchronized.
- Review every mutation route and CORS policy before a production launch.
- Do not expose Stripe, Better Auth, or MongoDB secrets in client-side code.

## Related Repository

Rolebix server:

```text
https://github.com/Tahaimage8/Rolebix-server-side
```

## License

This repository is currently maintained as a private learning and portfolio project. Add a project license before allowing external redistribution or commercial reuse.

---

<div align="center">

Built with Next.js, MongoDB, Better Auth, Stripe, and Tailwind CSS.

</div>