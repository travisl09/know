FROM node:latest
RUN useradd -ms /bin/sh -u 1001 app
USER app

WORKDIR /app
COPY --chown=app:app package.json package-lock.json ./
RUN npm update npm
RUN npm install

COPY --chown=app:app . /app

EXPOSE 5173