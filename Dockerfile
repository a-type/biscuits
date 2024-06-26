FROM node:18-alpine3.16 AS base
ENV CI=true

RUN npm install -g pnpm
WORKDIR /root/monorepo

# add git
RUN apk add --no-cache git

# missing dep for turbo - mentioned by @nathanhammond
# on https://github.com/vercel/turborepo/issues/2293
RUN apk add --no-cache libc6-compat

ENV CYPRESS_INSTALL_BINARY=0
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

ENV VITE_APP_GNOCCHI_ORIGIN=https://gnocchi.biscuits.club

FROM base as dev
COPY ./pnpm-lock.yaml .
RUN pnpm fetch

COPY . .

RUN pnpm install --filter . --frozen-lockfile
RUN pnpm install --filter "@biscuits/server..." --frozen-lockfile --unsafe-perm
RUN pnpm --filter "@biscuits/server..." run build

WORKDIR /root/monorepo/server
EXPOSE 3001
ENV NODE_ENV=production
ENTRYPOINT ["pnpm", "start"]
