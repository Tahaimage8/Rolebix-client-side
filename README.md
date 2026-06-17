# Rolebix Client Side

Rolebix is a modern SaaS-style job marketplace platform built for job seekers, recruiters, and platform admins. The client application provides the public website, authentication screens, pricing flow, job discovery experience, and role-based dashboard UI for managing hiring workflows.

## Live Demo

* Client: https://rolebix-client-side.vercel.app
* Server: https://rolebix-server-side.vercel.app

## Demo Admin Access

For evaluation and testing only:

* Email: `admin@gmail.com`
* Password: `admin@gmail.com`

Recruiter and seeker accounts can also be created directly from the registration page.

> Note: These credentials are for demo/testing. Change or remove them before production deployment.

## Project Overview

Rolebix is designed as a full-featured job hunting portal where:

* Job seekers can browse jobs, create accounts, apply for jobs, and manage their career activity.
* Recruiters can register companies, post jobs, and manage hiring-related workflows.
* Admins can review companies, manage users, and supervise platform activity.

The current version focuses on the main public experience, authentication, pricing, job browsing with pagination, recruiter workflow foundations, and backend-connected data flow.

## Key Features

### Public Website

* Modern landing page with hero section, stats, CTA, and product sections.
* Public job browsing page with search, filters, company filter, and pagination.
* Job cards with company, title, description, location, salary, job type, skills, experience, and details link.
* Pricing page with seeker and recruiter plan sections.
* Responsive navigation and footer.

### Authentication

* Email/password authentication using Better Auth.
* Sign up and sign in pages.
* Role selection during registration for seeker/recruiter onboarding.
* Session-based protected dashboard flow.
* Admin client plugin configured for role management workflows.

### Job Discovery

* Server-side job pagination.
* Search by title, company, skill, category, type, location, and related fields.
* Filters for category, job type, experience level, work mode, and company.
* URL-based pagination and filtering for shareable job search states.

### Recruiter Foundation

* Recruiter dashboard route structure.
* Recruiter company registration flow.
* Recruiter job management foundation.
* Company status support: pending, approved, rejected.

### Admin Foundation

* Admin credential available for demo review.
* Admin-oriented company approval workflow supported through backend API.
* User role management groundwork through Better Auth admin client.

### Subscription Foundation

* Pricing plans for seekers and recruiters.
* Stripe package integrated in the client.
* Subscription save flow supported by the backend.

## Tech Stack

* Next.js
* React
* Tailwind CSS
* HeroUI
* React Icons
* Better Auth
* MongoDB
* Stripe
* React Toastify
* Vercel

## Main Routes

| Route                          | Description                             |
| ------------------------------ | --------------------------------------- |
| `/`                            | Public landing page                     |
| `/jobs`                        | Browse jobs with filters and pagination |
| `/jobs/:id`                    | Job details page                        |
| `/pricing`                     | Pricing plans                           |
| `/auth/register`               | User registration                       |
| `/auth/signin`                 | User sign in                            |
| `/dashboard`                   | Role-based dashboard layout             |
| `/dashboard/recruiter`         | Recruiter dashboard                     |
| `/dashboard/recruiter/company` | Recruiter company management            |
| `/dashboard/recruiter/jobs`    | Recruiter job management                |

## Environment Variables

Create a `.env.local` file in the client project root.

```env
NEXT_PUBLIC_BASE_URI=https://rolebix-server-side.vercel.app
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

For local development:

```env
NEXT_PUBLIC_BASE_URI=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
```

## Installation

```bash
git clone https://github.com/Tahaimage8/Rolebix-client-side.git
cd Rolebix-client-side
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the project for production.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs linting.

## Current Completion Status

### Completed

* Public landing page
* Public jobs page
* Job search and filtering
* Jobs pagination
* Pricing page
* Authentication UI
* Sign in and sign up flow
* Recruiter dashboard foundation
* Recruiter company flow foundation
* Backend API integration
* Toast notifications
* Responsive UI foundation
* Live Vercel deployment

### In Progress / Planned

* Public companies page
* Full seeker dashboard
* Full admin dashboard
* Admin user management polish
* Admin jobs moderation
* Admin payments dashboard
* Saved jobs system
* Resume upload
* Application status tracking UI
* Recruiter applicant management
* Email notifications
* Full billing and payment history
* Production-grade access control hardening

## Role Flow

### Seeker

A seeker can register, browse jobs, view job details, and use the platform as a candidate. The future roadmap includes saved jobs, application tracking, resume upload, and billing dashboard.

### Recruiter

A recruiter can register a company and manage job-related workflows. The future roadmap includes applicant review, status management, and job analytics.

### Admin

An admin can review platform activity and is intended to manage users, company approvals, jobs, and payments. Demo admin credentials are provided for evaluation.

## Project Requirement Coverage

Rolebix currently covers the core foundation of the job marketplace:

* Public job discovery
* Role-based authentication foundation
* Recruiter company workflow foundation
* Pricing and subscription foundation
* Server-backed job and company data
* Server-side jobs pagination

The remaining work mainly focuses on completing deeper dashboard workflows, saved jobs, billing history, applicant management, and admin analytics.

## Deployment

The client is deployed on Vercel.

Production URL:

```txt
https://rolebix-client-side.vercel.app
```

Make sure all required environment variables are configured in the Vercel project settings.

## Repository

```txt
https://github.com/Tahaimage8/Rolebix-client-side
```

## Notes for Reviewers

This project is actively being developed as a full-stack SaaS job marketplace. The current version demonstrates the main product direction, UI quality, authentication foundation, server-connected job browsing, pagination, pricing flow, and role-based dashboard structure.
