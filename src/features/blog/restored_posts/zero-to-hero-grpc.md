---
title: "Zero to Hero: gRPC"
date: 2025-06-26T09:31:05.000Z
tags: [API, Communication, Microservices, Protocol Buffers, RPC, gRPC]
---

# Zero to Hero: gRPC - Giao tiếp hiện đại cho microservices

> _“gRPC không chỉ là một protocol - nó là cách chúng ta xây dựng tương lai của distributed systems. Khi HTTP/2 gặp Protocol Buffers, magic xảy ra.”_

Bạn có bao giờ tự hỏi:

*   Làm sao để các microservices giao tiếp hiệu quả với nhau?
*   Tại sao REST API đôi khi không đủ cho những ứng dụng hiện đại?
*   Làm thế nào để có type-safe communication giữa các ngôn ngữ khác nhau?
*   Cách nào để xây dựng real-time streaming APIs?

Câu trả lời chính là **gRPC** - framework RPC hiện đại từ Google, được thiết kế cho thế giới microservices.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Kiến trúc gRPC](#ki%E1%BA%BFn-tr%C3%BAc-grpc)
*   [Protocol Buffers](#protocol-buffers)
*   [Service Types](#service-types)
*   [Node.js gRPC](#nodejs-grpc)
*   [Python gRPC](#python-grpc)
*   [Go gRPC](#go-grpc)
*   [Authentication](#authentication)
*   [Error Handling](#error-handling)
*   [Streaming](#streaming)
*   [Best Practices](#best-practices)
*   [Ví dụ thực tế](#v%C3%AD-d%E1%BB%A5-th%E1%BB%B1c-t%E1%BA%BF)

## Giới thiệu

### gRPC là gì và tại sao nó thay đổi game?

gRPC (Google Remote Procedure Call) không chỉ là một protocol - nó là một **paradigm shift** trong cách chúng ta xây dựng distributed systems.

Hãy tưởng tượng bạn đang xây dựng một hệ thống e-commerce với hàng chục microservices:

*   User Service quản lý thông tin người dùng
*   Product Service quản lý sản phẩm
*   Order Service xử lý đơn hàng
*   Payment Service xử lý thanh toán
*   Notification Service gửi thông báo

Làm sao để chúng giao tiếp hiệu quả? REST API? Có thể, nhưng gRPC sẽ cho bạn nhiều hơn thế.

### Tại sao gRPC vượt trội?

**🚀 Performance (Hiệu suất)**

*   HTTP/2 với multiplexing
*   Binary protocol (Protocol Buffers)
*   Connection pooling
*   Streaming support

**🛡️ Type Safety (An toàn kiểu dữ liệu)**

*   Strong typing với Protocol Buffers
*   Code generation tự động
*   Contract-first development
*   Cross-language compatibility

**🔄 Modern Features (Tính năng hiện đại)**

*   Bidirectional streaming
*   Interceptors và middleware
*   Built-in authentication
*   Load balancing support

**🌍 Cross-platform (Đa nền tảng)**

*   Hỗ trợ 10+ ngôn ngữ
*   Generated code tự động
*   Consistent API design
*   Tooling ecosystem

### Real-world Use Cases:

```javascript
// Ví dụ: Microservices communication
const orderService = {
  createOrder: async (userId, items) => {
    // Gọi User Service để validate user
    const user = await userClient.getUser({ id: userId });
    
    // Gọi Product Service để check inventory
    const inventory = await productClient.checkStock({ items });
    
    // Gọi Payment Service để process payment
    const payment = await paymentClient.processPayment({ 
      userId, 
      amount: calculateTotal(items) 
    });
    
    // Tạo order và gửi notification
    const order = await createOrder(user, items, payment);
    await notificationClient.sendNotification({
      userId,
      message: `Order #${order.id} created successfully`
    });
    
    return order;
  }
};
```

## Kiến trúc gRPC

### Hiểu cách gRPC hoạt động

gRPC được xây dựng trên nền tảng vững chắc của HTTP/2 và Protocol Buffers. Hãy khám phá kiến trúc của nó.

#### Core Components - Các thành phần cốt lõi

```plaintext
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   gRPC Client   │    │   gRPC Server   │
│                 │◄──►│                 │◄──►│                 │
│   Business      │    │   Stub/Channel  │    │   Service Impl  │
│   Logic         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────────────────────────────┐
                       │              HTTP/2                     │
                       │         Protocol Buffers                │
                       └─────────────────────────────────────────┘
```

**🔍 Giải thích từng layer:**

1.  **Client App**: Ứng dụng gọi service
2.  **gRPC Client**: Generated stub code
3.  **HTTP/2**: Transport layer với multiplexing
4.  **Protocol Buffers**: Serialization format
5.  **gRPC Server**: Service implementation
6.  **Business Logic**: Core business logic

#### Workflow - Quy trình hoạt động

1.  **Define Service**: Tạo `.proto` file định nghĩa service
2.  **Generate Code**: Compile `.proto` thành client/server code
3.  **Implement Server**: Viết business logic cho service
4.  **Create Client**: Sử dụng generated client code
5.  **Communicate**: Client gọi server methods

**💡 Tip:** gRPC follow contract-first approach - bạn định nghĩa interface trước, rồi generate code.

### So sánh với REST API

| Feature | REST API | gRPC |
| --- | --- | --- |
| Protocol | HTTP/1.1 | HTTP/2 |
| Data Format | JSON/XML | Protocol Buffers |
| Code Generation | Manual | Automatic |
| Streaming | Limited | Full support |
| Type Safety | Runtime | Compile-time |
| Performance | Good | Excellent |

## Protocol Buffers

### Interface Definition Language

Protocol Buffers (protobuf) là trái tim của gRPC. Nó không chỉ là serialization format - nó là ngôn ngữ để định nghĩa contracts.

#### Tại sao Protocol Buffers?

**📊 Efficiency (Hiệu quả)**

*   Binary format nhỏ hơn JSON 3-10x
*   Serialization/deserialization nhanh hơn
*   Ít bandwidth usage

**🔒 Type Safety (An toàn kiểu dữ liệu)**

*   Strong typing
*   Schema evolution
*   Backward compatibility

**🛠️ Developer Experience (Trải nghiệm dev)**

*   Code generation
*   IDE support
*   Documentation

#### Basic Syntax - Cú pháp cơ bản

```protobuf
// user.proto
syntax = "proto3";

package user;

// Service definition - định nghĩa service
service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}

// Message definitions - định nghĩa message
message GetUserRequest {
  int32 user_id = 1;
}

message GetUserResponse {
  User user = 1;
  bool success = 2;
  string error_message = 3;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
  int32 age = 3;
}

message CreateUserResponse {
  User user = 1;
  bool success = 2;
  string error_message = 3;
}

message UpdateUserRequest {
  int32 user_id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}

message UpdateUserResponse {
  User user = 1;
  bool success = 2;
  string error_message = 3;
}

message DeleteUserRequest {
  int32 user_id = 1;
}

message DeleteUserResponse {
  bool success = 1;
  string error_message = 2;
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  string created_at = 5;
  string updated_at = 6;
}
```

**🎯 Key Points:**

*   `syntax = "proto3"`: Sử dụng version 3
*   `package user`: Namespace cho service
*   `service UserService`: Định nghĩa service
*   `rpc MethodName(Request) returns (Response)`: Định nghĩa method
*   `message TypeName`: Định nghĩa data structure
*   `field_number`: Unique identifier cho field

#### Data Types - Các kiểu dữ liệu

```protobuf
message Example {
  // Scalar types - kiểu dữ liệu cơ bản
  int32 number = 1;           // 32-bit integer
  int64 big_number = 2;       // 64-bit integer
  uint32 unsigned_int = 3;    // Unsigned 32-bit
  uint64 unsigned_big_int = 4; // Unsigned 64-bit
  sint32 signed_int = 5;      // Signed 32-bit
  sint64 signed_big_int = 6;  // Signed 64-bit
  fixed32 fixed_int = 7;      // Fixed 32-bit
  fixed64 fixed_big_int = 8;  // Fixed 64-bit
  sfixed32 signed_fixed_int = 9;   // Signed fixed 32-bit
  sfixed64 signed_fixed_big_int = 10; // Signed fixed 64-bit
  
  // Floating point - số thực
  float float_value = 11;     // 32-bit float
  double double_value = 12;   // 64-bit double
  
  // Other types - các kiểu khác
  bool boolean_value = 13;    // Boolean
  string string_value = 14;   // String
  bytes bytes_value = 15;     // Binary data
  
  // Repeated fields - mảng
  repeated string tags = 16;  // Array of strings
  repeated int32 scores = 17; // Array of integers
  
  // Nested messages - message lồng nhau
  Address address = 18;
  
  // Maps - dictionary
  map<string, string> metadata = 19;
  map<int32, User> user_map = 20;
  
  // Enums - enumeration
  UserStatus status = 21;
}

message Address {
  string street = 1;
  string city = 2;
  string country = 3;
  string postal_code = 4;
}

enum UserStatus {
  UNKNOWN = 0;
  ACTIVE = 1;
  INACTIVE = 2;
  SUSPENDED = 3;
}
```

**💡 Best Practices:**

*   Sử dụng `int32` cho IDs và counts
*   Sử dụng `int64` cho timestamps và large numbers
*   Sử dụng `string` cho text data
*   Sử dụng `bytes` cho binary data
*   Sử dụng `repeated` cho arrays
*   Sử dụng `map` cho key-value pairs

#### Import và Packages - Tổ chức code

```protobuf
// common.proto - shared types
syntax = "proto3";

package common;

message Timestamp {
  int64 seconds = 1;
  int32 nanos = 2;
}

message Error {
  string code = 1;
  string message = 2;
  map<string, string> details = 3;
}

// user.proto - user service
syntax = "proto3";

package user;

import "common.proto"; // Import shared types

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

message GetUserRequest {
  int32 user_id = 1;
}

message GetUserResponse {
  User user = 1;
  common.Error error = 2; // Sử dụng shared type
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  common.Timestamp created_at = 4; // Sử dụng shared type
}
```

**🎯 Benefits:**

*   Code reuse
*   Consistency across services
*   Easier maintenance
*   Better organization

## Service Types

### Bốn kiểu giao tiếp trong gRPC

gRPC cung cấp bốn kiểu giao tiếp khác nhau, mỗi kiểu phù hợp với các use case cụ thể. Hãy khám phá từng kiểu một.

#### Unary RPC - Giao tiếp đơn giản nhất

Đây là kiểu giao tiếp cơ bản nhất - client gửi một request và nhận một response. Giống như REST API nhưng với hiệu suất tốt hơn.

```protobuf
service UserService {
  // Unary: client gửi 1 request, nhận 1 response
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}
```

**🎯 Use Cases:**

*   CRUD operations
*   Authentication/Authorization
*   Data validation
*   Simple queries

**💡 Example:** Khi user đăng nhập, client gửi credentials và nhận về user info.

#### Server Streaming RPC - Server gửi nhiều response

Server nhận một request và gửi về nhiều response theo thời gian. Perfect cho real-time data.

```protobuf
service NotificationService {
  // Server streaming: client gửi 1 request, nhận nhiều response
  rpc GetNotifications(GetNotificationsRequest) returns (stream Notification);
  rpc StreamUserActivity(UserActivityRequest) returns (stream Activity);
  rpc StreamMarketData(MarketDataRequest) returns (stream MarketData);
}

message GetNotificationsRequest {
  int32 user_id = 1;
  int32 limit = 2;
}

message Notification {
  int32 id = 1;
  string title = 2;
  string message = 3;
  string timestamp = 4;
  bool read = 5;
}
```

**🎯 Use Cases:**

*   Real-time notifications
*   Live data feeds
*   Progress updates
*   Event streaming

**💡 Example:** User subscribe để nhận real-time notifications khi có tin nhắn mới.

#### Client Streaming RPC - Client gửi nhiều request

Client gửi nhiều request và server xử lý tất cả rồi trả về một response duy nhất.

```protobuf
service FileService {
  // Client streaming: client gửi nhiều request, nhận 1 response
  rpc UploadFile(stream FileChunk) returns (UploadResponse);
  rpc BatchProcess(stream ProcessRequest) returns (BatchResponse);
  rpc CollectMetrics(stream MetricData) returns (MetricsSummary);
}

message FileChunk {
  bytes data = 1;
  string filename = 2;
  int32 chunk_index = 3;
  bool is_last = 4;
}

message UploadResponse {
  string file_id = 1;
  int64 size = 2;
  string status = 3;
  string url = 4;
}
```

**🎯 Use Cases:**

*   File uploads
*   Batch processing
*   Data collection
*   Sensor data aggregation

**💡 Example:** Upload file lớn bằng cách chia thành nhiều chunks.

#### Bidirectional Streaming RPC - Giao tiếp hai chiều

Cả client và server đều có thể gửi nhiều messages. Perfect cho real-time chat, games, collaboration tools.

```protobuf
service ChatService {
  // Bidirectional streaming: client và server gửi nhiều messages
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
  rpc GameStream(stream GameEvent) returns (stream GameEvent);
  rpc Collaboration(stream DocumentChange) returns (stream DocumentChange);
}

message ChatMessage {
  int32 user_id = 1;
  string message = 2;
  string timestamp = 3;
  MessageType type = 4;
  map<string, string> metadata = 5;
}

enum MessageType {
  TEXT = 0;
  IMAGE = 1;
  FILE = 2;
  SYSTEM = 3;
  TYPING = 4;
}
```

**🎯 Use Cases:**

*   Real-time chat
*   Multiplayer games
*   Collaborative editing
*   Live streaming
*   IoT device communication

**💡 Example:** Chat room nơi nhiều users có thể gửi và nhận messages real-time.

## Node.js gRPC

### Xây dựng gRPC services với Node.js

Node.js có ecosystem mạnh mẽ cho gRPC. Hãy xem cách implement từ cơ bản đến nâng cao.

#### Setup - Chuẩn bị môi trường

```bash
# Install dependencies
npm install @grpc/grpc-js @grpc/proto-loader

# Optional: Install development tools
npm install -D grpc-tools
```

**💡 Tip:** `@grpc/grpc-js` là implementation mới và được khuyến nghị thay vì `grpc` package cũ.

#### Server Implementation - Xây dựng server

```javascript
// server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Mock database - trong thực tế sẽ là database thật
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

// Service implementation - business logic
const userService = {
  getUser: (call, callback) => {
    const userId = call.request.user_id;
    const user = users.find(u => u.id === userId);
    
    if (user) {
      callback(null, {
        user: user,
        success: true,
        error_message: ''
      });
    } else {
      callback(null, {
        user: null,
        success: false,
        error_message: 'User not found'
      });
    }
  },

  createUser: (call, callback) => {
    const { name, email, age } = call.request;
    
    // Validate input
    if (!name || !email || !age) {
      callback(null, {
        user: null,
        success: false,
        error_message: 'Missing required fields'
      });
      return;
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      callback(null, {
        user: null,
        success: false,
        error_message: 'Email already exists'
      });
      return;
    }
    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      age,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    callback(null, {
      user: newUser,
      success: true,
      error_message: ''
    });
  },

  updateUser: (call, callback) => {
    const { user_id, name, email, age } = call.request;
    const userIndex = users.findIndex(u => u.id === user_id);
    
    if (userIndex !== -1) {
      // Update only provided fields
      const updatedUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        age: age || users[userIndex].age,
        updated_at: new Date().toISOString()
      };
      
      users[userIndex] = updatedUser;
      
      callback(null, {
        user: updatedUser,
        success: true,
        error_message: ''
      });
    } else {
      callback(null, {
        user: null,
        success: false,
        error_message: 'User not found'
      });
    }
  },

  deleteUser: (call, callback) => {
    const userId = call.request.user_id;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1)[0];
      callback(null, {
        success: true,
        error_message: '',
        deleted_user: deletedUser
      });
    } else {
      callback(null, {
        success: false,
        error_message: 'User not found'
      });
    }
  }
};

// Create server
const server = new grpc.Server();

// Add service to server
server.addService(userProto.UserService.service, userService);

// Start server
const port = 50051;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
    server.start();
    console.log(`🚀 gRPC server running on port ${port}`);
    console.log(`📡 Services available:`);
    console.log(`   - UserService.getUser`);
    console.log(`   - UserService.createUser`);
    console.log(`   - UserService.updateUser`);
    console.log(`   - UserService.deleteUser`);
  }
);
```

**🎯 Key Points:**

*   `protoLoader.loadSync()`: Load proto file
*   `grpc.loadPackageDefinition()`: Parse package definition
*   `server.addService()`: Register service implementation
*   `server.bindAsync()`: Bind server to port
*   Error handling với callback pattern

#### Client Implementation - Xây dựng client

```javascript
// client.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Create client
const client = new userProto.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Test functions - wrapper functions để dễ sử dụng
async function testUserService() {
  console.log('🧪 Testing User Service...\n');

  try {
    // Create user
    console.log('1️⃣ Creating user...');
    const createResponse = await new Promise((resolve, reject) => {
      client.createUser({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 28
      }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    
    if (createResponse.success) {
      console.log('✅ Created user:', createResponse.user);
    } else {
      console.log('❌ Failed to create user:', createResponse.error_message);
      return;
    }

    // Get user
    console.log('\n2️⃣ Getting user...');
    const getUserResponse = await new Promise((resolve, reject) => {
      client.getUser({ user_id: createResponse.user.id }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    
    if (getUserResponse.success) {
      console.log('✅ Retrieved user:', getUserResponse.user);
    } else {
      console.log('❌ Failed to get user:', getUserResponse.error_message);
    }

    // Update user
    console.log('\n3️⃣ Updating user...');
    const updateResponse = await new Promise((resolve, reject) => {
      client.updateUser({
        user_id: createResponse.user.id,
        age: 29
      }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    
    if (updateResponse.success) {
      console.log('✅ Updated user:', updateResponse.user);
    } else {
      console.log('❌ Failed to update user:', updateResponse.error_message);
    }

    // Delete user
    console.log('\n4️⃣ Deleting user...');
    const deleteResponse = await new Promise((resolve, reject) => {
      client.deleteUser({ user_id: createResponse.user.id }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
    
    if (deleteResponse.success) {
      console.log('✅ Deleted user successfully');
    } else {
      console.log('❌ Failed to delete user:', deleteResponse.error_message);
    }

  } catch (error) {
    console.error('💥 Error during testing:', error);
  }
}

// Run tests
testUserService().catch(console.error);
```

**💡 Best Practices:**

*   Wrap gRPC calls trong Promise để dễ sử dụng
*   Handle errors properly
*   Validate responses
*   Use meaningful console messages

#### Streaming Example - Ví dụ streaming

```javascript
// streaming-server.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto
const PROTO_PATH = './notification.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification;

// Mock notifications database
const notifications = [
  { id: 1, title: 'Welcome', message: 'Welcome to our platform!', timestamp: new Date().toISOString(), read: false },
  { id: 2, title: 'Update', message: 'System will be updated soon', timestamp: new Date().toISOString(), read: false },
  { id: 3, title: 'Reminder', message: 'Don\'t forget your meeting', timestamp: new Date().toISOString(), read: false },
  { id: 4, title: 'Promotion', message: '50% off on all products!', timestamp: new Date().toISOString(), read: false },
  { id: 5, title: 'Security', message: 'Please update your password', timestamp: new Date().toISOString(), read: false }
];

// Service implementation
const notificationService = {
  getNotifications: (call) => {
    const { user_id, limit } = call.request;
    const userNotifications = notifications.slice(0, limit || 10);
    
    console.log(`📨 Streaming ${userNotifications.length} notifications to user ${user_id}`);
    
    // Stream notifications with delay to simulate real-time
    userNotifications.forEach((notification, index) => {
      setTimeout(() => {
        call.write(notification);
        console.log(`📤 Sent notification ${notification.id}: ${notification.title}`);
        
        if (index === userNotifications.length - 1) {
          call.end();
          console.log('✅ Finished streaming notifications');
        }
      }, index * 1000); // 1 second delay between each notification
    });
  },

  chat: (call) => {
    console.log('💬 New chat session started');
    
    call.on('data', (message) => {
      console.log(`📥 Received message from user ${message.user_id}: ${message.message}`);
      
      // Echo back with timestamp
      const response = {
        user_id: message.user_id,
        message: `Echo: ${message.message}`,
        timestamp: new Date().toISOString(),
        type: 'TEXT'
      };
      
      call.write(response);
      console.log(`📤 Echoed back: ${response.message}`);
    });

    call.on('end', () => {
      console.log('👋 Chat session ended');
      call.end();
    });
  }
};

// Create server
const server = new grpc.Server();
server.addService(notificationProto.NotificationService.service, notificationService);

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
    server.start();
    console.log(`🚀 Streaming gRPC server running on port ${port}`);
    console.log(`📡 Services available:`);
    console.log(`   - NotificationService.getNotifications (Server Streaming)`);
    console.log(`   - NotificationService.chat (Bidirectional Streaming)`);
  }
);
```

**🎯 Streaming Patterns:**

*   **Server Streaming**: `call.write()` để gửi data, `call.end()` để kết thúc
*   **Client Streaming**: `call.on('data')` để nhận data, `call.on('end')` để biết client đã gửi xong
*   **Bidirectional**: Kết hợp cả hai patterns

## Python gRPC

### Setup

```bash
pip install grpcio grpcio-tools
```

### Generate Code

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. user.proto
```

### Server Implementation

```python
# server.py
import grpc
from concurrent import futures
import user_pb2
import user_pb2_grpc
import time

# Mock database
users = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "age": 30},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "age": 25}
]

class UserService(user_pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        user_id = request.user_id
        user = next((u for u in users if u["id"] == user_id), None)
        
        if user:
            return user_pb2.GetUserResponse(
                user=user_pb2.User(**user),
                success=True,
                error_message=""
            )
        else:
            return user_pb2.GetUserResponse(
                user=None,
                success=False,
                error_message="User not found"
            )
    
    def CreateUser(self, request, context):
        new_user = {
            "id": len(users) + 1,
            "name": request.name,
            "email": request.email,
            "age": request.age,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        users.append(new_user)
        
        return user_pb2.CreateUserResponse(
            user=user_pb2.User(**new_user),
            success=True,
            error_message=""
        )
    
    def UpdateUser(self, request, context):
        user_id = request.user_id
        user_index = next((i for i, u in enumerate(users) if u["id"] == user_id), -1)
        
        if user_index != -1:
            users[user_index].update({
                "name": request.name or users[user_index]["name"],
                "email": request.email or users[user_index]["email"],
                "age": request.age or users[user_index]["age"],
                "updated_at": time.strftime("%Y-%m-%d %H:%M:%S")
            })
            
            return user_pb2.UpdateUserResponse(
                user=user_pb2.User(**users[user_index]),
                success=True,
                error_message=""
            )
        else:
            return user_pb2.UpdateUserResponse(
                user=None,
                success=False,
                error_message="User not found"
            )
    
    def DeleteUser(self, request, context):
        user_id = request.user_id
        user_index = next((i for i, u in enumerate(users) if u["id"] == user_id), -1)
        
        if user_index != -1:
            users.pop(user_index)
            return user_pb2.DeleteUserResponse(
                success=True,
                error_message=""
            )
        else:
            return user_pb2.DeleteUserResponse(
                success=False,
                error_message="User not found"
            )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC server running on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
```

### Client Implementation

```python
# client.py
import grpc
import user_pb2
import user_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        
        print("Testing User Service...\n")
        
        # Create user
        print("1. Creating user...")
        create_response = stub.CreateUser(user_pb2.CreateUserRequest(
            name="Alice Johnson",
            email="alice@example.com",
            age=28
        ))
        print(f"Created user: {create_response.user}")
        
        # Get user
        print("\n2. Getting user...")
        get_response = stub.GetUser(user_pb2.GetUserRequest(
            user_id=create_response.user.id
        ))
        print(f"Retrieved user: {get_response.user}")
        
        # Update user
        print("\n3. Updating user...")
        update_response = stub.UpdateUser(user_pb2.UpdateUserRequest(
            user_id=create_response.user.id,
            age=29
        ))
        print(f"Updated user: {update_response.user}")
        
        # Delete user
        print("\n4. Deleting user...")
        delete_response = stub.DeleteUser(user_pb2.DeleteUserRequest(
            user_id=create_response.user.id
        ))
        print(f"Delete result: {delete_response.success}")

if __name__ == '__main__':
    run()
```

## Go gRPC

### Setup

```bash
go mod init grpc-example
go get google.golang.org/grpc
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

### Generate Code

```bash
protoc --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       user.proto
```

### Server Implementation

```go
// server.go
package main

import (
    "context"
    "fmt"
    "log"
    "net"
    "time"

    pb "grpc-example/user"
    "google.golang.org/grpc"
)

type server struct {
    pb.UnimplementedUserServiceServer
}

// Mock database
var users = []*pb.User{
    {Id: 1, Name: "John Doe", Email: "john@example.com", Age: 30},
    {Id: 2, Name: "Jane Smith", Email: "jane@example.com", Age: 25},
}

func (s *server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    for _, user := range users {
        if user.Id == req.UserId {
            return &pb.GetUserResponse{
                User:         user,
                Success:      true,
                ErrorMessage: "",
            }, nil
        }
    }
    
    return &pb.GetUserResponse{
        User:         nil,
        Success:      false,
        ErrorMessage: "User not found",
    }, nil
}

func (s *server) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
    newUser := &pb.User{
        Id:        int32(len(users) + 1),
        Name:      req.Name,
        Email:     req.Email,
        Age:       req.Age,
        CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
        UpdatedAt: time.Now().Format("2006-01-02 15:04:05"),
    }
    
    users = append(users, newUser)
    
    return &pb.CreateUserResponse{
        User:         newUser,
        Success:      true,
        ErrorMessage: "",
    }, nil
}

func (s *server) UpdateUser(ctx context.Context, req *pb.UpdateUserRequest) (*pb.UpdateUserResponse, error) {
    for i, user := range users {
        if user.Id == req.UserId {
            if req.Name != "" {
                users[i].Name = req.Name
            }
            if req.Email != "" {
                users[i].Email = req.Email
            }
            if req.Age != 0 {
                users[i].Age = req.Age
            }
            users[i].UpdatedAt = time.Now().Format("2006-01-02 15:04:05")
            
            return &pb.UpdateUserResponse{
                User:         users[i],
                Success:      true,
                ErrorMessage: "",
            }, nil
        }
    }
    
    return &pb.UpdateUserResponse{
        User:         nil,
        Success:      false,
        ErrorMessage: "User not found",
    }, nil
}

func (s *server) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.DeleteUserResponse, error) {
    for i, user := range users {
        if user.Id == req.UserId {
            users = append(users[:i], users[i+1:]...)
            return &pb.DeleteUserResponse{
                Success:      true,
                ErrorMessage: "",
            }, nil
        }
    }
    
    return &pb.DeleteUserResponse{
        Success:      false,
        ErrorMessage: "User not found",
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    
    s := grpc.NewServer()
    pb.RegisterUserServiceServer(s, &server{})
    
    fmt.Println("gRPC server running on port 50051")
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```

### Client Implementation

```go
// client.go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    pb "grpc-example/user"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

func main() {
    conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil {
        log.Fatalf("did not connect: %v", err)
    }
    defer conn.Close()
    
    c := pb.NewUserServiceClient(conn)
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel()
    
    fmt.Println("Testing User Service...\n")
    
    // Create user
    fmt.Println("1. Creating user...")
    createResp, err := c.CreateUser(ctx, &pb.CreateUserRequest{
        Name:  "Alice Johnson",
        Email: "alice@example.com",
        Age:   28,
    })
    if err != nil {
        log.Fatalf("could not create user: %v", err)
    }
    fmt.Printf("Created user: %v\n", createResp.User)
    
    // Get user
    fmt.Println("\n2. Getting user...")
    getResp, err := c.GetUser(ctx, &pb.GetUserRequest{
        UserId: createResp.User.Id,
    })
    if err != nil {
        log.Fatalf("could not get user: %v", err)
    }
    fmt.Printf("Retrieved user: %v\n", getResp.User)
    
    // Update user
    fmt.Println("\n3. Updating user...")
    updateResp, err := c.UpdateUser(ctx, &pb.UpdateUserRequest{
        UserId: createResp.User.Id,
        Age:    29,
    })
    if err != nil {
        log.Fatalf("could not update user: %v", err)
    }
    fmt.Printf("Updated user: %v\n", updateResp.User)
    
    // Delete user
    fmt.Println("\n4. Deleting user...")
    deleteResp, err := c.DeleteUser(ctx, &pb.DeleteUserRequest{
        UserId: createResp.User.Id,
    })
    if err != nil {
        log.Fatalf("could not delete user: %v", err)
    }
    fmt.Printf("Delete result: %v\n", deleteResp.Success)
}
```

## Authentication

### SSL/TLS

```javascript
// Server with SSL
const fs = require('fs');
const grpc = require('@grpc/grpc-js');

const server = new grpc.Server();

const credentials = grpc.ServerCredentials.createSsl(
  fs.readFileSync('certs/ca.crt'),
  [{
    private_key: fs.readFileSync('certs/server.key'),
    cert_chain: fs.readFileSync('certs/server.crt')
  }],
  true
);

server.bindAsync('0.0.0.0:50051', credentials, (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  server.start();
  console.log(`Secure gRPC server running on port ${port}`);
});

// Client with SSL
const clientCredentials = grpc.credentials.createSsl(
  fs.readFileSync('certs/ca.crt')
);

const client = new userProto.UserService(
  'localhost:50051',
  clientCredentials
);
```

### JWT Authentication

```javascript
// JWT Interceptor
const jwt = require('jsonwebtoken');

const authInterceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
    start: function(metadata, listener, next) {
      const token = metadata.get('authorization')[0];
      if (!token) {
        listener.onReceiveStatus({
          code: grpc.status.UNAUTHENTICATED,
          details: 'No token provided'
        });
        return;
      }
      
      try {
        const decoded = jwt.verify(token, 'your-secret-key');
        metadata.set('user', JSON.stringify(decoded));
        next(metadata, listener);
      } catch (error) {
        listener.onReceiveStatus({
          code: grpc.status.UNAUTHENTICATED,
          details: 'Invalid token'
        });
      }
    }
  });
};

// Use interceptor
const client = new userProto.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
  { interceptors: [authInterceptor] }
);
```

## Error Handling

### Status Codes

```javascript
// Server error handling
const userService = {
  getUser: (call, callback) => {
    try {
      const userId = call.request.user_id;
      
      if (!userId) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: 'User ID is required'
        });
        return;
      }
      
      const user = users.find(u => u.id === userId);
      if (!user) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'User not found'
        });
        return;
      }
      
      callback(null, {
        user: user,
        success: true,
        error_message: ''
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error'
      });
    }
  }
};

// Client error handling
client.getUser({ user_id: 1 }, (err, response) => {
  if (err) {
    switch (err.code) {
      case grpc.status.NOT_FOUND:
        console.error('User not found');
        break;
      case grpc.status.INVALID_ARGUMENT:
        console.error('Invalid argument');
        break;
      case grpc.status.UNAUTHENTICATED:
        console.error('Authentication required');
        break;
      default:
        console.error('Unknown error:', err.message);
    }
    return;
  }
  
  console.log('User:', response.user);
});
```

## Streaming

### Server Streaming

```javascript
// Server streaming implementation
const notificationService = {
  getNotifications: (call) => {
    const { user_id, limit } = call.request;
    
    // Simulate streaming notifications
    const notifications = [
      { id: 1, title: 'Welcome', message: 'Welcome!', timestamp: new Date().toISOString() },
      { id: 2, title: 'Update', message: 'System updated', timestamp: new Date().toISOString() },
      { id: 3, title: 'Reminder', message: 'Don\'t forget your meeting', timestamp: new Date().toISOString(), read: false }
    ];
    
    notifications.slice(0, limit || 10).forEach((notification, index) => {
      // Simulate delay
      setTimeout(() => {
        call.write(notification);
        
        if (index === notifications.length - 1) {
          call.end();
        }
      }, index * 1000);
    });
  }
};

// Client streaming consumption
const call = client.getNotifications({ user_id: 1, limit: 5 });

call.on('data', (notification) => {
  console.log('Received notification:', notification);
});

call.on('end', () => {
  console.log('Stream ended');
});

call.on('error', (error) => {
  console.error('Stream error:', error);
});
```

### Bidirectional Streaming

```javascript
// Bidirectional streaming implementation
const chatService = {
  chat: (call) => {
    call.on('data', (message) => {
      console.log('Received:', message);
      
      // Echo back with timestamp
      const response = {
        user_id: message.user_id,
        message: `Echo: ${message.message}`,
        timestamp: new Date().toISOString(),
        type: 'TEXT'
      };
      
      call.write(response);
    });

    call.on('end', () => {
      console.log('Chat ended');
      call.end();
    });
  }
};

// Client bidirectional streaming
const chatCall = client.chat();

chatCall.on('data', (message) => {
  console.log('Received message:', message);
});

chatCall.on('end', () => {
  console.log('Chat stream ended');
});

// Send messages
chatCall.write({
  user_id: 1,
  message: 'Hello!',
  type: 'TEXT'
});

setTimeout(() => {
  chatCall.write({
    user_id: 1,
    message: 'How are you?',
    type: 'TEXT'
  });
}, 1000);

setTimeout(() => {
  chatCall.end();
}, 2000);
```

## Best Practices

### Performance

```javascript
// Connection pooling
const grpc = require('@grpc/grpc-js');

class GrpcClientPool {
  constructor(target, credentials, options = {}) {
    this.target = target;
    this.credentials = credentials;
    this.options = options;
    this.clients = [];
    this.maxClients = options.maxClients || 10;
  }

  getClient() {
    if (this.clients.length < this.maxClients) {
      const client = new userProto.UserService(this.target, this.credentials);
      this.clients.push(client);
      return client;
    }
    
    // Round-robin selection
    return this.clients[Math.floor(Math.random() * this.clients.length)];
  }

  close() {
    this.clients.forEach(client => {
      client.close();
    });
  }
}

// Usage
const pool = new GrpcClientPool(
  'localhost:50051',
  grpc.credentials.createInsecure(),
  { maxClients: 5 }
);

const client = pool.getClient();
```

### Error Handling

```javascript
// Retry mechanism
async function callWithRetry(client, method, request, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        client[method](request, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

// Usage
try {
  const response = await callWithRetry(client, 'getUser', { user_id: 1 });
  console.log('User:', response.user);
} catch (error) {
  console.error('Failed after retries:', error);
}
```

### Monitoring

```javascript
// Interceptors for monitoring
const monitoringInterceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
    start: function(metadata, listener, next) {
      const startTime = Date.now();
      
      const originalOnReceiveStatus = listener.onReceiveStatus;
      listener.onReceiveStatus = function(status) {
        const duration = Date.now() - startTime;
        console.log(`gRPC call took ${duration}ms, status: ${status.code}`);
        
        // Send metrics to monitoring system
        // metrics.recordGrpcCall(duration, status.code);
        
        originalOnReceiveStatus.call(this, status);
      };
      
      next(metadata, listener);
    }
  });
};
```

## Ví dụ thực tế

### Microservices Communication

```javascript
// Order Service
const orderService = {
  createOrder: async (call, callback) => {
    try {
      const { user_id, items } = call.request;
      
      // Call User Service to validate user
      const userResponse = await new Promise((resolve, reject) => {
        userClient.getUser({ user_id }, (err, response) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
      
      if (!userResponse.success) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'User not found'
        });
        return;
      }
      
      // Call Inventory Service to check stock
      const inventoryPromises = items.map(item => 
        new Promise((resolve, reject) => {
          inventoryClient.checkStock({ product_id: item.product_id, quantity: item.quantity }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
          });
        })
      );
      
      const inventoryResults = await Promise.all(inventoryPromises);
      const outOfStock = inventoryResults.some(result => !result.available);
      
      if (outOfStock) {
        callback({
          code: grpc.status.FAILED_PRECONDITION,
          details: 'Some items are out of stock'
        });
        return;
      }
      
      // Create order
      const order = {
        id: Date.now(),
        user_id,
        items,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      callback(null, {
        order,
        success: true,
        error_message: ''
      });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: 'Internal server error'
      });
    }
  }
};
```

### Real-time Chat System

```javascript
// Chat Service with streaming
const chatService = {
  joinRoom: (call) => {
    const { room_id, user_id } = call.request;
    
    // Add user to room
    if (!rooms[room_id]) {
      rooms[room_id] = { users: new Set(), messages: [] };
    }
    rooms[room_id].users.add(user_id);
    
    // Send recent messages
    rooms[room_id].messages.slice(-50).forEach(message => {
      call.write(message);
    });
    
    // Listen for new messages
    call.on('data', (message) => {
      const chatMessage = {
        id: Date.now(),
        room_id,
        user_id: message.user_id,
        message: message.message,
        timestamp: new Date().toISOString(),
        type: message.type || 'TEXT'
      };
      
      // Store message
      rooms[room_id].messages.push(chatMessage);
      
      // Broadcast to all users in room
      rooms[room_id].users.forEach(userId => {
        if (userId !== user_id) {
          // Send to other users (implementation depends on user connection management)
        }
      });
    });
    
    call.on('end', () => {
      // Remove user from room
      if (rooms[room_id]) {
        rooms[room_id].users.delete(user_id);
      }
    });
  }
};
```

## Kết luận

gRPC là một framework mạnh mẽ cho microservices communication với hiệu suất cao, type safety, và hỗ trợ streaming. Với Protocol Buffers và HTTP/2, gRPC cung cấp giải pháp hiện đại cho distributed systems.

**Tài liệu tham khảo:**

*   [gRPC Official Documentation](https://grpc.io/docs/)
*   [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
*   [gRPC Node.js](https://grpc.io/docs/languages/node/)
*   [gRPC Python](https://grpc.io/docs/languages/python/)
*   [gRPC Go](https://grpc.io/docs/languages/go/)