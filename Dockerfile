# Base image
FROM node:18

# Install necessary system dependencies for building native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-dev \
    unixodbc-dev

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application
COPY . .

# Ensure that necessary files are available for Next.js build
COPY tailwind.config.ts postcss.config.mjs ./  

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
