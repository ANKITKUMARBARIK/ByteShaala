# Get a computer with Node.js already installed
FROM node:18

# Create a folder called /app inside the box
WORKDIR /app

# Copy package.json into the box
COPY package.json .

# Install all the packages your app needs
RUN npm install

# Copy all your code into the box
COPY . .

# Tell the box "hey, this app uses port 5003"
EXPOSE 5005

# When the box starts, run this command
CMD ["npm", "run", "dev"]
