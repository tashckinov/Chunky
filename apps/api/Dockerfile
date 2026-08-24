FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY apps/api apps/api
RUN npm run build -w @chunky/api
RUN npm prune --omit=dev

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S chunky && adduser -S chunky -G chunky
COPY --from=build --chown=chunky:chunky /app/package.json /app/package-lock.json ./
COPY --from=build --chown=chunky:chunky /app/node_modules ./node_modules
COPY --from=build --chown=chunky:chunky /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=chunky:chunky /app/apps/api/dist ./apps/api/dist
COPY --from=build --chown=chunky:chunky /app/apps/api/migrations ./apps/api/migrations

USER chunky
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "@chunky/api"]
