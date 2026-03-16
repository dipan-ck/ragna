# ---------- build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install node-prune (Go binary, runs fast on Alpine)
RUN apk add --no-cache curl && \
    curl -sfL https://gobinaries.com/tj/node-prune | sh

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate && \
    npm run build && \
    # Prune dev deps first
    npm prune --omit=dev && \
    npm cache clean --force && \
    # Remove Prisma CLI and engines (not needed at runtime)
    rm -rf node_modules/@prisma/engines \
           node_modules/prisma \
           node_modules/.cache && \
    # Remove non-linux Prisma binaries
    find node_modules -name "query_engine-windows.dll.node" -delete && \
    find node_modules -name "*darwin*" -delete && \
    find node_modules -name "*debian*" -delete && \
    find node_modules -name "*.exe" -delete && \
    find node_modules -name "introspection-engine*" -delete && \
    find node_modules -name "migration-engine*" -delete && \
    find node_modules -name "prisma-fmt*" -delete && \
    # Run node-prune for deep cleanup (removes .md, .map, .ts, test dirs etc.)
    /usr/local/bin/node-prune

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl && \
    addgroup -S appgroup && \
    adduser -S -G appgroup appuser

COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=appuser:appgroup start.sh ./start.sh

RUN chmod +x start.sh

USER appuser
EXPOSE 5000
CMD ["./start.sh"]

# docker build -t dipan2003/ragna:latest .
# docker run -d --name ragna --env-file .env -p 5000:5000  --restart unless-stopped dipan2003/ragna:latest
