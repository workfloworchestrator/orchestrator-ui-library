FROM node:18-alpine AS builder

# ENV NODE_ENV=production

WORKDIR /build
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:18-alpine AS runner

# ENV NODE_ENV=production

WORKDIR /app
COPY --chown=node --from=builder /build .

USER node
EXPOSE 3000
CMD cd /app/apps/wfo-ui && yarn start
