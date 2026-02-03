---
title: "Zero to Hero: Mongoose"
date: 2025-06-26T09:12:02.000Z
tags: [Database, MongoDB, Mongoose, Node.js, ODM, Schema, Validation]
---

# Zero to Hero: Mongoose - ODM mạnh mẽ cho MongoDB

> _“Mongoose không chỉ là một ODM - nó là cầu nối giữa MongoDB và Node.js, biến việc làm việc với NoSQL database trở nên đơn giản và type-safe như SQL.”_

Bạn có bao giờ tự hỏi:

*   Làm sao để làm việc với MongoDB một cách dễ dàng trong Node.js?
*   Tại sao cần ODM khi MongoDB đã có driver?
*   Làm thế nào để validate data trước khi lưu vào database?
*   Cách nào để tạo relationships giữa các collections?

Câu trả lời chính là **Mongoose** - Object Document Mapper (ODM) mạnh mẽ nhất cho MongoDB trong Node.js ecosystem.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Setup và Installation](#setup-v%C3%A0-installation)
*   [Schema và Model](#schema-v%C3%A0-model)
*   [CRUD Operations](#crud-operations)
*   [Validation](#validation)
*   [Middleware](#middleware)
*   [Relationships](#relationships)
*   [Queries](#queries)
*   [Aggregation](#aggregation)
*   [Best Practices](#best-practices)
*   [Ví dụ thực tế](#v%C3%AD-d%E1%BB%A5-th%E1%BB%B1c-t%E1%BA%BF)

## Giới thiệu

### Mongoose là gì và tại sao cần nó?

Mongoose là một Object Document Mapper (ODM) cho MongoDB và Node.js. Nó cung cấp một layer abstraction giúp bạn làm việc với MongoDB một cách dễ dàng và an toàn hơn.

**🤔 Tại sao không dùng MongoDB driver trực tiếp?**

```javascript
// MongoDB Native Driver - Phức tạp
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myapp');
const collection = db.collection('users');

// Insert document
await collection.insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  createdAt: new Date()
});

// Find documents
const users = await collection.find({ age: { $gte: 18 } }).toArray();
```

```javascript
// Mongoose - Đơn giản và type-safe
const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0, max: 120 }
});

const User = mongoose.model('User', userSchema);

// Create user
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
await user.save();

// Find users
const users = await User.find({ age: { $gte: 18 } });
```

### Lợi ích của Mongoose:

**🛡️ Type Safety & Validation**

*   Schema-based validation
*   Type checking
*   Custom validators
*   Required fields

**🔧 Developer Experience**

*   Intuitive API
*   Auto-completion
*   Better error messages
*   Middleware support

**⚡ Performance**

*   Query optimization
*   Index management
*   Connection pooling
*   Caching

**🔄 Data Consistency**

*   Schema enforcement
*   Default values
*   Transform functions
*   Virtual properties

## Setup và Installation

### Chuẩn bị môi trường

```bash
# Install dependencies
npm install mongoose

# Optional: Install development tools
npm install -D @types/mongoose
```

### Kết nối MongoDB

```javascript
// database.js
const mongoose = require('mongoose');

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp', options);
    console.log('✅ Connected to MongoDB successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 MongoDB connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('💥 Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = { connectDB };
```

**💡 Best Practices:**

*   Sử dụng connection pooling
*   Handle connection events
*   Graceful shutdown
*   Environment variables cho connection string

## Schema và Model

### Schema - Định nghĩa cấu trúc dữ liệu

Schema là trái tim của Mongoose. Nó định nghĩa cấu trúc, validation rules, và behavior của documents.

#### Basic Schema - Schema cơ bản

```javascript
const mongoose = require('mongoose');

// Basic user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot be more than 120']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model
const User = mongoose.model('User', userSchema);
```

#### Advanced Schema - Schema nâng cao

```javascript
// Advanced schema với nhiều tính năng
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // Tạo index cho field này
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    set: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'books', 'food'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: Map,
    of: String
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  stock: {
    quantity: {
      type: Number,
      min: 0,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  }
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
  collection: 'products', // Tên collection tùy chỉnh
  strict: true // Chỉ lưu fields được định nghĩa trong schema
});

// Virtual properties - Computed fields
productSchema.virtual('isLowStock').get(function() {
  return this.stock.quantity <= this.stock.lowStockThreshold;
});

// Instance methods
productSchema.methods.addReview = function(userId, rating, comment) {
  this.reviews.push({
    user: userId,
    rating,
    comment
  });
  return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

// Indexes
productSchema.index({ name: 'text', category: 1 });
productSchema.index({ 'stock.quantity': 1 });

const Product = mongoose.model('Product', productSchema);
```

#### Schema Options - Tùy chọn schema

```javascript
const schemaOptions = {
  // Timestamps
  timestamps: true, // Tự động thêm createdAt và updatedAt
  
  // Collection name
  collection: 'custom_collection_name',
  
  // Strict mode
  strict: true, // Chỉ lưu fields được định nghĩa
  
  // Version key
  versionKey: false, // Tắt __v field
  
  // Auto index
  autoIndex: true,
  
  // Schema level options
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

const mySchema = new mongoose.Schema({
  // ... fields
}, schemaOptions);
```

## CRUD Operations

### Create - Tạo documents

```javascript
// Method 1: Using constructor
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
await user.save();

// Method 2: Using create
const user = await User.create({
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 25
});

// Method 3: Using insertMany
const users = await User.insertMany([
  { name: 'Alice', email: 'alice@example.com', age: 28 },
  { name: 'Bob', email: 'bob@example.com', age: 32 },
  { name: 'Charlie', email: 'charlie@example.com', age: 29 }
]);

// Method 4: Using save with validation
const user = new User({
  name: 'David',
  email: 'david@example.com',
  age: 35
});

try {
  await user.save();
  console.log('✅ User saved successfully');
} catch (error) {
  console.error('❌ Validation error:', error.message);
}
```

### Read - Đọc documents

```javascript
// Find all documents
const allUsers = await User.find();

// Find with filter
const activeUsers = await User.find({ isActive: true });

// Find one document
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const userById = await User.findById('507f1f77bcf86cd799439011');

// Find with projection (select specific fields)
const users = await User.find({}, 'name email age');

// Find with options
const users = await User.find({ age: { $gte: 18 } })
  .sort({ createdAt: -1 })
  .limit(10)
  .skip(20)
  .select('name email age')
  .lean(); // Return plain JavaScript objects

// Count documents
const userCount = await User.countDocuments({ isActive: true });

// Check if document exists
const exists = await User.exists({ email: 'john@example.com' });
```

### Update - Cập nhật documents

```javascript
// Method 1: Using findByIdAndUpdate
const updatedUser = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { age: 31 },
  { new: true, runValidators: true }
);

// Method 2: Using findOneAndUpdate
const updatedUser = await User.findOneAndUpdate(
  { email: 'john@example.com' },
  { $inc: { age: 1 } }, // Increment age by 1
  { new: true }
);

// Method 3: Using updateOne
const result = await User.updateOne(
  { email: 'john@example.com' },
  { $set: { isActive: false } }
);

// Method 4: Using updateMany
const result = await User.updateMany(
  { age: { $lt: 18 } },
  { $set: { isActive: false } }
);

// Method 5: Using save (for complex updates)
const user = await User.findById('507f1f77bcf86cd799439011');
user.age = 31;
user.name = 'John Updated';
await user.save();
```

### Delete - Xóa documents

```javascript
// Method 1: Using findByIdAndDelete
const deletedUser = await User.findByIdAndDelete('507f1f77bcf86cd799439011');

// Method 2: Using findOneAndDelete
const deletedUser = await User.findOneAndDelete({ email: 'john@example.com' });

// Method 3: Using deleteOne
const result = await User.deleteOne({ email: 'john@example.com' });

// Method 4: Using deleteMany
const result = await User.deleteMany({ isActive: false });

// Method 5: Using remove (deprecated, use deleteOne/deleteMany)
// await User.remove({ email: 'john@example.com' });
```

## Validation

### Built-in Validators - Validator có sẵn

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be an integer'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: 'Role must be user, admin, or moderator'
    },
    default: 'user'
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});
```

### Custom Validators - Validator tùy chỉnh

```javascript
// Async validator
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function(email) {
        // Check if email domain is allowed
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
        const domain = email.split('@')[1];
        return allowedDomains.includes(domain);
      },
      message: 'Email domain not allowed'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(username) {
        // Username must be 3-20 characters, alphanumeric and underscore only
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
      },
      message: 'Username must be 3-20 characters, alphanumeric and underscore only'
    }
  }
});

// Cross-field validation
const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 }
  }],
  totalAmount: { type: Number, min: 0 },
  discount: { type: Number, min: 0, max: 100 }
});

orderSchema.pre('save', function(next) {
  // Validate that total amount is positive after discount
  const discountedAmount = this.totalAmount * (1 - this.discount / 100);
  if (discountedAmount <= 0) {
    next(new Error('Total amount after discount must be positive'));
  }
  next();
});
```

## Middleware

### Pre/Post Hooks - Middleware hooks

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastLogin: Date,
  loginCount: { type: Number, default: 0 }
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password before saving
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save middleware
userSchema.post('save', function(doc, next) {
  console.log(`User ${doc.name} saved successfully`);
  next();
});

// Pre-find middleware
userSchema.pre('find', function() {
  this.where({ isActive: true });
});

// Pre-remove middleware
userSchema.pre('remove', async function(next) {
  // Clean up related data
  await this.model('Order').deleteMany({ user: this._id });
  next();
});

// Post-remove middleware
userSchema.post('remove', function(doc, next) {
  console.log(`User ${doc.name} removed successfully`);
  next();
});
```

### Query Middleware - Middleware cho queries

```javascript
// Pre-find middleware
userSchema.pre('find', function() {
  this.startTime = Date.now();
});

// Post-find middleware
userSchema.post('find', function(docs) {
  const duration = Date.now() - this.startTime;
  console.log(`Query took ${duration}ms`);
});

// Pre-update middleware
userSchema.pre('updateOne', function() {
  this.set({ updatedAt: new Date() });
});

// Pre-aggregate middleware
userSchema.pre('aggregate', function() {
  this.pipeline().unshift({ $match: { isActive: true } });
});
```

## Relationships

### References - Tham chiếu

```javascript
// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

// Post schema with user reference
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Create user and post
const user = await User.create({ name: 'John', email: 'john@example.com' });
const post = await Post.create({
  title: 'My First Post',
  content: 'Hello World!',
  author: user._id,
  tags: ['javascript', 'mongodb']
});

// Populate author information
const postWithAuthor = await Post.findById(post._id).populate('author');
console.log(postWithAuthor.author.name); // 'John'

// Populate with specific fields
const postWithAuthorName = await Post.findById(post._id)
  .populate('author', 'name email');

// Populate with conditions
const posts = await Post.find()
  .populate({
    path: 'author',
    match: { isActive: true },
    select: 'name email'
  });
```

### Embedded Documents - Documents nhúng

```javascript
// Comment schema
const commentSchema = new mongoose.Schema({
  content: String,
  author: {
    name: String,
    email: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Post schema with embedded comments
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [commentSchema],
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
});

// Add comment to post
const post = await Post.findById(postId);
post.comments.push({
  content: 'Great post!',
  author: { name: 'Alice', email: 'alice@example.com' }
});
await post.save();

// Query embedded documents
const postsWithComments = await Post.find({
  'comments.author.name': 'Alice'
});

// Update embedded document
await Post.updateOne(
  { _id: postId, 'comments._id': commentId },
  { $set: { 'comments.$.content': 'Updated comment' } }
);
```

## Queries

### Advanced Queries - Queries nâng cao

```javascript
// Complex queries
const users = await User.find({
  $and: [
    { age: { $gte: 18 } },
    { isActive: true },
    {
      $or: [
        { email: { $regex: /gmail\.com$/ } },
        { email: { $regex: /yahoo\.com$/ } }
      ]
    }
  ]
});

// Text search
const products = await Product.find({
  $text: { $search: 'laptop gaming' }
}).sort({ score: { $meta: 'textScore' } });

// Array queries
const users = await User.find({
  tags: { $in: ['developer', 'designer'] }
});

const users = await User.find({
  tags: { $all: ['javascript', 'nodejs'] }
});

const users = await User.find({
  tags: { $size: 3 }
});

// Exists queries
const usersWithPhone = await User.find({
  phone: { $exists: true }
});

// Type queries
const users = await User.find({
  age: { $type: 'number' }
});

// Regular expressions
const users = await User.find({
  name: { $regex: /^john/i }
});
```

### Query Options - Tùy chọn query

```javascript
// Pagination
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const users = await User.find({ isActive: true })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .select('name email age')
  .lean();

// Count total documents for pagination
const total = await User.countDocuments({ isActive: true });
const totalPages = Math.ceil(total / limit);

// Distinct values
const categories = await Product.distinct('category');

// Random documents
const randomUser = await User.aggregate([
  { $sample: { size: 1 } }
]);

// Find with options
const users = await User.find({ age: { $gte: 18 } }, null, {
  sort: { name: 1 },
  limit: 10,
  skip: 20,
  lean: true
});
```

## Aggregation

### Aggregation Pipeline - Pipeline tổng hợp

```javascript
// Basic aggregation
const result = await User.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: '$role', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Complex aggregation
const orderStats = await Order.aggregate([
  // Match orders from last 30 days
  {
    $match: {
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  },
  // Lookup user information
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  // Unwind user array
  { $unwind: '$user' },
  // Group by user
  {
    $group: {
      _id: '$user._id',
      userName: { $first: '$user.name' },
      totalOrders: { $sum: 1 },
      totalAmount: { $sum: '$totalAmount' },
      avgOrderValue: { $avg: '$totalAmount' }
    }
  },
  // Sort by total amount
  { $sort: { totalAmount: -1 } },
  // Limit top 10
  { $limit: 10 }
]);

// Date aggregation
const dailySales = await Order.aggregate([
  {
    $match: {
      createdAt: { $gte: new Date('2023-01-01') }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      },
      totalSales: { $sum: '$totalAmount' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
  }
]);
```

## Best Practices

### Performance Optimization - Tối ưu hiệu suất

```javascript
// Use lean() for read-only operations
const users = await User.find({ isActive: true }).lean();

// Use projection to select only needed fields
const users = await User.find({}, 'name email');

// Use indexes
userSchema.index({ email: 1 });
userSchema.index({ age: 1, isActive: 1 });

// Use compound indexes
userSchema.index({ category: 1, price: 1 });

// Use text indexes for search
productSchema.index({ name: 'text', description: 'text' });

// Use covered queries
userSchema.index({ email: 1, name: 1 });
const users = await User.find({ email: 'john@example.com' }, 'name');

// Use bulk operations
const bulkOps = users.map(user => ({
  updateOne: {
    filter: { _id: user._id },
    update: { $set: { lastLogin: new Date() } }
  }
}));
await User.bulkWrite(bulkOps);
```

### Error Handling - Xử lý lỗi

```javascript
// Custom error handling
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('User already exists');
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}

// Global error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle validation errors
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Duplicate key error'));
  } else {
    next(error);
  }
});
```

### Connection Management - Quản lý kết nối

```javascript
// Connection with retry logic
async function connectWithRetry() {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Connected to MongoDB');
      break;
    } catch (error) {
      retries++;
      console.error(`❌ Connection attempt ${retries} failed:`, error.message);
      if (retries === maxRetries) {
        console.error('💥 Max retries reached, exiting...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error during shutdown:', error);
    process.exit(1);
  }
});
```

## Ví dụ thực tế

### E-commerce System - Hệ thống thương mại điện tử

```javascript
// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  stock: { type: Number, default: 0, min: 0 },
  images: [String],
  tags: [String],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Order schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 },
    price: { type: Number, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Business logic
class ProductService {
  static async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }
  
  static async updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    
    product.stock -= quantity;
    return await product.save();
  }
  
  static async addReview(productId, userId, rating, comment) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId.toString()
    );
    
    if (existingReview) {
      throw new Error('User already reviewed this product');
    }
    
    product.reviews.push({ user: userId, rating, comment });
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.reviewCount = product.reviews.length;
    
    return await product.save();
  }
  
  static async searchProducts(query, filters = {}) {
    const { category, minPrice, maxPrice, minRating, sortBy = 'name', sortOrder = 'asc' } = filters;
    
    const searchQuery = {
      $text: { $search: query }
    };
    
    if (category) searchQuery.category = category;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = minPrice;
      if (maxPrice) searchQuery.price.$lte = maxPrice;
    }
    if (minRating) searchQuery.averageRating = { $gte: minRating };
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    return await Product.find(searchQuery)
      .sort(sortOptions)
      .populate('reviews.user', 'name')
      .lean();
  }
}

// Usage
const product = await ProductService.createProduct({
  name: 'Gaming Laptop',
  description: 'High-performance gaming laptop',
  price: 1299.99,
  category: 'electronics',
  stock: 10,
  tags: ['gaming', 'laptop', 'performance']
});

await ProductService.addReview(product._id, userId, 5, 'Excellent gaming performance!');

const searchResults = await ProductService.searchProducts('gaming laptop', {
  category: 'electronics',
  minPrice: 1000,
  maxPrice: 1500,
  minRating: 4,
  sortBy: 'price',
  sortOrder: 'desc'
});
```

## Kết luận

### Mongoose - Công cụ không thể thiếu

Mongoose đã biến việc làm việc với MongoDB trở nên đơn giản và mạnh mẽ. Với schema validation, middleware, và rich query API, nó cung cấp tất cả công cụ cần thiết để xây dựng ứng dụng Node.js với MongoDB.

**🎯 Những điều quan trọng cần nhớ:**

1.  **Schema First**: Định nghĩa schema rõ ràng trước khi implement
2.  **Validation**: Sử dụng built-in và custom validators
3.  **Middleware**: Tận dụng pre/post hooks cho business logic
4.  **Performance**: Sử dụng indexes và lean queries
5.  **Relationships**: Chọn đúng loại relationship cho use case

**🚀 Next Steps:**

*   Tìm hiểu về MongoDB aggregation
*   Implement caching strategies
*   Optimize queries cho production
*   Set up monitoring và logging

**💡 Pro Tips:**

*   Luôn sử dụng `lean()` cho read-only operations
*   Tạo indexes cho fields thường query
*   Handle connection errors gracefully
*   Use bulk operations cho batch updates
*   Implement proper error handling

Mongoose không chỉ là một ODM - nó là cầu nối giữa MongoDB và Node.js, giúp bạn xây dựng ứng dụng mạnh mẽ và scalable.

**Tài liệu tham khảo:**

*   [Mongoose Official Documentation](https://mongoosejs.com/docs/)
*   [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
*   [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
*   [Mongoose Best Practices](https://mongoosejs.com/docs/guide.html)