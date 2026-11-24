# Maria AI Admin Dashboard

A standalone browser dashboard for the Maria AI admin API module.

## Folder structure

```text
maria-ai-admin/
├── index.html
├── css/admin.css
└── js/
    ├── dashboard.js
    ├── knowledge.js
    ├── uploads.js
    ├── conversations.js
    ├── analytics.js
    └── settings.js
```

## Setup

1. Extract `maria-ai-admin/` into your frontend project, beside (not inside) the existing `maria-ai/` user-facing assistant folder.
2. Ensure your Maria AI backend routes are deployed and mounted as documented in the backend integration package.
3. Open the dashboard through your frontend web server/hosting (not by double-clicking `index.html` if the browser blocks ES modules).
4. Sign in with `MARIA_AI_ADMIN_USERNAME` and `MARIA_AI_ADMIN_PASSWORD` configured on the backend.
5. If needed, open Settings and set the API base URL ending in `/api/v1`.

Default API base URL: `https://smmmaria-backend-production-4513.up.railway.app/api/v1`.

## Connected API routes

- `POST /maria-ai/admin/login`
- `GET /maria-ai/admin/dashboard`
- `GET /maria-ai/admin/knowledge`
- `POST /maria-ai/admin/knowledge`
- `PATCH /maria-ai/admin/knowledge/:id`
- `DELETE /maria-ai/admin/knowledge/:id`
- `GET /maria-ai/admin/conversations`

The admin API uses a separate Maria AI admin bearer token. It does not use the customer's SMMARIA JWT. The token is held in `sessionStorage` and cleared on sign-out or when the browser session ends.

## Current backend limitations (important)

This dashboard is designed for the backend integration module supplied with this project. That backend currently supports text and URL metadata records; it does not implement binary file uploads, remote webpage scraping, full conversation message retrieval, or detailed event analytics. The Media & Links page therefore registers a public URL and descriptive text as a knowledge record; it does not transfer a file to Firebase Storage. Conversation rows show metadata only because the current admin API exposes summaries, not individual messages. Unanswered questions are shown as not tracked because the current API returns a placeholder count of zero.

The knowledge search assistant only returns relevant published entries. It is not a generative model and does not call Gemini, OpenAI, or another hosted AI API.

## Security

- Keep Firebase service-account credentials and `.env` on the backend only.
- Serve this dashboard over HTTPS.
- Do not commit real passwords or tokens.
- The backend should enforce rate limiting and appropriate CORS settings.
