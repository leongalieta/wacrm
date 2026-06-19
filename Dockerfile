FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG ENCRYPTION_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV PORT=3000
EXPOSE 3000

CMD ["npx", "next", "start", "--port", "3000"]
