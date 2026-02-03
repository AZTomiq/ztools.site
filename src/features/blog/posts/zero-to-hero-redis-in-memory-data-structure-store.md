---
title: "Zero to Hero: Redis - In-Memory Data Structure Store"
date: 2025-01-27T03:00:00.000Z
tags: [Cache, Database, In-Memory, Key-Value, NoSQL, Pub/Sub, Redis, Session Store]
categories: [Database, Redis, Cache]
---

# Zero to Hero: Redis - In-Memory Data Structure Store

Redis là in-memory data structure store, được sử dụng như database, cache, message broker. Nó hỗ trợ nhiều data structures và cung cấp persistence options.

## 1\. Tại sao chọn Redis?

### So sánh với các cache khác

```javascript
// Memcached - Simple key-value
memcached.set('user:123', JSON.stringify(userData));

// Redis - Rich data structures
redis.hset('user:123', userData);
redis.sadd('online_users', 'user:123');
redis.zadd('leaderboard', score, 'user:123');
```

### Lợi ích của Redis

*   **In-Memory Performance**: Tốc độ cực nhanh
*   **Rich Data Structures**: String, Hash, List, Set, Sorted Set
*   **Persistence**: RDB và AOF
*   **Pub/Sub**: Real-time messaging
*   **Atomic Operations**: Thread-safe
*   **Lua Scripting**: Custom logic
*   **Clustering**: Horizontal scaling
*   **Replication**: High availability

### Use Cases

*   **Caching**: Session, page cache
*   **Session Store**: User sessions
*   **Real-time Analytics**: Counters, leaderboards
*   **Message Queue**: Job queues, pub/sub
*   **Rate Limiting**: API throttling
*   **Geospatial**: Location-based features

## 2\. Cài đặt và Setup

### Cài đặt Redis

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS với Homebrew
brew install redis

# Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Windows với WSL
wsl --install Ubuntu
# Sau đó cài như Ubuntu
```

### Khởi động Redis

```bash
# Start service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Check status
sudo systemctl status redis-server

# Connect to Redis CLI
redis-cli

# Test connection
redis-cli ping
# PONG
```

### Redis Configuration

```bash
# /etc/redis/redis.conf
# Network
bind 127.0.0.1
port 6379
timeout 300

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security
requirepass your_password

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Redis Desktop Manager

```bash
# RedisInsight (Official)
# Download từ https://redis.com/redis-enterprise/redis-insight/

# Redis Commander (Web-based)
npm install -g redis-commander
redis-commander --redis-host localhost --redis-port 6379
```

## 3\. Core Data Structures

### Strings

```javascript
// Basic operations
SET user:1 "John Doe"
GET user:1
DEL user:1

// Expiration
SETEX session:123 3600 "user_data"
TTL session:123

// Atomic operations
INCR counter
INCRBY counter 5
DECR counter

// Multiple operations
MSET user:1 "John" user:2 "Jane"
MGET user:1 user:2

// Conditional operations
SETNX lock:resource "locked"
```

### Hashes

```javascript
// User profile
HSET user:123 name "John Doe"
HSET user:123 email "john@example.com"
HSET user:123 age 30

// Get values
HGET user:123 name
HGETALL user:123
HKEYS user:123
HVALS user:123

// Check existence
HEXISTS user:123 email

// Increment numeric fields
HINCRBY user:123 visits 1

// Multiple operations
HMSET user:123 name "John" email "john@example.com" age 30
HMGET user:123 name email age
```

### Lists

```javascript
// Queue operations
LPUSH queue "task1"
RPUSH queue "task2"
LPOP queue
RPOP queue

// Get elements
LRANGE queue 0 -1
LINDEX queue 0
LLEN queue

// Insert operations
LINSERT queue BEFORE "task2" "task1.5"
LSET queue 1 "new_task"

// Remove elements
LREM queue 1 "task1"
LTRIM queue 0 9
```

### Sets

```javascript
// Add/Remove members
SADD tags "javascript" "nodejs" "redis"
SREM tags "nodejs"
SMEMBERS tags

// Set operations
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"

SINTER set1 set2      // Intersection
SUNION set1 set2      // Union
SDIFF set1 set2       // Difference

// Check membership
SISMEMBER tags "javascript"
SCARD tags
```

### Sorted Sets

```javascript
// Add with scores
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2" 150 "player3"

// Get rankings
ZRANGE leaderboard 0 -1 WITHSCORES
ZREVRANGE leaderboard 0 -1 WITHSCORES

// Get by score range
ZRANGEBYSCORE leaderboard 100 200
ZCOUNT leaderboard 100 200

// Update scores
ZINCRBY leaderboard 50 "player1"

// Remove members
ZREM leaderboard "player1"
```

## 4\. Advanced Features

### Pub/Sub Messaging

```javascript
// Publisher
PUBLISH news "Breaking news!"

// Subscriber
SUBSCRIBE news
# Listening for messages on 'news' channel

// Pattern subscription
PSUBSCRIBE news.*
# Subscribe to all channels starting with 'news'

// Unsubscribe
UNSUBSCRIBE news
PUNSUBSCRIBE news.*
```

### Transactions

```javascript
// Start transaction
MULTI

// Queue commands
SET user:1 "John"
SET user:2 "Jane"
INCR counter

// Execute transaction
EXEC

// Discard transaction
MULTI
SET user:1 "John"
DISCARD
```

### Lua Scripting

```javascript
// Simple script
EVAL "return redis.call('GET', KEYS[1])" 1 user:123

// Complex script
EVAL "
  local user = redis.call('HGETALL', KEYS[1])
  local visits = redis.call('HINCRBY', KEYS[1], 'visits', 1)
  return {user, visits}
" 1 user:123

// Load and execute script
SCRIPT LOAD "return redis.call('GET', KEYS[1])"
EVALSHA sha1_hash 1 user:123
```

### Pipeline

```javascript
// Batch operations
const pipeline = redis.pipeline();

pipeline.set('user:1', 'John');
pipeline.set('user:2', 'Jane');
pipeline.incr('counter');

pipeline.exec((err, results) => {
  console.log(results);
});
```

## 5\. Persistence và Backup

### RDB (Redis Database)

```bash
# Configuration
save 900 1      # Save after 900s if 1+ keys changed
save 300 10     # Save after 300s if 10+ keys changed
save 60 10000   # Save after 60s if 10000+ keys changed

# Manual save
SAVE            # Blocking save
BGSAVE          # Background save

# Disable RDB
save ""
```

### AOF (Append Only File)

```bash
# Configuration
appendonly yes
appendfsync always    # Every command
appendfsync everysec  # Every second
appendfsync no        # System decides

# Rewrite AOF
BGREWRITEAOF
```

### Backup Strategies

```bash
# Create backup
redis-cli BGSAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backup/

# Restore from backup
redis-cli FLUSHALL
cp /backup/dump.rdb /var/lib/redis/
sudo systemctl restart redis-server
```

## 6\. Performance Optimization

### Memory Optimization

```javascript
// Use appropriate data structures
// Instead of storing JSON strings
SET user:123 '{"name":"John","email":"john@example.com"}'

// Use hashes
HSET user:123 name "John" email "john@example.com"

// Use integers for counters
SET counter 0
INCR counter

// Use bitmaps for flags
SETBIT flags 0 1
GETBIT flags 0
```

### Connection Pooling

```javascript
// Node.js with ioredis
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxLoadingTimeout: 2000,
});
```

### Caching Strategies

```javascript
// Cache-Aside Pattern
async function getUser(id) {
  // Try cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Get from database
  const user = await db.getUser(id);
  
  // Store in cache
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  
  return user;
}

// Write-Through Pattern
async function updateUser(id, data) {
  // Update database
  await db.updateUser(id, data);
  
  // Update cache
  await redis.setex(`user:${id}`, 3600, JSON.stringify(data));
}

// Cache Invalidation
async function deleteUser(id) {
  await db.deleteUser(id);
  await redis.del(`user:${id}`);
}
```

## 7\. Clustering và Replication

### Master-Slave Replication

```bash
# Master configuration
bind 0.0.0.0
port 6379

# Slave configuration
slaveof 127.0.0.1 6379
slave-read-only yes
```

### Redis Cluster

```bash
# Create cluster
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 \
  127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1

# Check cluster status
redis-cli --cluster info 127.0.0.1:7000

# Add node to cluster
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000
```

### Sentinel (High Availability)

```bash
# Sentinel configuration
port 26379
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
```

## 8\. Security và Monitoring

### Security Configuration

```bash
# Authentication
requirepass your_strong_password

# Network security
bind 127.0.0.1
protected-mode yes

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_9a7b8c2d"

# SSL/TLS
tls-port 6380
tls-cert-file /path/to/cert.pem
tls-key-file /path/to/key.pem
```

### Monitoring

```javascript
// Server info
INFO server
INFO memory
INFO stats

// Monitor commands
MONITOR

// Slow log
SLOWLOG GET 10

// Client list
CLIENT LIST
CLIENT KILL ip:port
```

### Health Checks

```bash
# Basic health check
redis-cli ping

# Check memory usage
redis-cli info memory | grep used_memory_human

# Check connected clients
redis-cli info clients | grep connected_clients

# Check replication status
redis-cli info replication
```

## Ví dụ thực tế: E-commerce Cache System

```javascript
// Session Management
const sessionStore = {
  async createSession(userId, data) {
    const sessionId = crypto.randomUUID();
    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify({
      userId,
      data,
      createdAt: Date.now()
    }));
    return sessionId;
  },

  async getSession(sessionId) {
    const session = await redis.get(`session:${sessionId}`);
    return session ? JSON.parse(session) : null;
  },

  async updateSession(sessionId, data) {
    const session = await this.getSession(sessionId);
    if (session) {
      session.data = { ...session.data, ...data };
      await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));
    }
  },

  async deleteSession(sessionId) {
    await redis.del(`session:${sessionId}`);
  }
};

// Product Cache
const productCache = {
  async getProduct(id) {
    const cached = await redis.get(`product:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const product = await db.getProduct(id);
    if (product) {
      await redis.setex(`product:${id}`, 1800, JSON.stringify(product));
    }
    
    return product;
  },

  async invalidateProduct(id) {
    await redis.del(`product:${id}`);
  },

  async getPopularProducts() {
    const products = await redis.zrevrange('popular_products', 0, 9);
    return Promise.all(products.map(id => this.getProduct(id)));
  },

  async incrementProductViews(id) {
    await redis.zincrby('popular_products', 1, id);
  }
};

// Rate Limiting
const rateLimiter = {
  async isAllowed(userId, action, limit, window) {
    const key = `rate_limit:${userId}:${action}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return current <= limit;
  },

  async getRemaining(userId, action) {
    const key = `rate_limit:${userId}:${action}`;
    const current = await redis.get(key);
    return current ? Math.max(0, 10 - parseInt(current)) : 10;
  }
};

// Shopping Cart
const cartService = {
  async addToCart(userId, productId, quantity) {
    const key = `cart:${userId}`;
    await redis.hincrby(key, productId, quantity);
    await redis.expire(key, 86400); // 24 hours
  },

  async getCart(userId) {
    const key = `cart:${userId}`;
    const cart = await redis.hgetall(key);
    
    const items = [];
    for (const [productId, quantity] of Object.entries(cart)) {
      const product = await productCache.getProduct(productId);
      if (product) {
        items.push({ product, quantity: parseInt(quantity) });
      }
    }
    
    return items;
  },

  async removeFromCart(userId, productId) {
    const key = `cart:${userId}`;
    await redis.hdel(key, productId);
  },

  async clearCart(userId) {
    const key = `cart:${userId}`;
    await redis.del(key);
  }
};

// Real-time Analytics
const analytics = {
  async trackPageView(page) {
    await redis.incr(`page_views:${page}`);
    await redis.incr('total_page_views');
  },

  async trackUserAction(userId, action) {
    const key = `user_actions:${userId}`;
    await redis.lpush(key, JSON.stringify({
      action,
      timestamp: Date.now()
    }));
    await redis.ltrim(key, 0, 99); // Keep last 100 actions
  },

  async getTopPages() {
    const keys = await redis.keys('page_views:*');
    const pages = [];
    
    for (const key of keys) {
      const page = key.replace('page_views:', '');
      const views = await redis.get(key);
      pages.push({ page, views: parseInt(views) });
    }
    
    return pages.sort((a, b) => b.views - a.views).slice(0, 10);
  }
};
```

Redis cung cấp performance cao và tính linh hoạt cho các ứng dụng hiện đại. Với rich data structures và advanced features, nó là lựa chọn tuyệt vời cho caching, session management, và real-time applications.