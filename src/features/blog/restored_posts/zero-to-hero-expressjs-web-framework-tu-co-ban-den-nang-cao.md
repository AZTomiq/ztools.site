---
title: "Zero to Hero: ExpressJS - Web Framework Từ Cơ Bản đếN Nâng Cao"
date: 2025-06-26T08:59:38.000Z
tags: [Authentication, Database, ExpressJS, Middleware, Node.js, REST API, Routing, Testing, Web Framework]
categories: [Backend, Node.js, Web Development]
---

# Zero to Hero: ExpressJS - Web Framework từ cơ bản đến nâng cao

ExpressJS là web framework phổ biến nhất cho Node.js, cung cấp các tính năng mạnh mẽ để xây dựng web applications và REST APIs một cách nhanh chóng và hiệu quả.

## 1\. Giới thiệu và khái niệm cơ bản

### ExpressJS là gì?

ExpressJS là một web application framework cho Node.js, cung cấp các tính năng robust để xây dựng single-page, multi-page và hybrid web applications. Nó được thiết kế để tạo ra web applications và APIs một cách nhanh chóng.

### Đặc điểm chính:

*   **Minimalist**: Framework nhẹ và linh hoạt
*   **Unopinionated**: Không áp đặt kiến trúc cụ thể
*   **Fast**: Hiệu suất cao và ổn định
*   **Extensible**: Dễ dàng mở rộng với middleware
*   **Routing**: Hệ thống routing mạnh mẽ
*   **Middleware**: Kiến trúc middleware linh hoạt
*   **Template Engines**: Hỗ trợ nhiều template engines
*   **Static Files**: Phục vụ static files dễ dàng

### Use cases phổ biến:

*   **REST APIs**: Xây dựng RESTful APIs
*   **Web Applications**: Single-page và multi-page apps
*   **Microservices**: Backend services nhỏ
*   **Real-time Apps**: WebSocket và real-time features
*   **Mobile Backend**: API cho mobile apps
*   **Proxy Server**: Reverse proxy và load balancer
*   **File Upload**: Handle file uploads
*   **Authentication**: User authentication và authorization

### ExpressJS vs Other Frameworks

```javascript
// ExpressJS - Minimalist
app.get('/users', (req, res) => {
  res.json(users);
});

// vs Koa - More modern
app.use(async (ctx) => {
  ctx.body = users;
});

// vs Fastify - Performance focused
fastify.get('/users', async (request, reply) => {
  return users;
});
```

### ExpressJS Architecture

```javascript
// Request Flow
Client Request → Express App → Middleware Stack → Route Handler → Response

// Middleware Stack
app.use(morgan('combined'));        // Logging
app.use(express.json());            // Body parsing
app.use(express.static('public'));  // Static files
app.use('/api', apiRouter);         // API routes
app.use(errorHandler);              // Error handling
```

### Core Concepts

```javascript
// Application
const express = require('express');
const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 2\. Cài đặt và setup môi trường

### Project Setup

```bash
# Create project directory
mkdir express-app
cd express-app

# Initialize npm
npm init -y

# Install Express
npm install express

# Install development dependencies
npm install --save-dev nodemon eslint prettier

# Install additional packages
npm install cors helmet morgan dotenv
npm install express-rate-limit express-validator
npm install jsonwebtoken bcryptjs
npm install mongoose sequelize prisma
npm install jest supertest
```

### Basic Project Structure

```plaintext
express-app/
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── authRoutes.js
│   │   └── apiRoutes.js
│   ├── config/
│   │   ├── database.js
│   │   └── passport.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── tests/
│   ├── integration/
│   └── unit/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Package.json Configuration

```json
{
  "name": "express-app",
  "version": "1.0.0",
  "description": "ExpressJS application",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/"
  },
  "keywords": ["express", "nodejs", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.3.3"
  }
}
```

### Environment Configuration

```bash
# .env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

```javascript
// config/config.js
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};
```

### ESLint Configuration

```json
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }
}
```

### VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 3\. Cú pháp và cấu trúc cơ bản

### Basic Express App

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### HTTP Methods

```javascript
// GET - Retrieve data
app.get('/users', (req, res) => {
  res.json(users);
});

// POST - Create data
app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Update entire resource
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  // Update logic
  res.json({ message: 'User updated' });
});

// PATCH - Partial update
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  // Partial update logic
  res.json({ message: 'User partially updated' });
});

// DELETE - Remove data
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  // Delete logic
  res.json({ message: 'User deleted' });
});
```

### Route Parameters

```javascript
// Single parameter
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Optional parameters
app.get('/users/:id?', (req, res) => {
  const { id } = req.params;
  if (id) {
    res.json({ userId: id });
  } else {
    res.json({ message: 'All users' });
  }
});

// Regex parameters
app.get('/users/:id([0-9]+)', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});
```

### Query Parameters

```javascript
// GET /users?page=1&limit=10&sort=name
app.get('/users', (req, res) => {
  const { page = 1, limit = 10, sort = 'name' } = req.query;
  
  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    message: 'Users retrieved'
  });
});

// Complex query handling
app.get('/search', (req, res) => {
  const { q, category, price_min, price_max } = req.query;
  
  const searchParams = {
    query: q,
    category: category ? category.split(',') : [],
    priceRange: {
      min: parseFloat(price_min) || 0,
      max: parseFloat(price_max) || Infinity
    }
  };
  
  res.json(searchParams);
});
```

### Request Body

```javascript
// JSON body
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  const newUser = { name, email, age };
  res.status(201).json(newUser);
});

// Form data
app.post('/upload', (req, res) => {
  const { title, description } = req.body;
  res.json({ title, description });
});

// Raw body
app.post('/webhook', (req, res) => {
  const rawBody = req.body;
  console.log('Webhook received:', rawBody);
  res.json({ received: true });
});
```

### Response Methods

```javascript
// JSON response
app.get('/api/data', (req, res) => {
  res.json({ message: 'Success', data: [] });
});

// Status codes
app.post('/users', (req, res) => {
  // Create user logic
  res.status(201).json({ message: 'User created' });
});

app.put('/users/:id', (req, res) => {
  // Update logic
  res.status(200).json({ message: 'User updated' });
});

app.delete('/users/:id', (req, res) => {
  // Delete logic
  res.status(204).send();
});

// Redirect
app.get('/old-page', (req, res) => {
  res.redirect('/new-page');
});

// Download file
app.get('/download', (req, res) => {
  res.download('./files/document.pdf');
});

// Send file
app.get('/file', (req, res) => {
  res.sendFile('./files/image.jpg', { root: __dirname });
});
```

## 4\. Các tính năng nâng cao

### Middleware

```javascript
// Custom middleware
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply middleware
app.use(logger);
app.use('/api', auth);
```

### Router

```javascript
// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

// app.js
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
```

### Error Handling

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

// Usage
app.get('/users/:id', catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  res.json(user);
}));

app.use(errorHandler);
```

### Authentication & Authorization

```javascript
// JWT Authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
};

module.exports = authController;
```

### File Upload

```javascript
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

const uploadController = {
  // Single file upload
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  },
  
  // Multiple files upload
  async uploadMultipleFiles(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
      
      res.json({
        message: 'Files uploaded successfully',
        files
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
};

module.exports = { upload, uploadController };
```

### Database Integration

```javascript
// MongoDB with Mongoose
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// User Controller
const userController = {
  async getAllUsers(req, res) {
    const users = await User.find().select('-password');
    res.json(users);
  },
  
  async getUserById(req, res) {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  },
  
  async createUser(req, res) {
    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  }
};
```

### Validation

```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Usage
app.post('/users', validateUser, userController.createUser);
```

## 5\. Best practices và patterns

### Project Structure

```javascript
// MVC Pattern
// Model - Data and business logic
class User {
  static async findById(id) { /* ... */ }
  static async create(data) { /* ... */ }
}

// View - Response formatting
const userView = {
  format(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  }
};

// Controller - Request handling
const userController = {
  async getUser(req, res) {
    const user = await User.findById(req.params.id);
    res.json(userView.format(user));
  }
};
```

### Security Best Practices

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Input sanitization
app.use(express.json({ limit: '10kb' })); // Limit payload size

// XSS protection
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Performance Optimization

```javascript
// Compression
const compression = require('compression');
app.use(compression());

// Caching
const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const cachedBody = cache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
      return;
    }
    
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

// Usage
app.get('/api/users', cacheMiddleware(300), userController.getAllUsers);
```

### Logging

```javascript
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});
```

## 6\. Ví dụ thực tế

### REST API Example

```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Authentication System

```javascript
// authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
};

module.exports = authController;
```

### CRUD Operations

```javascript
// userController.js
const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      const users = await User.find(query)
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      const count = await User.countDocuments(query);
      
      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
  
  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },
  
  // Update user
  async updateUser(req, res) {
    try {
      const { name, email } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  },
  
  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
};

module.exports = userController;
```

### File Upload System

```javascript
// uploadController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

const uploadController = {
  // Single file upload
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  },
  
  // Multiple files upload
  async uploadMultipleFiles(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
      
      res.json({
        message: 'Files uploaded successfully',
        files
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
};

module.exports = { upload, uploadController };
```

## 7\. Troubleshooting và tips

### Common Issues

#### 1\. CORS Errors

```javascript
// Problem: CORS errors in browser
// Solution: Configure CORS properly
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 2\. Body Parser Issues

```javascript
// Problem: req.body is undefined
// Solution: Add body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For raw body
app.use(express.raw({ type: 'application/json' }));
```

#### 3\. Async/Await Error Handling

```javascript
// Problem: Unhandled promise rejections
// Solution: Use try-catch or error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

#### 4\. Static Files Not Serving

```javascript
// Problem: Static files not accessible
// Solution: Configure static middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// With options
app.use('/static', express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

#### 5\. Session Issues

```javascript
// Problem: Sessions not persisting
// Solution: Configure session properly
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

### Debugging Tips

#### 1\. Request Logging

```javascript
// Morgan logging
app.use(morgan('combined'));

// Custom logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
```

#### 2\. Error Tracking

```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Log to external service
  // logger.error(err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
```

#### 3\. Performance Monitoring

```javascript
// Response time middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

#### 4\. Memory Leaks

```javascript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`
  });
}, 30000);
```

## 8\. Tài liệu tham khảo

### Official Documentation

*   [Express.js Documentation](https://expressjs.com/)
*   [Node.js Documentation](https://nodejs.org/docs/)
*   [Express.js API Reference](https://expressjs.com/en/4x/api.html)

### Learning Resources

*   [Express.js Guide](https://expressjs.com/en/guide/routing.html)
*   [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
*   [Express.js Performance Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html)

### Tools & Middleware

*   [Helmet](https://helmetjs.github.io/) - Security middleware
*   [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
*   [CORS](https://github.com/expressjs/cors) - Cross-origin resource sharing
*   [Multer](https://github.com/expressjs/multer) - File upload handling
*   [Express Validator](https://express-validator.github.io/) - Input validation

### Testing

*   [Jest](https://jestjs.io/) - Testing framework
*   [Supertest](https://github.com/visionmedia/supertest) - HTTP testing
*   [Mocha](https://mochajs.org/) - Test runner
*   [Chai](https://www.chaijs.com/) - Assertion library

### Database Integration

*   [Mongoose](https://mongoosejs.com/) - MongoDB ODM
*   [Sequelize](https://sequelize.org/) - SQL ORM
*   [Prisma](https://www.prisma.io/) - Database toolkit
*   [TypeORM](https://typeorm.io/) - TypeScript ORM

### Authentication & Security

*   [Passport.js](http://www.passportjs.org/) - Authentication middleware
*   [JWT](https://jwt.io/) - JSON Web Tokens
*   [Bcrypt](https://github.com/dcodeIO/bcrypt.js) - Password hashing
*   [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting

* * *

**🎯 Kết quả sau khi học ExpressJS:**

*   ✅ Hiểu sâu về ExpressJS architecture và middleware
*   ✅ Thành thạo routing và HTTP methods
*   ✅ Build RESTful APIs và web applications
*   ✅ Implement authentication và authorization
*   ✅ Handle file uploads và static files
*   ✅ Integrate databases và ORMs
*   ✅ Apply security best practices
*   ✅ Test và deploy ExpressJS applications