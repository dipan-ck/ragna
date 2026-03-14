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

### 3. Start the PostgreSQL container

```bash
bash scripts/initDatabase.sh
```

Copy the URL that is logged and add it to your `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/localdb
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

### 6. Start the dev server

```bash
npm run dev
```

---
