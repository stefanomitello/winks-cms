FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install

WORKDIR /app/apps/web

EXPOSE 5173

CMD ["pnpm", "dev"]
