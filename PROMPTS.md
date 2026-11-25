# What I asked the AI

Keep a short log. One entry per prompt is enough.

| What I asked (paste or summarize) | What happened | What I had to fix or check |
| --- | --- | --- |
| Set up `.env` for `riwookim_myapp` and verify database connection | Copied `.env.example` to `.env`, created `riwookim_myapp`, and ran `npm run create-db` and `npm run check` | Verified `OK: connected to IS-INFO430, database riwookim_myapp` and confirmed `.env` is ignored by git |
| Read `AGENTS.md` and `IDEA.md`, build `web/index.html` and `server/server.js` for the Job Application Tracker with a status filter dropdown and made-up rows | Generated the Express server and initial UI table with 3 sample rows | Ran `npm start` and verified the layout on `http://localhost:3000` |
| Read `AGENTS.md`, `IDEA.md`, `server/server.js`, and `web/index.html`, design tables with PK/FK (`dbo.Companies` and `dbo.Applications`), seed 20 rows (`db/load.js`), write parameterized `@Status` query (`db/queries.sql`), and connect `/api/applications` and `web/index.html` | Created normalized schema with foreign key, seeded 20 companies and 20 applications, and wired `/api/applications?status=...` using parameterized SQL | Ran `node db/load.js`, restarted server with `npm start`, and verified all 20 database rows and status filter dropdown work on the page |