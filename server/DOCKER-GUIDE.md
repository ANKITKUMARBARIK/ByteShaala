# 🐳 Docker Guide for Beginners - ByteShaala Microservices

## 📚 Table of Contents

1. [What the Hell is Docker?](#what-the-hell-is-docker)
2. [File Structure](#file-structure)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Dockerfile Explained](#dockerfile-explained)
5. [Docker Compose Explained](#docker-compose-explained)
6. [Commands Cheat Sheet](#commands-cheat-sheet)
7. [Daily Workflow](#daily-workflow)
8. [Troubleshooting](#troubleshooting)

---

## 🤔 What the Hell is Docker?

### Simple Analogy

Think of Docker like **virtual boxes** for your apps:

- Each service runs in its own **separate box**
- Each box has everything it needs (Node.js, your code, dependencies)
- Boxes can talk to each other
- You can start/stop boxes individually or all together

### Before Docker (The Pain)

```bash
# You had to do this manually every time:
cd api-gateway && npm run dev &
cd auth-service && npm run dev &
cd user-service && npm run dev &
cd notification-service && npm run dev &
# Start RabbitMQ somehow...
# Pray everything works together...
```

### With Docker (The Magic)

```bash
# Now you just do this:
docker-compose up
```

---

## 📁 File Structure

Your project should look like this:

```
server/
├── docker-compose.yml          # The TV remote (controls all services)
├── api-gateway/
│   ├── Dockerfile             # Recipe for API Gateway box
│   ├── package.json
│   └── src/
├── auth-service/
│   ├── Dockerfile             # Recipe for Auth Service box
│   ├── package.json
│   └── src/
├── user-service/
│   ├── Dockerfile             # Recipe for User Service box
│   ├── package.json
│   └── src/
└── notification-service/
    ├── Dockerfile             # Recipe for Notification Service box
    ├── package.json
    └── src/
```

---

## 🛠️ Step-by-Step Setup

### Step 1: Create Dockerfile in Each Service

**Location**: Create in each service folder (api-gateway, auth-service, etc.)

**What it does**: Instructions to build a container for each service

**Content** (same for all services, just change the port):

```dockerfile
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

# Tell the box "hey, this app uses port XXXX"
EXPOSE 5005  # Change this: 5005 for api-gateway, 5001 for auth-service, etc.

# When the box starts, run this command
CMD ["npm", "run", "dev"]
```

### Step 2: Create docker-compose.yml in Root

**Location**: In your `server/` directory (root level)

**What it does**: The master controller that starts all services together

**Content**:

```yaml
# This file tells Docker "start all these services together"
version: "3.8"

services:
  # Service 1: API Gateway (your main entry point)
  api-gateway:
    build: ./api-gateway # Build from api-gateway folder
    ports:
      - "5005:5005" # Outside:Inside port mapping
    depends_on:
      - rabbitmq # Wait for rabbitmq to start first

  # Service 2: Auth Service (handles login/signup)
  auth-service:
    build: ./auth-service # Build from auth-service folder
    ports:
      - "5001:5001" # Outside:Inside port mapping
    depends_on:
      - rabbitmq # Wait for rabbitmq to start first

  # Service 3: User Service (handles user data)
  user-service:
    build: ./user-service # Build from user-service folder
    ports:
      - "5002:5002" # Outside:Inside port mapping
    depends_on:
      - rabbitmq # Wait for rabbitmq to start first

  # Service 4: Notification Service (sends notifications)
  notification-service:
    build: ./notification-service # Build from notification-service folder
    ports:
      - "5003:5003" # Outside:Inside port mapping
    depends_on:
      - rabbitmq # Wait for rabbitmq to start first

  # Service 5: RabbitMQ (message broker - helps services talk)
  rabbitmq:
    image: rabbitmq:3-management # Use pre-built RabbitMQ from Docker Hub
    ports:
      - "5672:5672" # For services to connect
      - "15672:15672" # Web UI at localhost:15672
```

---

## 📦 Dockerfile Explained (Line by Line)

### What is a Dockerfile?

A **recipe** that tells Docker how to build a container for your service.

### Each Line Explained:

```dockerfile
# Get a computer with Node.js already installed
FROM node:18
```

- **What it does**: Downloads a pre-built computer with Node.js 18
- **Why**: Your app needs Node.js to run
- **Analogy**: "Give me a kitchen with an oven already installed"

```dockerfile
# Create a folder called /app inside the box
WORKDIR /app
```

- **What it does**: Creates and moves to `/app` directory
- **Why**: Keeps your code organized in one place
- **Analogy**: "Work in the kitchen counter, not the floor"

```dockerfile
# Copy package.json into the box
COPY package.json .
```

- **What it does**: Copies your `package.json` file into the container
- **Why**: Docker needs to know what dependencies to install
- **Analogy**: "Copy the recipe ingredients list first"

```dockerfile
# Install all the packages your app needs
RUN npm install
```

- **What it does**: Installs all dependencies listed in package.json
- **Why**: Your app won't work without its dependencies
- **Analogy**: "Buy all the ingredients before cooking"

```dockerfile
# Copy all your code into the box
COPY . .
```

- **What it does**: Copies all your source code into the container
- **Why**: The container needs your actual code to run
- **Analogy**: "Put all your cooking ingredients in the kitchen"

```dockerfile
# Tell the box "hey, this app uses port 5005"
EXPOSE 5005
```

- **What it does**: Documents that this app listens on port 5005
- **Why**: Other services and Docker need to know which port to connect to
- **Analogy**: "Put a sign on your restaurant door showing the address"

```dockerfile
# When the box starts, run this command
CMD ["npm", "run", "dev"]
```

- **What it does**: Defines the command to start your app
- **Why**: Docker needs to know how to start your service
- **Analogy**: "When you open the restaurant, turn on the stove and start cooking"

---

## 🎛️ Docker Compose Explained (Line by Line)

### What is Docker Compose?

A **TV remote control** for all your containers. Instead of starting 5 services manually, press ONE button.

### Each Section Explained:

```yaml
version: "3.8"
```

- **What it does**: Tells Docker which version of compose format to use
- **Why**: Different versions have different features
- **Analogy**: "I'm speaking English version 2024, not Old English"

```yaml
services:
```

- **What it does**: Starts the list of all services
- **Why**: Docker needs to know what services to manage
- **Analogy**: "Here's the list of all restaurants in the food court"

```yaml
api-gateway:
  build: ./api-gateway
```

- **What it does**: Creates a service named "api-gateway" and builds it from the ./api-gateway folder
- **Why**: Docker needs to know where your code is
- **Analogy**: "Build the pizza restaurant using the recipe in the pizza folder"

```yaml
ports:
  - "5005:5005"
```

- **What it does**: Maps port 5005 on your computer to port 5005 in the container
- **Format**: "outside:inside"
- **Why**: So you can access the service from your browser
- **Analogy**: "Connect the restaurant's phone (inside) to the public phone number (outside)"

```yaml
depends_on:
  - rabbitmq
```

- **What it does**: Tells Docker "start rabbitmq before starting this service"
- **Why**: Your services need RabbitMQ to communicate
- **Analogy**: "Make sure the mail service is running before opening the restaurants"

```yaml
image: rabbitmq:3-management
```

- **What it does**: Downloads a pre-built RabbitMQ container from Docker Hub
- **Why**: RabbitMQ is complex software, easier to use ready-made version
- **Analogy**: "Buy a ready-made cake instead of baking from scratch"

---

## 🚀 Commands Cheat Sheet

### Starting Services

```bash
# Start all services (first time or after changes)
docker-compose up

# Start all services in background (recommended)
docker-compose up -d

# Start all services and rebuild (after code changes)
docker-compose up --build

# Start all services in background and rebuild
docker-compose up -d --build
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop all services and remove volumes (clean slate)
docker-compose down -v
```

### Individual Service Control

```bash
# Restart just one service
docker-compose restart api-gateway
docker-compose restart auth-service
docker-compose restart user-service
docker-compose restart notification-service

# Stop just one service
docker-compose stop api-gateway

# Start just one service (if stopped)
docker-compose start api-gateway

# Rebuild and restart one service
docker-compose up -d --build api-gateway
```

### Monitoring and Debugging

```bash
# See all running services
docker-compose ps

# See logs of all services
docker-compose logs

# See logs of one service
docker-compose logs api-gateway

# Follow logs in real-time (like tail -f)
docker-compose logs -f api-gateway

# See last 50 lines of logs
docker-compose logs --tail=50 auth-service

# See logs of multiple services
docker-compose logs api-gateway auth-service
```

### Useful Docker Commands

```bash
# See all running containers
docker ps

# See all containers (running and stopped)
docker ps -a

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# See disk usage
docker system df

# Clean up everything (be careful!)
docker system prune -a
```

---

## 📅 Daily Workflow

### Morning Routine

```bash
# Navigate to your project
cd /Users/aveshhasanfattta/Desktop/Avesh/practice/v2/ByteShaala/server

# Start everything
docker-compose up -d

# Check if everything is running
docker-compose ps

# Check logs if something looks wrong
docker-compose logs
```

### During Development

```bash
# Working on auth-service? Make your code changes, then:
docker-compose restart auth-service

# Check if your changes worked:
docker-compose logs -f auth-service

# Working on multiple services?
docker-compose restart api-gateway auth-service
```

### When Things Break

```bash
# See what's running
docker-compose ps

# Check logs of problematic service
docker-compose logs auth-service

# Restart the problematic service
docker-compose restart auth-service

# If still broken, rebuild it
docker-compose up -d --build auth-service

# Nuclear option - restart everything
docker-compose down
docker-compose up -d --build
```

### Evening Routine

```bash
# Stop everything to free up resources
docker-compose down

# Or if you want to keep them running
# (they'll auto-start next time you boot your computer)
# Just close your terminal
```

---

## 🌐 Access Points

After running `docker-compose up -d`, you can access:

- **API Gateway**: http://localhost:5005
- **Auth Service**: http://localhost:5001
- **User Service**: http://localhost:5002
- **Notification Service**: http://localhost:5003
- **RabbitMQ Management UI**: http://localhost:15672
  - Username: `guest`
  - Password: `guest`

---

## 🔧 When to Use Which Command

### Code Changes (JavaScript/TypeScript files)

```bash
# Just restart the service
docker-compose restart auth-service
```

### Package.json Changes (new dependencies)

```bash
# Rebuild the service
docker-compose up -d --build auth-service
```

### Dockerfile Changes

```bash
# Rebuild the service
docker-compose up -d --build auth-service
```

### docker-compose.yml Changes

```bash
# Restart everything
docker-compose down
docker-compose up -d
```

### Environment Variable Changes

```bash
# Restart the affected service
docker-compose restart auth-service
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### "Port already in use"

```bash
# Find what's using the port
lsof -i :5005

# Kill the process or change the port in docker-compose.yml
```

#### "Service won't start"

```bash
# Check logs
docker-compose logs auth-service

# Common fixes:
docker-compose restart auth-service
docker-compose up -d --build auth-service
```

#### "Can't connect to RabbitMQ"

```bash
# Make sure RabbitMQ is running
docker-compose ps

# Restart RabbitMQ
docker-compose restart rabbitmq

# Check RabbitMQ logs
docker-compose logs rabbitmq
```

#### "Changes not reflecting"

```bash
# For code changes
docker-compose restart service-name

# For dependency changes
docker-compose up -d --build service-name

# Nuclear option
docker-compose down
docker-compose up -d --build
```

#### "Out of disk space"

```bash
# Clean up unused containers and images
docker system prune

# More aggressive cleanup (removes everything not currently used)
docker system prune -a
```

---

## 🎯 Key Concepts to Remember

### Build vs Image

- **build**: Creates container from YOUR code (uses Dockerfile)
- **image**: Downloads ready-made container from Docker Hub

### Port Mapping

- **"5005:5005"**: outside port : inside port
- **Outside**: What you access from your browser
- **Inside**: What the app listens to inside the container

### Dependencies

- **depends_on**: Service A waits for Service B to start
- **RabbitMQ**: Message broker that helps services communicate

### Commands

- **up**: Start services
- **down**: Stop services
- **restart**: Restart services
- **logs**: See what's happening
- **ps**: See what's running

---

## 🎉 Success Indicators

You know everything is working when:

1. **docker-compose ps** shows all services as "Up"
2. **http://localhost:5005** shows your API Gateway
3. **http://localhost:15672** shows RabbitMQ management UI
4. **docker-compose logs** shows no error messages
5. Your services can communicate with each other

---

## 📞 Quick Reference

### Most Used Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# Restart one service
docker-compose restart api-gateway

# See logs
docker-compose logs -f api-gateway

# See what's running
docker-compose ps

# Rebuild after changes
docker-compose up -d --build api-gateway
```

### File Locations

- **docker-compose.yml**: `/server/docker-compose.yml`
- **Dockerfiles**: `/server/[service-name]/Dockerfile`

### Ports

- API Gateway: 5005
- Auth Service: 5001
- User Service: 5002
- Notification Service: 5003
- RabbitMQ: 5672 (services), 15672 (web UI)

---

**Remember**: Docker is just a tool to make your development life easier. Instead of manually starting 5 services, you start them all with one command! 🚀
