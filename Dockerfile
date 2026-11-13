FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_PUBLIC_BACKEND_URL=http://api:4000

COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

RUN npm run build --workspace=@typhoon/shared
WORKDIR /app/apps/frontend
RUN npm run build

# --- PRODUCTION RUNNER ---
FROM node:22-alpine AS runner

WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production

COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

RUN npm install --omit=dev

COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/frontend/next.config.js ./apps/frontend/next.config.js
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

WORKDIR /app/apps/frontend
CMD ["npm", "run", "start"]
