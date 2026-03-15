# Local Development Setup

## Server

### 1. Navigate to the server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL and Redis

```bash
docker compose up -d
```

Add to your `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ragna
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Run migrations and generate the Prisma client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the dev user

```bash
npx prisma db seed
```

This creates a test user via Better Auth. Copy the user ID that is logged and add it to your `.env`:

```env
DEV_USER_ID=<logged-user-id>
```

When `NODE_ENV=development` and `DEV_USER_ID` is set, all auth middleware is bypassed and requests are automatically attributed to this user — no login required.

### 6. Start the dev server and worker

In two separate terminals:

```bash
# terminal 1 — API server
npm run dev

# terminal 2 — embedding worker
npm run worker
```

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env


PORT=5000
NODE_ENV="development"

DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
DEV_USER_ID=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


REDIS_HOST=
REDIS_PORT=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=


PINECONE_API_KEY=
PINECONE_INDEX=

GEMINI_API_KEY=
```
