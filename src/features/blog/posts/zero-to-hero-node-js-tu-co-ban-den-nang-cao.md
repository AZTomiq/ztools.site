---
title: "Zero to Hero: Node.js - Từ Cơ Bản đếN Nâng Cao"
date: 2025-06-26T08:59:38.000Z
tags: [Async, Backend, Event Loop, Express, JavaScript, Modules, NPM, Node.js, Server, Streams]
categories: [Backend, Node.js, JavaScript]
---

# Zero to Hero: Node.js - Từ cơ bản đến nâng cao

Node.js là runtime environment cho JavaScript, cho phép chạy JavaScript trên server và xây dựng các ứng dụng backend mạnh mẽ.

## 1\. Node.js là gì?

Node.js là JavaScript runtime được xây dựng trên V8 engine của Chrome. Nó cho phép chạy JavaScript bên ngoài browser, tạo ra các ứng dụng server-side, command-line tools, và desktop applications.

### Đặc điểm chính:

*   **Event-driven**: Xử lý bất đồng bộ hiệu quả
*   **Non-blocking I/O**: Không block thread khi chờ I/O
*   **Single-threaded**: Một main thread với event loop
*   **Cross-platform**: Chạy trên Windows, macOS, Linux
*   **NPM**: Package manager lớn nhất thế giới

## 2\. Cài đặt và Setup

### Cài đặt Node.js

```bash
# Tải từ nodejs.org hoặc dùng package manager
# macOS với Homebrew
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows với Chocolatey
choco install nodejs

# Kiểm tra version
node --version
npm --version
```

### Khởi tạo project

```bash
# Tạo thư mục project
mkdir my-node-app
cd my-node-app

# Khởi tạo package.json
npm init -y

# Hoặc tạo với cấu hình
npm init
```

### package.json cơ bản

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "My Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": ["nodejs", "javascript"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 3\. Core Modules

### File System (fs)

```javascript
const fs = require('fs');
const fsPromises = require('fs').promises;

// Synchronous (blocking)
try {
    const data = fs.readFileSync('file.txt', 'utf8');
    console.log(data);
} catch (error) {
    console.error('Error reading file:', error);
}

// Asynchronous (non-blocking)
fs.readFile('file.txt', 'utf8', (error, data) => {
    if (error) {
        console.error('Error reading file:', error);
        return;
    }
    console.log(data);
});

// Promise-based (modern approach)
async function readFile() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

// Writing files
fs.writeFile('output.txt', 'Hello World!', (error) => {
    if (error) {
        console.error('Error writing file:', error);
        return;
    }
    console.log('File written successfully');
});

// Working with directories
fs.mkdir('new-directory', (error) => {
    if (error) {
        console.error('Error creating directory:', error);
        return;
    }
    console.log('Directory created');
});

// Reading directory contents
fs.readdir('.', (error, files) => {
    if (error) {
        console.error('Error reading directory:', error);
        return;
    }
    console.log('Files:', files);
});
```

### Path Module

```javascript
const path = require('path');

// Joining paths
const fullPath = path.join(__dirname, 'files', 'data.txt');
console.log(fullPath);

// Getting file extension
const ext = path.extname('file.txt');
console.log(ext); // .txt

// Getting filename
const filename = path.basename('/path/to/file.txt');
console.log(filename); // file.txt

// Getting directory name
const dirname = path.dirname('/path/to/file.txt');
console.log(dirname); // /path/to

// Resolving relative paths
const absolutePath = path.resolve('./file.txt');
console.log(absolutePath);

// Parsing path
const pathInfo = path.parse('/path/to/file.txt');
console.log(pathInfo);
// {
//   root: '/',
//   dir: '/path/to',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

### HTTP Module

```javascript
const http = require('http');

// Creating HTTP server
const server = http.createServer((req, res) => {
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Handle different routes
    if (req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Hello World!' }));
    } else if (req.url === '/users') {
        res.writeHead(200);
        res.end(JSON.stringify([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ]));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handling server events
server.on('connection', (socket) => {
    console.log('New connection established');
});

server.on('error', (error) => {
    console.error('Server error:', error);
});
```

### URL Module

```javascript
const url = require('url');

// Parsing URL
const parsedUrl = url.parse('https://example.com/path?name=john&age=30', true);
console.log(parsedUrl);
// {
//   protocol: 'https:',
//   host: 'example.com',
//   pathname: '/path',
//   query: { name: 'john', age: '30' }
// }

// Building URL
const builtUrl = url.format({
    protocol: 'https',
    host: 'example.com',
    pathname: '/api/users',
    query: { id: 123, format: 'json' }
});
console.log(builtUrl); // https://example.com/api/users?id=123&format=json

// Resolving relative URLs
const resolvedUrl = url.resolve('https://example.com/api/', 'users');
console.log(resolvedUrl); // https://example.com/api/users
```

## 4\. Event Emitter

```javascript
const EventEmitter = require('events');

// Creating custom event emitter
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Listening to events
myEmitter.on('event', (data) => {
    console.log('Event received:', data);
});

// Emitting events
myEmitter.emit('event', { message: 'Hello World' });

// Once listener (fires only once)
myEmitter.once('onceEvent', () => {
    console.log('This will only fire once');
});

// Error handling
myEmitter.on('error', (error) => {
    console.error('Error occurred:', error);
});

// Practical example: User management
class UserManager extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        this.emit('userAdded', user);
    }

    removeUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.users = this.users.filter(u => u.id !== id);
            this.emit('userRemoved', user);
        }
    }
}

const userManager = new UserManager();

userManager.on('userAdded', (user) => {
    console.log(`User added: ${user.name}`);
});

userManager.on('userRemoved', (user) => {
    console.log(`User removed: ${user.name}`);
});

userManager.addUser({ id: 1, name: 'John' });
userManager.removeUser(1);
```

## 5\. Streams

### Readable Streams

```javascript
const fs = require('fs');

// Reading file as stream
const readStream = fs.createReadStream('large-file.txt', 'utf8');

readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.length, 'bytes');
});

readStream.on('end', () => {
    console.log('Finished reading file');
});

readStream.on('error', (error) => {
    console.error('Error reading file:', error);
});

// Piping streams
const readStream2 = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream2.pipe(writeStream);

// Custom readable stream
const { Readable } = require('stream');

class NumberStream extends Readable {
    constructor(max) {
        super();
        this.max = max;
        this.current = 0;
    }

    _read() {
        if (this.current >= this.max) {
            this.push(null); // End stream
            return;
        }
        
        this.push(this.current.toString() + '\n');
        this.current++;
    }
}

const numberStream = new NumberStream(10);
numberStream.pipe(process.stdout);
```

### Writable Streams

```javascript
const { Writable } = require('stream');

class LoggerStream extends Writable {
    constructor() {
        super();
        this.logs = [];
    }

    _write(chunk, encoding, callback) {
        const log = chunk.toString();
        this.logs.push(log);
        console.log('Logged:', log);
        callback();
    }

    getLogs() {
        return this.logs;
    }
}

const logger = new LoggerStream();
logger.write('First log entry\n');
logger.write('Second log entry\n');
```

### Transform Streams

```javascript
const { Transform } = require('stream');

class UppercaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        const uppercased = chunk.toString().toUpperCase();
        this.push(uppercased);
        callback();
    }
}

const uppercaseTransform = new UppercaseTransform();
process.stdin.pipe(uppercaseTransform).pipe(process.stdout);
```

## 6\. Express.js Framework

### Basic Setup

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ]);
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    // Save user logic here
    res.status(201).json({ id: 3, name, email });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

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
    // Verify token logic here
    req.user = { id: 1, name: 'John' };
    next();
};

// Using middleware
app.use(logger);
app.use('/api', auth);

// Route-specific middleware
app.get('/protected', auth, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});
```

### Router

```javascript
const express = require('express');
const router = express.Router();

// User routes
router.get('/', (req, res) => {
    res.json({ message: 'Users list' });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id}` });
});

router.post('/', (req, res) => {
    const userData = req.body;
    res.status(201).json({ message: 'User created', user: userData });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    res.json({ message: `User ${id} updated`, user: userData });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
});

module.exports = router;

// In main app
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);
```

## 7\. Database Integration

### MongoDB với Mongoose

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Create model
const User = mongoose.model('User', userSchema);

// CRUD operations
async function createUser(userData) {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

async function findUsers() {
    try {
        return await User.find();
    } catch (error) {
        throw error;
    }
}

async function findUserById(id) {
    try {
        return await User.findById(id);
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}
```

### MySQL với mysql2

```javascript
const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CRUD operations
async function createUser(userData) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [userData.name, userData.email, userData.age]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

async function findUsers() {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function findUserById(id) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, userData) {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
            [userData.name, userData.email, userData.age, id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}
```

## 8\. Authentication & Security

### JWT Authentication

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// Hash password
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Compare password
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});
```

### Security Middleware

```javascript
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// Input validation
const { body, validationResult } = require('express-validator');

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

app.post('/users', validateUser, (req, res) => {
    // Create user logic
});
```

## 9\. Testing

### Unit Testing với Jest

```javascript
// userService.js
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        if (!userData.name || !userData.email) {
            throw new Error('Name and email are required');
        }
        return await this.userRepository.create(userData);
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = UserService;

// userService.test.js
const UserService = require('./userService');

// Mock repository
const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn()
};

describe('UserService', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService(mockUserRepository);
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create user with valid data', async () => {
            const userData = { name: 'John', email: 'john@example.com' };
            const expectedUser = { id: 1, ...userData };
            
            mockUserRepository.create.mockResolvedValue(expectedUser);
            
            const result = await userService.createUser(userData);
            
            expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(expectedUser);
        });

        it('should throw error for invalid data', async () => {
            const userData = { name: 'John' }; // Missing email
            
            await expect(userService.createUser(userData))
                .rejects
                .toThrow('Name and email are required');
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            const userId = 1;
            const expectedUser = { id: userId, name: 'John' };
            
            mockUserRepository.findById.mockResolvedValue(expectedUser);
            
            const result = await userService.getUserById(userId);
            
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedUser);
        });

        it('should throw error when user not found', async () => {
            const userId = 999;
            
            mockUserRepository.findById.mockResolvedValue(null);
            
            await expect(userService.getUserById(userId))
                .rejects
                .toThrow('User not found');
        });
    });
});
```

### Integration Testing

```javascript
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('User API', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const response = await request(app)
                .post('/users')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = {
                name: 'John'
                // Missing email
            };

            const response = await request(app)
                .post('/users')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /users', () => {
        it('should return all users', async () => {
            // Create test users first
            await request(app)
                .post('/users')
                .send({ name: 'John', email: 'john@example.com' });

            await request(app)
                .post('/users')
                .send({ name: 'Jane', email: 'jane@example.com' });

            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body).toHaveLength(2);
        });
    });
});
```

## 10\. Deployment & Production

### Environment Configuration

```javascript
// config.js
require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    }
};

module.exports = config;

// .env file
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### PM2 Process Manager

```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'my-node-app',
        script: 'index.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true
    }]
};

// package.json scripts
{
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "pm2:start": "pm2 start ecosystem.config.js",
        "pm2:stop": "pm2 stop my-node-app",
        "pm2:restart": "pm2 restart my-node-app",
        "pm2:delete": "pm2 delete my-node-app",
        "pm2:logs": "pm2 logs my-node-app",
        "pm2:monit": "pm2 monit"
    }
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

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
      - DATABASE_URL=mongodb://mongo:27017/myapp
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

## Ví dụ thực tế: REST API Server

```javascript
// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Error handling
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

```javascript
// routes/users.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateUser = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Get all users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create user
router.post('/', validateUser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', auth, validateUser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
```

Node.js là nền tảng mạnh mẽ cho việc xây dựng ứng dụng backend. Việc nắm vững từ cơ bản đến nâng cao sẽ giúp bạn tạo ra những ứng dụng server-side hiệu quả và scalable.