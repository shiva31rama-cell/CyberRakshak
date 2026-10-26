FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node backend/ ./
USER node

EXPOSE 5000
CMD ["node", "server.js"]
