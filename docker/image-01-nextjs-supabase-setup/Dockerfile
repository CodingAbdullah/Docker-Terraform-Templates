# Simple Next.js Development Dockerfile
# Run the following command: docker build -t nextjs-crud-app . to build the image

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all application files
COPY . .

# Expose Next.js port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=development

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
