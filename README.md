# ProjectInsight AI — Frontend

Web interface (Angular) for **ProjectInsight AI**, a platform for teachers and students to manage group projects, connect GitHub repositories, track individual contributions, and benefit from AI-powered code reviews.

This repository is the **frontend**. The associated backend (FastAPI) lives in a separate repository (`projectinsight-backend`).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running in Development](#running-in-development)
- [Production Build](#production-build)
- [Roles and Navigation](#roles-and-navigation)

---

## Overview

ProjectInsight AI allows a teacher to:
- create classes and student teams,
- track project progress and GitHub contributions per member,
- view AI-generated code quality reports.

And allows a student to:
- view their team and their role (leader / member),
- connect their personal GitHub account,
- connect their team's GitHub repository (Team Leader only),
- submit code (pasted or uploaded) for automated AI review (bugs, security flaws, anti-patterns, applicable fix suggestions).

## Features

| Module | Description |
|---|---|
| **Authentication** | Email/password login (JWT). No self-registration: accounts are created in cascade (Admin → Teacher → Student) |
| **AI Code Review** | Analysis of pasted code or uploaded files, findings ranked by severity, applicable fix suggestions |
| **My Team** | Team view: members, leader, GitHub status, contributions (commits / PRs) |
| **Connect Repository** | GitHub OAuth connection + selection of the team's repository and branch (Team Leader only) |
| **Class Management** | Class creation and tracking by the teacher |
| **Teams Management** | Team creation, member and leader assignment |
| **Students** | List and add students by class |
| **Notifications / Settings / Analytics** | Modules already scaffolded in the architecture (to be completed) |

## Tech Stack

- **Angular** (module-based architecture, `NgModule`, lazy loading)
- **TypeScript**
- **RxJS** (asynchronous stream handling, team cache via `shareReplay`)
- **SCSS** for styling (variables and dedicated component styles per feature)
- **Tailwind CSS** (utility classes where needed)
- **lucide-angular** for icons
- **Karma / Jasmine** for unit testing

## Project Architecture

```
src/app/
├── core/                     # Cross-cutting concerns for the whole app
│   ├── guards/                # AuthGuard, RoleGuard
│   ├── interceptors/          # JwtInterceptor (adds the Bearer token)
│   ├── models/                 # Shared TypeScript interfaces
│   └── services/                # HTTP calls to the FastAPI backend
│
├── layouts/                  # Visual shells per role
│   ├── student-layout/         # Header + student navigation
│   └── teacher-layout/         # Sidebar + teacher navigation
│
├── shared/
│   └── styles/                 # Shared SCSS styles (admin pages)
│
└── features/                 # One module per screen, lazy-loaded
    ├── auth/
    ├── student-dashboard/
    ├── my-team/
    ├── connect-repo/
    ├── ai-code-review/
    ├── analysis-history/
    ├── notifications/
    ├── settings/
    ├── teacher-dashboard/
    ├── class-management/
    ├── class-detail/
    ├── teams-management/
    ├── create-team/
    ├── students/
    ├── project-details/
    ├── analytics/
    └── teacher-notifications/
```

Each feature follows the same structure: `*.component.ts/.html/.scss`, `*.module.ts` and `*-routing.module.ts`, enabling on-demand loading (`loadChildren`) and clear isolation per functional domain.

The root routing (`app-routing.module.ts`) separates the `/student` and `/teacher` areas, each protected by `AuthGuard` (authenticated user) and `RoleGuard` (authorized role).

## Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher (LTS recommended)
- npm 9.x or higher
- [Angular CLI](https://angular.dev/tools/cli) installed globally:
  ```bash
  npm install -g @angular/cli
  ```
- The `projectinsight-backend` (FastAPI) running and reachable

## Installation

```bash
git clone https://github.com/HamzagithubNouri/ProjectInsightFrontend.git
cd ProjectInsightFrontend
npm install
```

## Configuration

The backend API URL is defined in the environment files:

```
src/environments/environment.ts
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000', // FastAPI backend address
};
```

> Adjust `apiUrl` to match the address and port the backend is running on (defaults to `http://localhost:8000` in development).

The backend must also allow the frontend's origin in its CORS settings (`http://localhost:4200` by default, already configured on the FastAPI side).

## Running in Development

```bash
ng serve
```

Then open [http://localhost:4200](http://localhost:4200).

The application automatically reloads on every source change.

## Production Build

```bash
ng build
```

The compiled artifacts are generated in `dist/projectinsight-ai/`.

## Roles and Navigation

| Role | Area | Specific access |
|---|---|---|
| **Student** | `/student/*` | View their team, link their GitHub account, run AI reviews. The **Repository** page is only visible to the *Team Leader* |
| **Teacher** | `/teacher/*` | Manage classes, teams, and students |
| **Admin** | — | Created only at the database level (no dedicated UI yet) — creates teacher accounts |

Navigation is handled through real Angular routes: each page maps to a URL, protected by `AuthGuard` (valid session) then `RoleGuard` (expected role, defined on the route via `data: { role: ... }`).

---

*Project built as part of an academic assignment — ProjectInsight AI.*
