---
title: "Zero to Hero: Kafka"
date: 2025-06-26T09:12:14.000Z
tags: [Distributed Systems, Event-Driven, Kafka, Message Queue, Streaming]
---

# Zero to Hero: Kafka

Apache Kafka là một nền tảng streaming phân tán, được thiết kế để xử lý dữ liệu real-time với hiệu suất cao. Nó được sử dụng rộng rãi trong các hệ thống event-driven architecture và data streaming.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Kiến trúc Kafka](#ki%E1%BA%BFn-tr%C3%BAc-kafka)
*   [Cài đặt](#c%C3%A0i-%C4%91%E1%BA%B7t)
*   [Core Concepts](#core-concepts)
*   [Producer](#producer)
*   [Consumer](#consumer)
*   [Topics và Partitions](#topics-v%C3%A0-partitions)
*   [Consumer Groups](#consumer-groups)
*   [Stream Processing](#stream-processing)
*   [Schema Registry](#schema-registry)
*   [Monitoring](#monitoring)
*   [Best Practices](#best-practices)
*   [Ví dụ thực tế](#v%C3%AD-d%E1%BB%A5-th%E1%BB%B1c-t%E1%BA%BF)

## Giới thiệu

Kafka được phát triển bởi LinkedIn và sau đó trở thành một dự án Apache. Nó cung cấp:

*   **High Throughput**: Xử lý hàng triệu message mỗi giây
*   **Fault Tolerance**: Replication và partition để đảm bảo độ tin cậy
*   **Scalability**: Horizontal scaling dễ dàng
*   **Real-time Processing**: Xử lý dữ liệu real-time
*   **Event Sourcing**: Lưu trữ toàn bộ lịch sử events

## Kiến trúc Kafka

```plaintext
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Producer 1    │    │   Producer 2    │    │   Producer 3    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │        Kafka Cluster      │
                    │  ┌─────┐  ┌─────┐  ┌─────┐ │
                    │  │Broker│  │Broker│  │Broker│ │
                    │  │  1  │  │  2  │  │  3  │ │
                    │  └─────┘  └─────┘  └─────┘ │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│  Consumer 1     │    │  Consumer 2     │    │  Consumer 3     │
│ (Group A)       │    │ (Group A)       │    │ (Group B)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Cài đặt

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    depends_on:
      - kafka
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
```

### Node.js Client

```bash
npm install kafkajs
```

## Core Concepts

### 1\. Topic

Topic là nơi lưu trữ messages, tương tự như queue trong message broker khác.

### 2\. Partition

Topic được chia thành nhiều partition để parallel processing.

### 3\. Producer

Ứng dụng gửi messages đến Kafka.

### 4\. Consumer

Ứng dụng đọc messages từ Kafka.

### 5\. Consumer Group

Nhóm consumers chia sẻ việc đọc messages.

## Producer

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

// Kết nối producer
await producer.connect();

// Gửi message đơn giản
await producer.send({
  topic: 'user-events',
  messages: [
    { value: JSON.stringify({ userId: 123, action: 'login' }) }
  ]
});

// Gửi message với key
await producer.send({
  topic: 'user-events',
  messages: [
    {
      key: 'user-123',
      value: JSON.stringify({ userId: 123, action: 'login' })
    }
  ]
});

// Gửi nhiều messages
await producer.send({
  topic: 'user-events',
  messages: [
    { key: 'user-123', value: JSON.stringify({ userId: 123, action: 'login' }) },
    { key: 'user-456', value: JSON.stringify({ userId: 456, action: 'logout' }) }
  ]
});

// Đóng kết nối
await producer.disconnect();
```

### Producer với Options

```javascript
const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
});

await producer.send({
  topic: 'user-events',
  messages: [
    {
      key: 'user-123',
      value: JSON.stringify({ userId: 123, action: 'login' }),
      headers: {
        'correlation-id': 'req-123',
        'timestamp': Date.now().toString()
      },
      timestamp: Date.now()
    }
  ],
  timeout: 30000,
  acks: 1 // 0, 1, hoặc -1 (all)
});
```

## Consumer

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'user-events-group' });

// Kết nối và subscribe
await consumer.connect();
await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

// Xử lý messages
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic,
      partition,
      offset: message.offset,
      key: message.key?.toString(),
      value: message.value.toString()
    });

    // Parse JSON
    const data = JSON.parse(message.value.toString());
    console.log('User event:', data);

    // Xử lý logic
    await processUserEvent(data);
  }
});

// Đóng kết nối
await consumer.disconnect();
```

### Consumer với Options

```javascript
const consumer = kafka.consumer({
  groupId: 'user-events-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  rebalanceTimeout: 60000
});

await consumer.run({
  autoCommit: true,
  autoCommitInterval: 5000,
  autoCommitThreshold: 100,
  eachMessage: async ({ topic, partition, message }) => {
    try {
      const data = JSON.parse(message.value.toString());
      await processUserEvent(data);
    } catch (error) {
      console.error('Error processing message:', error);
      // Có thể gửi message đến dead letter queue
    }
  }
});
```

## Topics và Partitions

### Tạo Topic

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();

await admin.connect();

// Tạo topic với partitions
await admin.createTopics({
  topics: [
    {
      topic: 'user-events',
      numPartitions: 3,
      replicationFactor: 1
    },
    {
      topic: 'order-events',
      numPartitions: 5,
      replicationFactor: 1
    }
  ]
});

await admin.disconnect();
```

### Partition Strategy

```javascript
// Round-robin (mặc định)
await producer.send({
  topic: 'user-events',
  messages: [
    { value: 'message 1' },
    { value: 'message 2' },
    { value: 'message 3' }
  ]
});

// Key-based partitioning
await producer.send({
  topic: 'user-events',
  messages: [
    { key: 'user-123', value: 'user 123 event' },
    { key: 'user-456', value: 'user 456 event' }
  ]
});

// Custom partitioner
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
```

## Consumer Groups

```javascript
// Consumer 1
const consumer1 = kafka.consumer({ groupId: 'user-events-group' });
await consumer1.connect();
await consumer1.subscribe({ topic: 'user-events' });

// Consumer 2
const consumer2 = kafka.consumer({ groupId: 'user-events-group' });
await consumer2.connect();
await consumer2.subscribe({ topic: 'user-events' });

// Cả hai consumers sẽ chia sẻ partitions
await consumer1.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(`Consumer 1 processing partition ${partition}`);
    // Xử lý message
  }
});

await consumer2.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(`Consumer 2 processing partition ${partition}`);
    // Xử lý message
  }
});
```

### Rebalancing

```javascript
const consumer = kafka.consumer({ groupId: 'user-events-group' });

consumer.on('consumer.group_join', ({ payload }) => {
  console.log('Consumer joined group:', payload);
});

consumer.on('consumer.fetch_start', ({ payload }) => {
  console.log('Fetch started:', payload);
});

consumer.on('consumer.fetch_error', ({ payload }) => {
  console.error('Fetch error:', payload);
});
```

## Stream Processing

### KStreams với Node.js

```javascript
import { KafkaStreams } from 'kafka-streams';

const config = {
  noptions: {
    'metadata.broker.list': 'localhost:9092',
    'group.id': 'stream-processor',
    'client.id': 'stream-processor-client',
    'event_cb': true,
    'compression.codec': 'snappy',
    'api.version.request': true,
    'socket.keepalive.enable': true,
    'socket.blocking.max.ms': 100,
    'enable.auto.commit': false,
    'auto.commit.interval.ms': 100,
    'heartbeat.interval.ms': 250,
    'retry.backoff.ms': 250,
    'fetch.min.bytes': 100,
    'fetch.message.max.bytes': 2 * 1024 * 1024,
    'queued.min.messages': 100,
    'queued.max.messages.kbytes': 50,
    'fetch.error.backoff.ms': 100,
    'queued.max.messages': 1000,
    'fetch.wait.max.ms': 500,
    'queue.buffering.max.ms': 1000,
    'batch.num.messages': 1000
  },
  tconf: {
    'auto.offset.reset': 'earliest',
    'request.required.acks': 1
  },
  batchOptions: {
    batchSize: 1000,
    commitEveryNBatch: 1,
    concurrency: 1,
    commitSync: false,
    noBatchCommits: false
  }
};

const kafkaStreams = new KafkaStreams(config);
const stream = kafkaStreams.getKStream('input-topic');

// Transform stream
stream
  .map(message => JSON.parse(message.value.toString()))
  .filter(data => data.type === 'user_event')
  .map(data => ({
    ...data,
    processedAt: new Date().toISOString()
  }))
  .to('output-topic');
```

## Schema Registry

```javascript
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

const registry = new SchemaRegistry({
  host: 'http://localhost:8081'
});

// Producer với schema
const producer = kafka.producer();

const userEventSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    action: { type: 'string' },
    timestamp: { type: 'string' }
  },
  required: ['userId', 'action']
};

const schemaId = await registry.register(userEventSchema, { subject: 'user-events-value' });

await producer.send({
  topic: 'user-events',
  messages: [
    {
      value: await registry.encode(schemaId, {
        userId: 123,
        action: 'login',
        timestamp: new Date().toISOString()
      })
    }
  ]
});

// Consumer với schema
const consumer = kafka.consumer({ groupId: 'user-events-group' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const decodedValue = await registry.decode(message.value);
    console.log('Decoded message:', decodedValue);
  }
});
```

## Monitoring

### Health Check

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'health-check',
  brokers: ['localhost:9092']
});

async function checkKafkaHealth() {
  try {
    const admin = kafka.admin();
    await admin.connect();
    
    const metadata = await admin.fetchTopicMetadata();
    console.log('Kafka is healthy');
    console.log('Topics:', metadata.topics.map(t => t.name));
    
    await admin.disconnect();
    return true;
  } catch (error) {
    console.error('Kafka health check failed:', error);
    return false;
  }
}
```

### Metrics

```javascript
const producer = kafka.producer();

producer.on('producer.connect', () => {
  console.log('Producer connected');
});

producer.on('producer.disconnect', () => {
  console.log('Producer disconnected');
});

producer.on('producer.network.request_timeout', () => {
  console.error('Producer network timeout');
});

const consumer = kafka.consumer({ groupId: 'monitoring-group' });

consumer.on('consumer.connect', () => {
  console.log('Consumer connected');
});

consumer.on('consumer.disconnect', () => {
  console.log('Consumer disconnected');
});

consumer.on('consumer.commit_offsets', ({ payload }) => {
  console.log('Offsets committed:', payload);
});
```

## Best Practices

### 1\. Error Handling

```javascript
const producer = kafka.producer();

producer.on('producer.network.request_timeout', () => {
  console.error('Network timeout, retrying...');
});

producer.on('producer.network.request_queue_size', ({ payload }) => {
  if (payload > 1000) {
    console.warn('Request queue is getting large:', payload);
  }
});

// Retry logic
async function sendWithRetry(topic, messages, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await producer.send({ topic, messages });
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 2\. Performance Optimization

```javascript
// Batch sending
const batch = [];
const batchSize = 100;

async function addToBatch(topic, message) {
  batch.push({ topic, message });
  
  if (batch.length >= batchSize) {
    await sendBatch();
  }
}

async function sendBatch() {
  if (batch.length === 0) return;
  
  const messagesByTopic = batch.reduce((acc, { topic, message }) => {
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(message);
    return acc;
  }, {});
  
  for (const [topic, messages] of Object.entries(messagesByTopic)) {
    await producer.send({ topic, messages });
  }
  
  batch.length = 0;
}
```

### 3\. Consumer Optimization

```javascript
const consumer = kafka.consumer({
  groupId: 'optimized-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  maxBytesPerPartition: 1048576, // 1MB
  fetchMaxBytes: 52428800 // 50MB
});

await consumer.run({
  autoCommit: false,
  autoCommitInterval: 5000,
  autoCommitThreshold: 100,
  eachMessage: async ({ topic, partition, message }) => {
    try {
      await processMessage(message);
      // Manual commit sau khi xử lý thành công
      await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
    } catch (error) {
      console.error('Message processing failed:', error);
      // Không commit offset để retry
    }
  }
});
```

## Ví dụ thực tế: E-commerce Event System

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ecommerce-app',
  brokers: ['localhost:9092']
});

// Producer cho user events
const userEventProducer = kafka.producer();

async function publishUserEvent(event) {
  await userEventProducer.send({
    topic: 'user-events',
    messages: [
      {
        key: `user-${event.userId}`,
        value: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString()
        })
      }
    ]
  });
}

// Producer cho order events
const orderEventProducer = kafka.producer();

async function publishOrderEvent(event) {
  await orderEventProducer.send({
    topic: 'order-events',
    messages: [
      {
        key: `order-${event.orderId}`,
        value: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString()
        })
      }
    ]
  });
}

// Consumer cho user events
const userEventConsumer = kafka.consumer({ groupId: 'user-events-processor' });

await userEventConsumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    
    switch (event.type) {
      case 'user_registered':
        await handleUserRegistration(event);
        break;
      case 'user_login':
        await handleUserLogin(event);
        break;
      case 'user_logout':
        await handleUserLogout(event);
        break;
    }
  }
});

// Consumer cho order events
const orderEventConsumer = kafka.consumer({ groupId: 'order-events-processor' });

await orderEventConsumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());
    
    switch (event.type) {
      case 'order_created':
        await handleOrderCreated(event);
        break;
      case 'order_paid':
        await handleOrderPaid(event);
        break;
      case 'order_shipped':
        await handleOrderShipped(event);
        break;
    }
  }
});

// Sử dụng
await publishUserEvent({
  type: 'user_registered',
  userId: 123,
  email: 'user@example.com'
});

await publishOrderEvent({
  type: 'order_created',
  orderId: 'order-456',
  userId: 123,
  amount: 99.99
});
```

## Kết luận

Kafka cung cấp một nền tảng mạnh mẽ cho việc xử lý streaming data và event-driven architecture. Với khả năng xử lý throughput cao, fault tolerance, và scalability, nó phù hợp cho các hệ thống production cần xử lý dữ liệu real-time.

**Tài liệu tham khảo:**

*   [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
*   [KafkaJS Documentation](https://kafka.js.org/)
*   [Confluent Platform](https://docs.confluent.io/)