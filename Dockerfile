FROM node:18-alpine as builder
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache git

WORKDIR /app
RUN git clone https://github.com/workfloworchestrator/orchestrator-ui.git
WORKDIR /app/orchestrator-ui
RUN git checkout 422-config-with-environment-variables-serverside

WORKDIR /app/orchestrator-ui
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /app/orchestrator-ui/apps/wfo-ui-surf

ENV ENVIRONMENT_NAME=Development!
ENV PROCESS_DETAIL_REFETCH_INTERVAL=10000000
ENV ORCHESTRATOR_API_HOST=https://orchestrator.dev.automation.surf.net
ENV ORCHESTRATOR_API_PATH=/api
ENV ORCHESTRATOR_GRAPHQL_HOST=https://orchestrator.dev.automation.surf.net
ENV ORCHESTRATOR_GRAPHQL_PATH=/api/graphql

EXPOSE 3000
CMD ["yarn", "start"]
