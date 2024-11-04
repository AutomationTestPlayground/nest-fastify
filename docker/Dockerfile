# Build React frontend
FROM bitnami/node:20 as build-frontend
WORKDIR /app

# Copy source to image
COPY --chown=root:root ../frontend .

# Install package and build
RUN npm install -f && \
npm run build:prod


# Build NestJS backend
FROM bitnami/node:20 as build-backend
WORKDIR /app

# Copy source backend to image
COPY --chown=root:root ../config ./config
COPY --chown=root:root ../database ./database
COPY --chown=root:root ../other ./other
COPY --chown=root:root ../src ./src
COPY --chown=root:root ../.eslintrc.js ./
COPY --chown=root:root ../.prettierrc ./
COPY --chown=root:root ../nest-cli.json ./
COPY --chown=root:root ../package.json ./
COPY --chown=root:root ../tailwind.config.cjs ./
COPY --chown=root:root ../tsconfig.build.json ./
COPY --chown=root:root ../tsconfig.json ./
ARG ENV=
COPY --chown=root:root ../.env$ENV ./.env

# Copy source React frontend after builded to image
COPY --from=build-frontend /app/build/index.html ./other/views/administrator.hbs
COPY --from=build-frontend /app/build/. ./other/public/.

# Install package and build backend
ENV NODE_OPTIONS=--max_old_space_size=4048
RUN npm install ci && \
npm run build && \
npm cache clean --force

# Copy source Integration test backend
COPY --chown=root:root ../test ./test

# Copy source End to End test by Robot Framework for frontend
COPY --chown=root:root ../frontend/test ./robot

# If build image for Environment production not need install robot framework
ARG PROD=false
# Install Python 3 to image
RUN  if [ "$PROD" = "false" ] ; then install_packages python3; fi
# Install package and playwright
RUN  if [ "$PROD" = "false" ] ; then ln -sf python3 /usr/bin/python && \
pip3 install --no-cache -r robot/requirements.txt && \
npx playwright install-deps; fi

# Initial Robot Framework
RUN  if [ "$PROD" = "false" ] ; then rfbrowser init; fi

USER root

