FROM node:14.17 as builder

#ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

# production stage
FROM node:14.17-alpine
USER node

WORKDIR /app
COPY --from=builder --chown=node:node /app ./

ENTRYPOINT ["npm", "run", "start"]