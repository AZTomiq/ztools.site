---
title: "Zero to Hero: MongoDB - NoSQL Database Cho ứNg Dụng Hiện đạI"
date: 2025-01-27T03:00:00.000Z
tags: [Aggregation, BSON, Database, Document, Indexing, MongoDB, NoSQL, Replication, Sharding]
categories: [Database, MongoDB, NoSQL]
---

# Zero to Hero: MongoDB - NoSQL Database cho ứng dụng hiện đại

MongoDB là NoSQL database phổ biến nhất, sử dụng document-based storage với JSON-like BSON format. Nó cung cấp tính linh hoạt cao, scalability và performance tốt cho các ứng dụng hiện đại.

## 1\. Tại sao chọn MongoDB?

### So sánh với SQL Database

```sql
-- SQL - Structured data
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP
);

INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- MongoDB - Flexible document
db.users.insertOne({
  name: "John",
  email: "john@example.com",
  profile: {
    age: 30,
    location: "New York"
  },
  tags: ["developer", "nodejs"],
  createdAt: new Date()
});
```

### Lợi ích của MongoDB

*   **Schema Flexibility**: Không cần định nghĩa schema cứng
*   **Horizontal Scaling**: Sharding để scale out
*   **High Performance**: In-memory storage với WiredTiger
*   **Rich Query Language**: Aggregation pipeline mạnh mẽ
*   **JSON-like Documents**: Dễ dàng làm việc với JavaScript
*   **Geospatial Support**: Hỗ trợ location-based queries

## 2\. Cài đặt và Setup

### Cài đặt MongoDB

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# macOS với Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### Khởi động MongoDB

```bash
# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# Connect to MongoDB shell
mongosh
```

### MongoDB Compass (GUI)

```bash
# Download từ https://www.mongodb.com/try/download/compass
# Hoặc với Homebrew
brew install --cask mongodb-compass
```

## 3\. Core Concepts

### Database và Collections

```javascript
// Tạo và sử dụng database
use myapp

// Tạo collection (tự động)
db.users.insertOne({ name: "John" })

// Xem danh sách databases
show dbs

// Xem danh sách collections
show collections

// Xem thông tin database
db.stats()
```

### Documents và BSON

```javascript
// Document structure
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  isActive: true,
  profile: {
    bio: "Software Developer",
    location: "New York",
    skills: ["JavaScript", "Node.js", "MongoDB"]
  },
  createdAt: new Date(),
  tags: ["developer", "backend"]
}

// BSON Types
{
  string: "Hello World",
  number: 42,
  boolean: true,
  date: new Date(),
  objectId: ObjectId(),
  array: [1, 2, 3],
  null: null,
  undefined: undefined,
  binary: BinData(0, "base64"),
  regex: /pattern/i
}
```

## 4\. CRUD Operations

### Create Operations

```javascript
// Insert One Document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  createdAt: new Date()
})

// Insert Many Documents
db.users.insertMany([
  {
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35
  }
])

// Insert with Options
db.users.insertOne(
  { name: "Alice", email: "alice@example.com" },
  { writeConcern: { w: "majority", j: true } }
)
```

### Read Operations

```javascript
// Find All Documents
db.users.find()

// Find with Filter
db.users.find({ age: { $gte: 25 } })

// Find One Document
db.users.findOne({ email: "john@example.com" })

// Projection (select fields)
db.users.find(
  { age: { $gte: 25 } },
  { name: 1, email: 1, _id: 0 }
)

// Sort Results
db.users.find().sort({ age: -1, name: 1 })

// Limit Results
db.users.find().limit(10).skip(5)

// Complex Queries
db.users.find({
  $and: [
    { age: { $gte: 25 } },
    { age: { $lte: 40 } },
    { isActive: true }
  ]
})
```

### Update Operations

```javascript
// Update One Document
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31, updatedAt: new Date() } }
)

// Update Many Documents
db.users.updateMany(
  { age: { $lt: 30 } },
  { $set: { category: "young" } }
)

// Upsert (insert if not exists)
db.users.updateOne(
  { email: "new@example.com" },
  { 
    $set: { name: "New User", age: 25 },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
)

// Array Operations
db.users.updateOne(
  { email: "john@example.com" },
  { 
    $push: { skills: "MongoDB" },
    $inc: { experience: 1 }
  }
)
```

### Delete Operations

```javascript
// Delete One Document
db.users.deleteOne({ email: "john@example.com" })

// Delete Many Documents
db.users.deleteMany({ age: { $lt: 18 } })

// Delete All Documents in Collection
db.users.deleteMany({})

// Drop Collection
db.users.drop()

// Drop Database
db.dropDatabase()
```

## 5\. Query Operators

### Comparison Operators

```javascript
// Equal
db.users.find({ age: 30 })

// Not Equal
db.users.find({ age: { $ne: 30 } })

// Greater Than
db.users.find({ age: { $gt: 25 } })

// Greater Than or Equal
db.users.find({ age: { $gte: 25 } })

// Less Than
db.users.find({ age: { $lt: 40 } })

// Less Than or Equal
db.users.find({ age: { $lte: 40 } })

// In Array
db.users.find({ age: { $in: [25, 30, 35] } })

// Not In Array
db.users.find({ age: { $nin: [25, 30, 35] } })

// Exists
db.users.find({ email: { $exists: true } })

// Type Check
db.users.find({ age: { $type: "number" } })
```

### Logical Operators

```javascript
// AND (implicit)
db.users.find({
  age: { $gte: 25 },
  isActive: true
})

// AND (explicit)
db.users.find({
  $and: [
    { age: { $gte: 25 } },
    { isActive: true }
  ]
})

// OR
db.users.find({
  $or: [
    { age: { $lt: 25 } },
    { age: { $gt: 40 } }
  ]
})

// NOR (not or)
db.users.find({
  $nor: [
    { age: { $lt: 25 } },
    { isActive: false }
  ]
})

// NOT
db.users.find({
  age: { $not: { $lt: 25 } }
})
```

### Element Operators

```javascript
// Array Contains
db.users.find({ skills: "JavaScript" })

// Array Contains All
db.users.find({ skills: { $all: ["JavaScript", "Node.js"] } })

// Array Size
db.users.find({ skills: { $size: 3 } })

// Array Element Match
db.users.find({
  skills: {
    $elemMatch: {
      $regex: /^Java/,
      $exists: true
    }
  }
})
```

## 6\. Aggregation Pipeline

### Basic Aggregation

```javascript
// Count Documents
db.users.aggregate([
  { $count: "total_users" }
])

// Group by Field
db.users.aggregate([
  { $group: { _id: "$age", count: { $sum: 1 } } }
])

// Sort Results
db.users.aggregate([
  { $sort: { age: -1 } },
  { $limit: 10 }
])
```

### Advanced Aggregation

```javascript
// Complex Grouping
db.users.aggregate([
  { $match: { age: { $gte: 25 } } },
  { $group: {
    _id: "$age",
    count: { $sum: 1 },
    names: { $push: "$name" },
    avgExperience: { $avg: "$experience" }
  }},
  { $sort: { _id: 1 } }
])

// Lookup (Join)
db.users.aggregate([
  { $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "userId",
    as: "orders"
  }},
  { $project: {
    name: 1,
    orderCount: { $size: "$orders" },
    totalSpent: { $sum: "$orders.amount" }
  }}
])

// Unwind Arrays
db.users.aggregate([
  { $unwind: "$skills" },
  { $group: {
    _id: "$skills",
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])
```

### Date Aggregation

```javascript
// Group by Date
db.users.aggregate([
  { $group: {
    _id: {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" }
    },
    count: { $sum: 1 }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])

// Date Range Filter
db.users.aggregate([
  { $match: {
    createdAt: {
      $gte: new Date("2024-01-01"),
      $lt: new Date("2024-12-31")
    }
  }},
  { $count: "users_2024" }
])
```

## 7\. Indexing

### Single Field Index

```javascript
// Create Index
db.users.createIndex({ email: 1 })

// Unique Index
db.users.createIndex({ email: 1 }, { unique: true })

// Sparse Index (only for documents with field)
db.users.createIndex({ phone: 1 }, { sparse: true })

// TTL Index (auto-delete after time)
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)
```

### Compound Index

```javascript
// Multiple Fields
db.users.createIndex({ age: 1, isActive: 1 })

// Mixed Order
db.users.createIndex({ age: -1, name: 1 })

// Partial Index
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { isActive: true } }
)
```

### Text Index

```javascript
// Text Search Index
db.users.createIndex({
  name: "text",
  bio: "text"
})

// Text Search Query
db.users.find({
  $text: { $search: "developer javascript" }
})

// Text Search with Score
db.users.find(
  { $text: { $search: "developer" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

### Geospatial Index

```javascript
// 2dsphere Index
db.places.createIndex({ location: "2dsphere" })

// Geospatial Query
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000
    }
  }
})
```

## 8\. Data Modeling

### Embedded Documents

```javascript
// One-to-One Relationship
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  profile: {
    bio: "Software Developer",
    location: "New York",
    website: "https://johndoe.com",
    social: {
      twitter: "@johndoe",
      linkedin: "linkedin.com/in/johndoe"
    }
  }
}

// One-to-Many Relationship
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  orders: [
    {
      orderId: "ORD001",
      items: ["Product A", "Product B"],
      total: 150.00,
      date: new Date("2024-01-15")
    },
    {
      orderId: "ORD002",
      items: ["Product C"],
      total: 75.00,
      date: new Date("2024-01-20")
    }
  ]
}
```

### Referenced Documents

```javascript
// Users Collection
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com"
}

// Orders Collection
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Reference to user
  items: ["Product A", "Product B"],
  total: 150.00,
  date: new Date("2024-01-15")
}

// Using Lookup
db.orders.aggregate([
  { $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user"
  }},
  { $unwind: "$user" }
])
```

## 9\. Performance Optimization

### Query Optimization

```javascript
// Use Projection
db.users.find({}, { name: 1, email: 1, _id: 0 })

// Use Covered Queries
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "john@example.com" }, { _id: 0, email: 1, name: 1 })

// Use Limit
db.users.find().limit(100)

// Use Skip Efficiently
db.users.find().skip(1000).limit(100) // Inefficient
db.users.find({ _id: { $gt: lastId } }).limit(100) // Efficient
```

### Index Optimization

```javascript
// Analyze Query Performance
db.users.find({ age: { $gte: 25 } }).explain("executionStats")

// Check Index Usage
db.users.getIndexes()

// Drop Unused Indexes
db.users.dropIndex("index_name")

// Background Index Creation
db.users.createIndex({ email: 1 }, { background: true })
```

## 10\. Replication và Sharding

### Replica Set

```javascript
// Initialize Replica Set
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})

// Check Replica Set Status
rs.status()

// Add Member
rs.add("localhost:27020")

// Remove Member
rs.remove("localhost:27020")
```

### Sharding

```javascript
// Enable Sharding
sh.enableSharding("myapp")

// Shard Collection
sh.shardCollection("myapp.users", { email: 1 })

// Add Shard
sh.addShard("shard1/localhost:27018")
sh.addShard("shard2/localhost:27019")

// Check Shard Status
sh.status()
```

## 11\. Security

### Authentication

```javascript
// Create Admin User
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})

// Create Application User
use myapp
db.createUser({
  user: "appuser",
  pwd: "apppassword",
  roles: ["readWrite"]
})

// Enable Authentication
security:
  authorization: enabled
```

### Network Security

```javascript
// Bind to Specific IP
net:
  bindIp: 127.0.0.1,192.168.1.100

// SSL/TLS Configuration
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /path/to/mongodb.pem
    CAFile: /path/to/ca.pem
```

## 12\. Monitoring và Maintenance

### Monitoring

```javascript
// Server Status
db.serverStatus()

// Database Stats
db.stats()

// Collection Stats
db.users.stats()

// Current Operations
db.currentOp()

// Kill Long-Running Operations
db.killOp(opId)
```

### Backup và Restore

```bash
# Backup Database
mongodump --db myapp --out /backup

# Backup Specific Collection
mongodump --db myapp --collection users --out /backup

# Restore Database
mongorestore --db myapp /backup/myapp

# Export to JSON
mongoexport --db myapp --collection users --out users.json

# Import from JSON
mongoimport --db myapp --collection users --file users.json
```

## Ví dụ thực tế: E-commerce System

```javascript
// Products Collection
{
  _id: ObjectId("..."),
  name: "iPhone 15 Pro",
  category: "Electronics",
  price: 999.99,
  stock: 50,
  tags: ["smartphone", "apple", "5g"],
  specifications: {
    screen: "6.1 inch",
    storage: "256GB",
    color: "Titanium"
  },
  reviews: [
    {
      userId: ObjectId("..."),
      rating: 5,
      comment: "Great phone!",
      date: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
}

// Orders Collection
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  items: [
    {
      productId: ObjectId("..."),
      name: "iPhone 15 Pro",
      price: 999.99,
      quantity: 1
    }
  ],
  total: 999.99,
  status: "pending",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  createdAt: new Date()
}

// Aggregation for Sales Report
db.orders.aggregate([
  { $match: {
    createdAt: {
      $gte: new Date("2024-01-01"),
      $lt: new Date("2024-12-31")
    }
  }},
  { $unwind: "$items" },
  { $group: {
    _id: "$items.productId",
    totalSold: { $sum: "$items.quantity" },
    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
  }},
  { $lookup: {
    from: "products",
    localField: "_id",
    foreignField: "_id",
    as: "product"
  }},
  { $unwind: "$product" },
  { $project: {
    productName: "$product.name",
    totalSold: 1,
    totalRevenue: 1
  }},
  { $sort: { totalRevenue: -1 } }
])
```

MongoDB cung cấp tính linh hoạt cao và performance tốt cho các ứng dụng hiện đại. Với document-based storage và powerful aggregation pipeline, nó là lựa chọn tuyệt vời cho các dự án cần scalability và flexibility.