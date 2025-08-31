# Get Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (leverage caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5001

# Default command
CMD ["npm", "run", "dev"]
