FROM node:22-alpine
ENV CI=true

RUN npm install -g pnpm@9.15.0
WORKDIR /usr/src/app

# add git
# and libc6-compat - missing dep for turbo - mentioned by @nathanhammond
# on https://github.com/vercel/turborepo/issues/2293
RUN apk add --no-cache git libc6-compat py3-pip g++ make dumb-init

ENV CYPRESS_INSTALL_BINARY=0
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

ENV VITE_APP_GNOCCHI_ORIGIN=https://gnocchi.biscuits.club

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./.npmrc .
COPY ./tsconfig.json .
COPY ./turbo.json .
RUN pnpm fetch

COPY --chown=node:node packages ./packages
COPY --chown=node:node server ./server
COPY --chown=node:node apps/gnocchi ./apps/gnocchi
COPY --chown=node:node apps/wish-wash ./apps/wish-wash

RUN pnpm install --filter .
RUN pnpm install --filter "@biscuits/server..."
RUN pnpm --filter "@biscuits/server..." run build

WORKDIR /usr/src/app/server
EXPOSE 3001
ENV NODE_ENV=production
USER node
ENTRYPOINT ["dumb-init", "node", "--conditions=production", "./dist/server.js"]
