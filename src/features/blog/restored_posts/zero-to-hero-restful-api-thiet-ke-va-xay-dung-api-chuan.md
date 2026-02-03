---
title: "Zero to Hero: RESTful API - Thiết Kế Và Xây Dựng API Chuẩn"
date: 2025-06-26T09:31:12.000Z
tags: [API Design, Backend, Express.js, HTTP, JSON, Node.js, RESTful API, Web Services]
categories: [Backend, API, Programming]
---

# Zero to Hero: RESTful API - Thiết kế và xây dựng API chuẩn

RESTful API là kiến trúc API phổ biến nhất hiện nay, sử dụng HTTP protocol để tạo ra các web services có thể mở rộng và dễ bảo trì.

## 1\. Giới thiệu và khái niệm cơ bản

### RESTful API là gì?

REST (Representational State Transfer) là một kiến trúc phần mềm cho distributed systems, đặc biệt là World Wide Web. RESTful API tuân theo các nguyên tắc của REST.

### Đặc điểm chính:

*   **Stateless**: Mỗi request độc lập, không lưu trạng thái
*   **Client-Server**: Tách biệt client và server
*   **Cacheable**: Có thể cache responses
*   **Uniform Interface**: Giao diện thống nhất
*   **Layered System**: Hệ thống phân lớp
*   **Code on Demand**: Có thể tải code khi cần
*   **Resource-based**: Dựa trên tài nguyên
*   **HTTP-based**: Sử dụng HTTP protocol

### Lịch sử phát triển:

*   **2000**: Roy Fielding giới thiệu REST trong luận án tiến sĩ
*   **2002**: REST được áp dụng rộng rãi cho web services
*   **2006**: REST trở thành chuẩn cho API design
*   **2010s**: RESTful APIs trở thành chuẩn cho web development

### REST vs SOAP vs GraphQL

| Feature | REST | SOAP | GraphQL |
| --- | --- | --- | --- |
| **Protocol** | HTTP | HTTP/SMTP | HTTP |
| **Data Format** | JSON/XML | XML | JSON |
| **Over-fetching** | Yes | Yes | No |
| **Under-fetching** | Yes | Yes | No |
| **Caching** | Excellent | Limited | Good |
| **Learning Curve** | Easy | Hard | Medium |
| **Performance** | Good | Slow | Excellent |

### HTTP Methods và ý nghĩa

```http
GET     /api/users          # Lấy danh sách users (Read)
GET     /api/users/123      # Lấy user có id=123 (Read)
POST    /api/users          # Tạo user mới (Create)
PUT     /api/users/123      # Cập nhật toàn bộ user (Update)
PATCH   /api/users/123      # Cập nhật một phần user (Update)
DELETE  /api/users/123      # Xóa user (Delete)
HEAD    /api/users          # Lấy headers (Read metadata)
OPTIONS /api/users          # Lấy available methods (Read options)
```

## 2\. Cài đặt và setup môi trường

### Development Tools

```bash
# Node.js và npm
node --version
npm --version

# Package manager
npm init -y

# Essential packages
npm install express cors helmet express-rate-limit
npm install express-validator joi
npm install jsonwebtoken bcryptjs
npm install dotenv

# Development dependencies
npm install --save-dev nodemon jest supertest
npm install --save-dev eslint prettier

# API testing tools
npm install -g postman
# hoặc sử dụng Insomnia, Thunder Client
```

### Project Structure

```plaintext
api-project/
├── src/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── postController.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── postModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── postRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── database.js
│   │   └── logger.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── tests/
│   ├── user.test.js
│   └── post.test.js
├── docs/
│   └── api.md
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Environment Setup

```bash
# .env file
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapi
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Basic Server Setup

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

## 3\. Cú pháp và cấu trúc cơ bản

### HTTP Status Codes

```javascript
// 2xx Success
200: 'OK',                    // Request thành công
201: 'Created',               // Tạo resource thành công
202: 'Accepted',              // Request được chấp nhận
204: 'No Content',            // Thành công nhưng không có content

// 4xx Client Errors
400: 'Bad Request',           // Request không hợp lệ
401: 'Unauthorized',          // Chưa xác thực
403: 'Forbidden',             // Không có quyền truy cập
404: 'Not Found',             // Resource không tồn tại
409: 'Conflict',              // Xung đột dữ liệu
422: 'Unprocessable Entity',  // Dữ liệu không thể xử lý
429: 'Too Many Requests',     // Quá nhiều requests

// 5xx Server Errors
500: 'Internal Server Error', // Lỗi server
502: 'Bad Gateway',           // Lỗi gateway
503: 'Service Unavailable',   // Service không khả dụng
```

### Response Format Standards

```javascript
// Success Response
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-27T10:30:00Z"
  },
  "message": "User retrieved successfully",
  "timestamp": "2024-01-27T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-27T10:30:00Z"
}

// Pagination Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-27T10:30:00Z"
}
```

### URL Design Patterns

```javascript
// ✅ Tốt - RESTful
GET    /api/users                    // Lấy danh sách users
GET    /api/users/123                // Lấy user có id=123
POST   /api/users                    // Tạo user mới
PUT    /api/users/123                // Cập nhật toàn bộ user
PATCH  /api/users/123                // Cập nhật một phần user
DELETE /api/users/123                // Xóa user

GET    /api/users/123/posts          // Lấy posts của user
GET    /api/users/123/posts/456      // Lấy post cụ thể của user
POST   /api/users/123/posts          // Tạo post cho user

GET    /api/posts?category=tech      // Filter posts
GET    /api/posts?page=2&limit=10    // Pagination
GET    /api/posts?search=javascript  // Search posts

// ❌ Không tốt - Không RESTful
GET    /api/getUsers
POST   /api/createUser
PUT    /api/updateUser/123
DELETE /api/deleteUser/123
GET    /api/userPosts/123
```

### Query Parameters

```javascript
// Pagination
GET /api/users?page=1&limit=10

// Filtering
GET /api/users?status=active&role=admin

// Sorting
GET /api/users?sort=name&order=asc
GET /api/users?sort=createdAt&order=desc

// Searching
GET /api/users?search=john
GET /api/users?q=john+doe

// Field selection
GET /api/users?fields=id,name,email

// Date range
GET /api/users?startDate=2024-01-01&endDate=2024-01-31
```

## 4\. Các tính năng nâng cao

### Authentication & Authorization

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized to access this route'
        }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Not authorized to access this route'
      }
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'User role is not authorized'
        }
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

### Validation Middleware

```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      }
    });
  }
  next();
};

const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validatePost,
  handleValidationErrors
};
```

### Error Handling

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
```

### Caching Strategy

```javascript
// middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original send function
      const originalSend = res.json;
      
      // Override send function
      res.json = function(data) {
        client.setex(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
```

### Rate Limiting

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: {
        message: message || 'Too many requests from this IP'
      }
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many login attempts, please try again later'
);

const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100 // 100 requests per window
);

module.exports = { authLimiter, apiLimiter };
```

## 5\. Best practices và patterns

### API Versioning

```javascript
// Versioning strategies
// 1. URL Versioning
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v2/users', userRoutesV2);

// 2. Header Versioning
app.use('/api/users', (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});

// 3. Query Parameter Versioning
app.use('/api/users', (req, res, next) => {
  const version = req.query.version || 'v1';
  req.apiVersion = version;
  next();
});

// Version-specific routes
const userRoutesV1 = require('./routes/v1/userRoutes');
const userRoutesV2 = require('./routes/v2/userRoutes');
```

### Documentation Standards

```javascript
// Using JSDoc for API documentation
/**
 * @api {get} /api/users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [limit=10] Items per page
 * @apiParam {String} [search] Search term
 * 
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object[]} data Array of users
 * @apiSuccess {Number} data.id User ID
 * @apiSuccess {String} data.name User name
 * @apiSuccess {String} data.email User email
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": [
 *         {
 *           "id": 1,
 *           "name": "John Doe",
 *           "email": "john@example.com"
 *         }
 *       ]
 *     }
 */
router.get('/', userController.getUsers);
```

### Security Best Practices

```javascript
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Input sanitization
const xss = require('xss-clean');
app.use(xss());

// Prevent parameter pollution
const hpp = require('hpp');
app.use(hpp());

// SQL injection prevention (if using SQL)
// Use parameterized queries and ORM
```

### Performance Optimization

```javascript
// Database indexing
// models/userModel.js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Create index for faster queries
  },
  name: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Query optimization
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password field
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean(); // Convert to plain JavaScript object for better performance
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
```

## 6\. Ví dụ thực tế

### Complete User API

```javascript
// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

```javascript
// controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User already exists'
        }
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials'
        }
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials'
        }
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      message: 'User logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }
    
    await User.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser
};
```

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.put('/:id', validateUser, updateUser);

// Admin routes
router.use(authorize('admin')); // All routes after this middleware require admin role

router.get('/', getUsers);
router.delete('/:id', deleteUser);

module.exports = router;
```

### Testing API

```javascript
// tests/user.test.js
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const mongoose = require('mongoose');

describe('User API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await User.create(userData);

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await User.create(userData);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
```

## 7\. Troubleshooting và tips

### Common API Issues

```javascript
// 1. CORS Issues
// Solution: Configure CORS properly
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));

// 2. Authentication Issues
// Solution: Check token format and expiration
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({ message: 'No token provided' });
}

// 3. Validation Issues
// Solution: Use proper validation middleware
const { body, validationResult } = require('express-validator');

// 4. Database Connection Issues
// Solution: Add connection error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// 5. Rate Limiting Issues
// Solution: Implement proper rate limiting
const rateLimit = require('express-rate-limit');
```

### Debugging Techniques

```javascript
// 1. Request Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// 2. Response Time Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// 3. Error Logging
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.id
  });
  next(err);
});

// 4. Database Query Logging
mongoose.set('debug', process.env.NODE_ENV === 'development');
```

### Performance Monitoring

```javascript
// 1. Response Time Monitoring
const responseTime = require('response-time');
app.use(responseTime((req, res, time) => {
  if (time > 1000) {
    console.warn(`Slow request: ${req.method} ${req.url} - ${time}ms`);
  }
}));

// 2. Memory Usage Monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`
  });
}, 30000);

// 3. Database Performance
const User = require('./models/userModel');

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text', email: 'text' });

// Use lean() for read-only operations
const users = await User.find().lean();
```

### Security Best Practices

```javascript
// 1. Input Sanitization
const xss = require('xss-clean');
app.use(xss());

// 2. Prevent NoSQL Injection
// Use proper validation and sanitization
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};

// 3. Rate Limiting
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts'
});

// 4. JWT Security
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { 
    expiresIn: '1h',
    issuer: 'your-app',
    audience: 'your-app-users'
  }
);

// 5. Password Security
const bcrypt = require('bcryptjs');
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

## 8\. Tài liệu tham khảo

### Official Documentation

*   [REST API Tutorial](https://restfulapi.net/)
*   [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
*   [Express.js Documentation](https://expressjs.com/)
*   [MongoDB Documentation](https://docs.mongodb.com/)

### API Design Guides

*   [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
*   [Google API Design Guide](https://cloud.google.com/apis/design)
*   [PayPal API Style Guide](https://github.com/paypal/api-standards)
*   [Stripe API Reference](https://stripe.com/docs/api)

### Testing Tools

*   [Postman](https://www.postman.com/)
*   [Insomnia](https://insomnia.rest/)
*   [Thunder Client](https://www.thunderclient.com/)
*   [Supertest](https://github.com/visionmedia/supertest)
*   [Jest](https://jestjs.io/)

### Security Resources

*   [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
*   [JWT.io](https://jwt.io/)
*   [bcrypt.js](https://github.com/dcodeIO/bcrypt.js/)
*   [helmet.js](https://helmetjs.github.io/)

### Performance Tools

*   [New Relic](https://newrelic.com/)
*   [DataDog](https://www.datadoghq.com/)
*   [Lighthouse](https://developers.google.com/web/tools/lighthouse)
*   [WebPageTest](https://www.webpagetest.org/)

### Monitoring & Logging

*   [Winston](https://github.com/winstonjs/winston)
*   [Morgan](https://github.com/expressjs/morgan)
*   [PM2](https://pm2.keymetrics.io/)
*   [Sentry](https://sentry.io/)

### Documentation Tools

*   [Swagger/OpenAPI](https://swagger.io/)
*   [Postman Collections](https://learning.postman.com/docs/postman/collections/)
*   [JSDoc](https://jsdoc.app/)
*   [API Blueprint](https://apiblueprint.org/)

### Development Tools

*   [VS Code](https://code.visualstudio.com/)
*   [Postman](https://www.postman.com/)
*   [MongoDB Compass](https://www.mongodb.com/products/compass)
*   [Robo 3T](https://robomongo.org/)

### Deployment Platforms

*   [Heroku](https://heroku.com/)
*   [Vercel](https://vercel.com/)
*   [Netlify](https://netlify.com/)
*   [AWS](https://aws.amazon.com/)
*   [Google Cloud](https://cloud.google.com/)
*   [Azure](https://azure.microsoft.com/)

* * *

**🎯 Kết quả sau khi học RESTful API:**

*   ✅ Hiểu sâu về REST architecture và HTTP protocol
*   ✅ Thành thạo thiết kế API endpoints và response formats
*   ✅ Implement authentication, authorization và security
*   ✅ Build scalable và maintainable APIs
*   ✅ Test và debug API effectively
*   ✅ Optimize API performance và caching
*   ✅ Deploy và monitor production APIs
*   ✅ Apply API design best practices