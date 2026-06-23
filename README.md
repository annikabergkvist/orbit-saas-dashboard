# Orbit

**Orbit** is a B2B project-tracking dashboard demo for product and engineering teams. It showcases a glass UI, dark mode, and realistic workflows across projects, issues, team, and messaging — built as a portfolio piece with seed data and browser-local persistence.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19, TypeScript, Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com) (Base UI flavor)
- Recharts, dnd-kit

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) — use any password to sign in (demo auth).

## App areas

| Route | Description |
|-------|-------------|
| `/` | Dashboard — KPIs, activity chart, issues by status, meetings, tasks |
| `/projects` | Project overview with filters |
| `/projects/[slug]` | Board, list, calendar, files, overview |
| `/issues` | Issue backlog with filters, bulk actions, detail panel |
| `/team` | Team roster, workload, profile bios |
| `/messages` | Team DMs tied to work items |
| `/settings` | Profile, account, notifications, appearance, integrations |

## Demo persistence

Changes are saved to `localStorage` (issues, board tasks, profile, integrations, notifications, messages). Connect **Google Calendar** under Settings → Integrations to unlock **My Meetings** on the dashboard.

## Data model notes

- **Issues** (`issues-data.ts`) — cross-project backlog used on `/issues` and linked from project list views.
- **Board tasks** (`projects-data.ts`) — per-project kanban cards; drag-and-drop persists per project slug.
- **Team** (`team-data.ts`) — single roster for assignees, settings profile, and team pages.

In production these would be unified via a backend API; here they are intentionally separate demo datasets with list views bridging both on project pages.

## License

Portfolio demo — not licensed for production use.
