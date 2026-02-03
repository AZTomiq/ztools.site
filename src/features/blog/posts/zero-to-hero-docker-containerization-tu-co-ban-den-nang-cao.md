---
title: "Zero to Hero: Docker - Containerization Từ Cơ Bản đếN Nâng Cao"
date: 2025-06-26T08:59:38.000Z
tags: [CI/CD, Cloud Native, Containerization, DevOps, Docker, Kubernetes, Microservices, Orchestration]
categories: [DevOps, Docker, Containerization]
---

# Zero to Hero: Docker - Containerization từ cơ bản đến nâng cao

Docker là nền tảng containerization hàng đầu, giúp đóng gói ứng dụng và dependencies thành các container độc lập, portable và scalable.

## 1\. Giới thiệu và khái niệm cơ bản

### Docker là gì?

Docker là nền tảng containerization cho phép đóng gói ứng dụng cùng với tất cả dependencies vào một container nhẹ, portable và có thể chạy trên bất kỳ môi trường nào có Docker engine.

### Đặc điểm chính:

*   **Portable**: Chạy nhất quán trên mọi môi trường
*   **Lightweight**: Chia sẻ kernel với host, nhẹ hơn VM
*   **Isolated**: Mỗi container độc lập và an toàn
*   **Scalable**: Dễ dàng scale up/down
*   **Versioned**: Quản lý version và rollback dễ dàng
*   **Fast**: Khởi động và deploy nhanh chóng

### Use cases phổ biến:

*   **Application Development**: Môi trường dev nhất quán
*   **Microservices**: Deploy từng service độc lập
*   **CI/CD Pipelines**: Automated testing và deployment
*   **Cloud Migration**: Lift and shift applications
*   **DevOps**: Infrastructure as Code
*   **Edge Computing**: Deploy trên edge devices

### Docker vs Virtual Machines

```bash
# Virtual Machine
Host OS → Hypervisor → Guest OS → App + Dependencies

# Docker Container
Host OS → Docker Engine → App + Dependencies
```

### Docker Architecture

```bash
# Docker Client
docker build, docker run, docker pull

# Docker Daemon
Container runtime, image management

# Docker Registry
Docker Hub, private registries

# Docker Objects
Images, containers, networks, volumes
```

### Container Lifecycle

```bash
# 1. Create image
docker build -t myapp:latest .

# 2. Run container
docker run -d -p 8080:80 myapp:latest

# 3. Manage container
docker ps, docker logs, docker exec

# 4. Stop container
docker stop container_id

# 5. Remove container
docker rm container_id
```

## 2\. Cài đặt và setup môi trường

### Docker Desktop Installation

```bash
# macOS
brew install --cask docker

# Windows
# Download from https://www.docker.com/products/docker-desktop

# Ubuntu
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### Docker Engine Installation

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Docker Compose Installation

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Docker Registry Setup

```bash
# Run local registry
docker run -d -p 5000:5000 --name registry registry:2

# Push to local registry
docker tag myapp:latest localhost:5000/myapp:latest
docker push localhost:5000/myapp:latest

# Pull from local registry
docker pull localhost:5000/myapp:latest
```

### Docker Configuration

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.gcr.io"],
  "insecure-registries": ["localhost:5000"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

### VS Code Docker Extension

```json
{
  "recommendations": [
    "ms-azuretools.vscode-docker",
    "ms-vscode-remote.remote-containers"
  ]
}
```

## 3\. Cú pháp và cấu trúc cơ bản

### Dockerfile Basics

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Run application
CMD ["npm", "start"]
```

### Multi-stage Builds

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Commands

```bash
# Image commands
docker images                    # List images
docker rmi image_id             # Remove image
docker tag source target        # Tag image
docker save image > file.tar    # Save image
docker load < file.tar          # Load image

# Container commands
docker ps                       # List running containers
docker ps -a                    # List all containers
docker run -d image             # Run container in background
docker stop container_id        # Stop container
docker start container_id       # Start container
docker restart container_id     # Restart container
docker rm container_id          # Remove container
docker logs container_id        # View logs
docker exec -it container_id sh # Execute command in container

# System commands
docker system df                # Disk usage
docker system prune             # Clean up
docker info                     # System information
docker version                  # Version information
```

### Docker Run Options

```bash
# Basic run
docker run nginx

# Interactive mode
docker run -it ubuntu bash

# Detached mode
docker run -d nginx

# Port mapping
docker run -p 8080:80 nginx

# Volume mounting
docker run -v /host/path:/container/path nginx

# Environment variables
docker run -e VAR=value nginx

# Container name
docker run --name my-container nginx

# Network
docker run --network my-network nginx

# Resource limits
docker run --memory=512m --cpus=1 nginx
```

### Docker Networks

```bash
# Create network
docker network create my-network

# List networks
docker network ls

# Inspect network
docker network inspect my-network

# Connect container to network
docker network connect my-network container_id

# Disconnect container from network
docker network disconnect my-network container_id

# Remove network
docker network rm my-network
```

### Docker Volumes

```bash
# Create volume
docker volume create my-volume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-volume

# Remove volume
docker volume rm my-volume

# Mount volume
docker run -v my-volume:/app/data nginx

# Bind mount
docker run -v /host/path:/container/path nginx
```

## 4\. Các tính năng nâng cao

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Join worker node
docker swarm join --token <token> <manager-ip>:2377

# Create service
docker service create --name web --replicas 3 nginx

# Scale service
docker service scale web=5

# Update service
docker service update --image nginx:latest web

# Remove service
docker service rm web

# Leave swarm
docker swarm leave --force
```

### Docker Secrets

```bash
# Create secret
echo "mysecretpassword" | docker secret create db_password -

# Use secret in service
docker service create \
  --name db \
  --secret db_password \
  postgres:15

# In docker-compose.yml
secrets:
  db_password:
    external: true

services:
  db:
    image: postgres:15
    secrets:
      - db_password
```

### Docker Health Checks

```dockerfile
# In Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# In docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Docker BuildKit

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Use in Dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine
RUN --mount=type=cache,target=/root/.npm \
    npm install
```

### Docker Security

```dockerfile
# Non-root user
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Security scanning
# docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
#   aquasec/trivy image myapp:latest
```

## 5\. Best practices và patterns

### Dockerfile Best Practices

```dockerfile
# Use specific base image
FROM node:18.17.0-alpine3.18

# Set working directory
WORKDIR /app

# Copy package files first (caching)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use exec form for CMD
CMD ["npm", "start"]
```

### Multi-stage Builds

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Test stage
FROM builder AS test
RUN npm run test

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Patterns

```yaml
# Development
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

# Production
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
```

### Security Best Practices

```dockerfile
# Use specific base image
FROM node:18.17.0-alpine3.18

# Update packages
RUN apk update && apk upgrade

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy files as non-root
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Don't run as root
CMD ["npm", "start"]
```

### Performance Optimization

```dockerfile
# Use .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env

# Layer caching
COPY package*.json ./
RUN npm ci --only=production

# Multi-stage builds
FROM node:18-alpine AS builder
# ... build steps

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
```

## 6\. Ví dụ thực tế

### Node.js Application

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Python Application

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Microservices Architecture

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - user-service
      - product-service

  auth-service:
    build: ./auth-service
    environment:
      - JWT_SECRET=secret
    depends_on:
      - auth-db

  user-service:
    build: ./user-service
    environment:
      - DATABASE_URL=postgresql://user:pass@user-db:5432/users
    depends_on:
      - user-db

  product-service:
    build: ./product-service
    environment:
      - DATABASE_URL=postgresql://user:pass@product-db:5432/products
    depends_on:
      - product-db

  auth-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=auth
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  user-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=users
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  product-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=products
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

### CI/CD Pipeline

```yaml
# .github/workflows/docker.yml
name: Docker CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: myapp:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

## 7\. Troubleshooting và tips

### Common Issues

#### 1\. Container Won’t Start

```bash
# Check container logs
docker logs container_id

# Run container interactively
docker run -it image_name sh

# Check container status
docker ps -a

# Inspect container
docker inspect container_id
```

#### 2\. Port Conflicts

```bash
# Check port usage
netstat -tulpn | grep :8080

# Use different port
docker run -p 8081:80 nginx

# Check container ports
docker port container_id
```

#### 3\. Volume Mount Issues

```bash
# Check volume permissions
ls -la /host/path

# Use named volumes
docker run -v my_volume:/app/data nginx

# Check volume contents
docker run -it --rm -v my_volume:/data alpine ls /data
```

#### 4\. Network Issues

```bash
# Check network connectivity
docker exec container_id ping google.com

# Inspect network
docker network inspect bridge

# Use custom network
docker network create my_network
docker run --network my_network nginx
```

#### 5\. Resource Limits

```bash
# Check resource usage
docker stats

# Set memory limit
docker run --memory=512m nginx

# Set CPU limit
docker run --cpus=1 nginx

# Set both
docker run --memory=512m --cpus=1 nginx
```

### Debugging Tips

#### 1\. Container Inspection

```bash
# Inspect container
docker inspect container_id

# Check container logs
docker logs -f container_id

# Execute command in running container
docker exec -it container_id sh

# Copy files from container
docker cp container_id:/path/file /host/path
```

#### 2\. Image Inspection

```bash
# Inspect image
docker inspect image_name

# Check image history
docker history image_name

# Run image with different command
docker run -it image_name sh
```

#### 3\. Network Debugging

```bash
# Check network connectivity
docker exec container_id ping host.docker.internal

# Check DNS resolution
docker exec container_id nslookup google.com

# Use custom DNS
docker run --dns 8.8.8.8 nginx
```

#### 4\. Performance Monitoring

```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df

# Monitor events
docker events
```

#### 5\. Security Scanning

```bash
# Scan image for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image myapp:latest

# Check image layers
docker history myapp:latest
```

## 8\. Tài liệu tham khảo

### Official Documentation

*   [Docker Documentation](https://docs.docker.com/)
*   [Docker Hub](https://hub.docker.com/)
*   [Docker Compose](https://docs.docker.com/compose/)
*   [Docker Swarm](https://docs.docker.com/engine/swarm/)

### Learning Resources

*   [Docker Tutorial](https://docs.docker.com/get-started/)
*   [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
*   [Docker Security](https://docs.docker.com/engine/security/)
*   [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

### Tools & Extensions

*   [Docker Desktop](https://www.docker.com/products/docker-desktop)
*   [Docker Compose](https://docs.docker.com/compose/)
*   [Docker Swarm](https://docs.docker.com/engine/swarm/)
*   [Portainer](https://www.portainer.io/)

### Security Tools

*   [Trivy](https://github.com/aquasecurity/trivy)
*   [Clair](https://github.com/quay/clair)
*   [Anchore](https://anchore.com/)
*   [Snyk](https://snyk.io/)

### Monitoring & Logging

*   [Prometheus](https://prometheus.io/)
*   [Grafana](https://grafana.com/)
*   [ELK Stack](https://www.elastic.co/elk-stack)
*   [Fluentd](https://www.fluentd.org/)

### Orchestration

*   [Kubernetes](https://kubernetes.io/)
*   [Docker Swarm](https://docs.docker.com/engine/swarm/)
*   [Nomad](https://www.nomadproject.io/)
*   [Rancher](https://rancher.com/)

* * *

**🎯 Kết quả sau khi học Docker:**

*   ✅ Hiểu sâu về containerization và Docker architecture
*   ✅ Thành thạo Dockerfile và Docker Compose
*   ✅ Deploy và manage containers hiệu quả
*   ✅ Build multi-stage và optimized images
*   ✅ Implement Docker security best practices
*   ✅ Orchestrate containers với Docker Swarm
*   ✅ Integrate Docker vào CI/CD pipelines
*   ✅ Troubleshoot và monitor Docker environments

**Bước tiếp theo**: Học Docker Compose để orchestrate multiple containers, hoặc Kubernetes cho production-scale deployments.