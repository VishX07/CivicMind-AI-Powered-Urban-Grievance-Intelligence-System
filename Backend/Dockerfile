FROM node:24.11.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Excluding ai-service folder from the backend build via .dockerignore
EXPOSE 5000
CMD ["npm", "run", "dev"]
