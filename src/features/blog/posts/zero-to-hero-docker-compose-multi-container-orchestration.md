---
title: "Zero to Hero: Docker Compose - Multi-Container Orchestration"
date: 2025-06-26T09:00:08.000Z
tags: [containerization, devops, docker, docker-compose, microservices, orchestration, zero-to-hero]
categories: [DevOps, Containerization, Microservices]
---

# Zero to Hero: Docker Compose - Multi-Container Orchestration

Docker Compose là công cụ định nghĩa và chạy multi-container Docker applications. Với file YAML đơn giản, bạn có thể tạo và quản lý toàn bộ stack ứng dụng với database, cache, message broker và các service khác.

## 1\. Giới thiệu và khái niệm cơ bản

### Docker Compose là gì?

Docker Compose là một tool cho phép:

*   **Multi-container Applications**: Định nghĩa và chạy nhiều containers
*   **Service Definition**: Mô tả services trong file YAML
*   **Environment Management**: Quản lý environment variables
*   **Network Management**: Tự động tạo networks cho containers
*   **Volume Management**: Quản lý persistent data
*   **Dependency Management**: Định nghĩa thứ tự khởi động services

### Core Concepts:

*   **Service**: Một container được định nghĩa trong docker-compose.yml
*   **Project**: Tập hợp các services trong một directory
*   **Network**: Virtual network cho containers giao tiếp
*   **Volume**: Persistent storage cho containers
*   **Environment**: Variables và configuration
*   **Dependencies**: Thứ tự khởi động services

### Use Cases:

*   **Development Environment**: Local development với full stack
*   **Testing**: Automated testing với multiple services
*   **CI/CD**: Build và test applications
*   **Production-like**: Staging environment
*   **Microservices**: Orchestrate multiple services

## 2\. Cài đặt và setup môi trường

### Docker Compose Installation

```bash
# Docker Desktop (includes Docker Compose)
# Download từ https://www.docker.com/products/docker-desktop

# Linux standalone installation
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Project Structure

```plaintext
my-app/
├── docker-compose.yml
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── .env
├── .env.development
├── .env.production
├── services/
│   ├── web/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   └── worker/
│       ├── Dockerfile
│       ├── package.json
│       └── src/
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── postgres/
│   └── init.sql
└── redis/
    └── redis.conf
```

### Basic docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: ./services/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./services/web:/app
      - /app/node_modules
    networks:
      - app-network

  api:
    build: ./services/api
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./services/api:/app
      - /app/node_modules
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - app-network

  nginx:
    build: ./nginx
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web
      - api
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## 3\. Cú pháp và cấu trúc cơ bản

### Service Definition

```yaml
# Basic service definition
services:
  web:
    # Image or build
    image: nginx:alpine
    # hoặc
    build: ./web
    
    # Ports mapping
    ports:
      - "80:80"
      - "443:443"
    
    # Environment variables
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    # hoặc
    env_file:
      - .env
      - .env.production
    
    # Volumes
    volumes:
      - ./app:/app
      - /app/node_modules
      - named_volume:/data
    
    # Networks
    networks:
      - frontend
      - backend
    
    # Dependencies
    depends_on:
      - db
      - redis
    
    # Health checks
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Environment Configuration

```yaml
# Environment variables
services:
  web:
    environment:
      # Direct variables
      - NODE_ENV=production
      - PORT=3000
      
      # Variable substitution
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    
    # Multiple env files
    env_file:
      - .env
      - .env.${NODE_ENV}
      - .env.local

# .env file
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db:5432/myapp
REDIS_URL=redis://redis:6379
API_KEY=your-api-key
```

### Volume Management

```yaml
# Volume types
services:
  web:
    volumes:
      # Bind mount
      - ./src:/app/src
      
      # Named volume
      - app_data:/app/data
      
      # Anonymous volume
      - /app/temp
      
      # Read-only volume
      - ./config:/app/config:ro
      
      # Volume with options
      - type: bind
        source: ./logs
        target: /app/logs
        bind:
          propagation: cached

# Named volumes
volumes:
  app_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/host
  
  postgres_data:
    driver: local
  
  redis_data:
    driver: local
```

### Network Configuration

```yaml
# Network configuration
services:
  web:
    networks:
      - frontend
      - backend
  
  api:
    networks:
      - backend
  
  db:
    networks:
      - backend

# Custom networks
networks:
  frontend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  
  backend:
    driver: bridge
    internal: true
    ipam:
      config:
        - subnet: 172.21.0.0/16
  
  external_network:
    external: true
    name: my_external_network
```

## 4\. Các tính năng nâng cao

### Multi-stage Builds

```yaml
# docker-compose.yml with multi-stage builds
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
      target: production
      args:
        NODE_ENV: production
        BUILD_VERSION: ${BUILD_VERSION}
    ports:
      - "3000:3000"

# Dockerfile with multi-stage
# web/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Checks

```yaml
# Health checks for services
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  api:
    healthcheck:
      test: ["CMD-SHELL", "pgrep -f 'node.*app.js' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

# Dependencies with health checks
services:
  web:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
```

### Secrets Management

```yaml
# Docker secrets
services:
  web:
    secrets:
      - db_password
      - api_key
      - ssl_cert
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - API_KEY_FILE=/run/secrets/api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
  ssl_cert:
    external: true
    name: ssl_certificate

# Using secrets in applications
# web/src/config.js
const fs = require('fs');

const config = {
  database: {
    password: fs.readFileSync('/run/secrets/db_password', 'utf8').trim()
  },
  api: {
    key: fs.readFileSync('/run/secrets/api_key', 'utf8').trim()
  }
};
```

### Service Dependencies

```yaml
# Complex dependencies
services:
  web:
    depends_on:
      api:
        condition: service_healthy
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
  
  api:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_started
  
  worker:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
  
  rabbitmq:
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 5\. Best practices và patterns

### Development vs Production

```yaml
# docker-compose.yml (base)
version: '3.8'

services:
  web:
    build: ./web
    environment:
      - NODE_ENV=${NODE_ENV}
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

# docker-compose.override.yml (development)
version: '3.8'

services:
  web:
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  db:
    ports:
      - "5432:5432"
    volumes:
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    ports:
      - "6379:6379"

# docker-compose.prod.yml (production)
version: '3.8'

services:
  web:
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    restart: unless-stopped

  db:
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    restart: unless-stopped

secrets:
  db_password:
    external: true
```

### Configuration Management

```yaml
# Configuration with external files
services:
  web:
    configs:
      - source: web_config
        target: /app/config/app.json
      - source: nginx_config
        target: /etc/nginx/nginx.conf

  api:
    configs:
      - source: api_config
        target: /app/config/config.json

configs:
  web_config:
    file: ./configs/web.json
  api_config:
    file: ./configs/api.json
  nginx_config:
    file: ./configs/nginx.conf

# configs/web.json
{
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  },
  "database": {
    "url": "postgresql://user:password@db:5432/myapp"
  },
  "redis": {
    "url": "redis://redis:6379"
  }
}
```

### Logging Configuration

```yaml
# Logging configuration
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  api:
    logging:
      driver: "syslog"
      options:
        syslog-address: "udp://192.168.0.42:123"
        tag: "api"
  
  db:
    logging:
      driver: "fluentd"
      options:
        fluentd-address: "localhost:24224"
        tag: "docker.{{.Name}}"

# Custom logging driver
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production_status"
        env: "os,customer"
```

### Resource Management

```yaml
# Resource limits and reservations
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
  
  api:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      rollback_config:
        parallelism: 0
        order: stop-first
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 0
        window: 120s
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 6\. Ví dụ thực tế

### Full-Stack Application

```yaml
# docker-compose.yml for full-stack app
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:4000
    networks:
      - frontend
      - backend

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs
    networks:
      - backend

  # Background Worker
  worker:
    build:
      context: ./worker
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    volumes:
      - ./worker/logs:/app/logs
    networks:
      - backend

  # Database
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - backend

  # Message Broker
  rabbitmq:
    image: rabbitmq:3-management
    environment:
      - RABBITMQ_DEFAULT_USER=user
      - RABBITMQ_DEFAULT_PASS=password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    ports:
      - "15672:15672"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - backend

  # Monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - monitoring

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  prometheus_data:
  grafana_data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
  monitoring:
    driver: bridge
```

### Microservices Architecture

```yaml
# docker-compose.yml for microservices
version: '3.8'

services:
  # API Gateway
  gateway:
    build: ./gateway
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - USER_SERVICE_URL=http://user-service:3001
      - ORDER_SERVICE_URL=http://order-service:3002
      - PRODUCT_SERVICE_URL=http://product-service:3003
    depends_on:
      - user-service
      - order-service
      - product-service
    networks:
      - gateway
      - services

  # User Service
  user-service:
    build: ./services/user
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@user-db:5432/users
      - REDIS_URL=redis://redis:6379
    depends_on:
      user-db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - services

  # Order Service
  order-service:
    build: ./services/order
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@order-db:5432/orders
      - REDIS_URL=redis://redis:6379
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      order-db:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - services

  # Product Service
  product-service:
    build: ./services/product
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@product-db:5432/products
      - REDIS_URL=redis://redis:6379
    depends_on:
      product-db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - services

  # Databases
  user-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=users
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - user_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d users"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - services

  order-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=orders
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - order_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d orders"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - services

  product-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=products
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - product_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d products"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - services

  # Shared Services
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      - services

  rabbitmq:
    image: rabbitmq:3-management
    environment:
      - RABBITMQ_DEFAULT_USER=user
      - RABBITMQ_DEFAULT_PASS=password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - services

volumes:
  user_db_data:
  order_db_data:
  product_db_data:
  redis_data:
  rabbitmq_data:

networks:
  gateway:
    driver: bridge
  services:
    driver: bridge
```

## 7\. Troubleshooting và tips

### Common Issues

```bash
# 1. Port conflicts
# Check what's using the port
lsof -i :3000
netstat -tulpn | grep :3000

# 2. Volume permissions
# Fix volume permissions
sudo chown -R $USER:$USER ./data

# 3. Network issues
# Inspect networks
docker network ls
docker network inspect myapp_default

# 4. Service not starting
# Check logs
docker-compose logs service-name
docker-compose logs -f service-name

# 5. Build issues
# Clean build
docker-compose build --no-cache
docker system prune -a
```

### Debugging Commands

```bash
# Useful debugging commands
# Check service status
docker-compose ps

# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs web

# Follow logs in real-time
docker-compose logs -f web

# Execute command in running container
docker-compose exec web sh
docker-compose exec db psql -U user -d myapp

# Check resource usage
docker stats

# Inspect container
docker-compose exec web cat /etc/hosts
docker-compose exec web env

# Check network connectivity
docker-compose exec web ping db
docker-compose exec web curl http://api:4000/health
```

### Performance Optimization

```yaml
# Performance optimization
services:
  web:
    # Use specific image tags
    image: node:18-alpine
    
    # Optimize build context
    build:
      context: ./web
      dockerfile: Dockerfile
      cache_from:
        - node:18-alpine
    
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    # Health checks
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
    # Logging limits
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Security Best Practices

```yaml
# Security best practices
services:
  web:
    # Run as non-root user
    user: "1000:1000"
    
    # Read-only root filesystem
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx
    
    # Security options
    security_opt:
      - no-new-privileges:true
    
    # Capabilities
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    
    # Environment variables (not secrets)
    environment:
      - NODE_ENV=production
    
    # Secrets for sensitive data
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

## 8\. Tài liệu tham khảo

### Official Documentation

*   [Docker Compose Documentation](https://docs.docker.com/compose/)
*   [Compose File Reference](https://docs.docker.com/compose/compose-file/)
*   [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/)

### Learning Resources

*   [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)
*   [Docker Compose Examples](https://github.com/docker/awesome-compose)
*   [Docker Compose Best Practices](https://docs.docker.com/compose/production/)

### Tools & Extensions

*   [Docker Compose UI](https://github.com/francescou/docker-compose-ui)
*   [Portainer](https://www.portainer.io/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Performance & Monitoring

*   [Docker Compose Performance](https://docs.docker.com/compose/production/)
*   [Docker Monitoring](https://docs.docker.com/config/daemon/monitoring/)
*   [Docker Stats](https://docs.docker.com/engine/reference/commandline/stats/)

### Security

*   [Docker Security](https://docs.docker.com/engine/security/)
*   [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
*   [Docker Security Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Deployment & Operations

*   [Docker Compose Production](https://docs.docker.com/compose/production/)
*   [Docker Swarm](https://docs.docker.com/engine/swarm/)
*   [Docker Compose with Kubernetes](https://docs.docker.com/compose/kubernetes/)