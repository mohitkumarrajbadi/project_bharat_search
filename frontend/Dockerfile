# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
