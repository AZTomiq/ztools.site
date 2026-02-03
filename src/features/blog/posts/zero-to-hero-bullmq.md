---
title: "Zero to Hero: BullMQ"
date: 2025-06-26T09:02:07.000Z
tags: [BullMQ, Job Processing, Node.js, Queue, Redis]
---

# Zero to Hero: BullMQ

BullMQ là một thư viện queue mạnh mẽ cho Node.js, được xây dựng trên Redis. Nó cung cấp khả năng xử lý job bất đồng bộ với các tính năng như retry, delay, priority, và monitoring.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Cài đặt](#c%C3%A0i-%C4%91%E1%BA%B7t)
*   [Cấu trúc cơ bản](#c%E1%BA%A5u-tr%C3%BAc-c%C6%A1-b%E1%BA%A3n)
*   [Producer và Consumer](#producer-v%C3%A0-consumer)
*   [Job Options](#job-options)
*   [Retry và Error Handling](#retry-v%C3%A0-error-handling)
*   [Delay và Scheduling](#delay-v%C3%A0-scheduling)
*   [Priority](#priority)
*   [Concurrency](#concurrency)
*   [Monitoring](#monitoring)
*   [Advanced Features](#advanced-features)
*   [Best Practices](#best-practices)

## Giới thiệu

BullMQ là thế hệ tiếp theo của Bull, được viết hoàn toàn bằng TypeScript và hỗ trợ Redis 6.0+. Nó cung cấp:

*   **Reliability**: Jobs được lưu trữ trong Redis, đảm bảo không mất dữ liệu
*   **Performance**: Xử lý hàng nghìn job mỗi giây
*   **Flexibility**: Hỗ trợ nhiều loại job và options
*   **Monitoring**: Dashboard và metrics tích hợp

## Cài đặt

```bash
npm install bullmq
```

Cần Redis server chạy (có thể dùng Docker):

```bash
docker run -d -p 6379:6379 redis:alpine
```

## Cấu trúc cơ bản

```javascript
import { Queue, Worker, QueueScheduler } from 'bullmq';

// Tạo queue
const queue = new Queue('email-queue');

// Tạo worker
const worker = new Worker('email-queue', async (job) => {
  console.log('Processing job:', job.id);
  console.log('Job data:', job.data);
  
  // Xử lý job
  await sendEmail(job.data);
});

// Tạo scheduler (cho delayed jobs)
const scheduler = new QueueScheduler('email-queue');
```

## Producer và Consumer

### Producer

```javascript
import { Queue } from 'bullmq';

const emailQueue = new Queue('email-queue');

// Thêm job đơn giản
await emailQueue.add('send-welcome', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform!'
});

// Thêm job với options
await emailQueue.add('send-newsletter', {
  to: 'user@example.com',
  subject: 'Weekly Newsletter',
  body: 'Check out our latest updates!'
}, {
  delay: 5000, // Delay 5 giây
  attempts: 3,  // Retry 3 lần
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});
```

### Consumer

```javascript
import { Worker } from 'bullmq';

const worker = new Worker('email-queue', async (job) => {
  const { to, subject, body } = job.data;
  
  try {
    await sendEmail(to, subject, body);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Job sẽ được retry
  }
}, {
  concurrency: 5 // Xử lý 5 job cùng lúc
});

// Event handlers
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
```

## Job Options

```javascript
await queue.add('job-name', data, {
  // Timing
  delay: 5000,           // Delay 5 giây
  priority: 10,          // Priority cao
  
  // Retry
  attempts: 3,           // Số lần retry
  backoff: {
    type: 'exponential', // exponential, fixed
    delay: 2000
  },
  
  // Job metadata
  jobId: 'custom-id',    // Custom job ID
  removeOnComplete: 100, // Giữ 100 job completed
  removeOnFail: 50,      // Giữ 50 job failed
  
  // Timeout
  timeout: 30000,        // Timeout 30 giây
  
  // Stack trace
  stackTraceLimit: 10
});
```

## Retry và Error Handling

```javascript
const worker = new Worker('email-queue', async (job) => {
  const { to, subject, body } = job.data;
  
  // Kiểm tra điều kiện
  if (!to || !subject) {
    throw new Error('Missing required fields');
  }
  
  // Xử lý với retry logic
  try {
    await sendEmail(to, subject, body);
  } catch (error) {
    // Log error
    console.error(`Attempt ${job.attemptsMade + 1} failed:`, error);
    
    // Custom retry logic
    if (error.code === 'RATE_LIMIT' && job.attemptsMade < 2) {
      // Đợi lâu hơn cho rate limit
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    throw error;
  }
}, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});
```

## Delay và Scheduling

```javascript
// Delay đơn giản
await queue.add('reminder', { userId: 123 }, {
  delay: 24 * 60 * 60 * 1000 // 24 giờ
});

// Cron-like scheduling
await queue.add('daily-report', {}, {
  repeat: {
    pattern: '0 9 * * *' // 9:00 AM hàng ngày
  }
});

// Repeat với interval
await queue.add('cleanup', {}, {
  repeat: {
    every: 60 * 60 * 1000 // Mỗi giờ
  }
});

// Repeat với limit
await queue.add('batch-process', {}, {
  repeat: {
    every: 5000,
    limit: 10 // Chỉ chạy 10 lần
  }
});
```

## Priority

```javascript
// Job với priority cao
await queue.add('urgent-email', data, { priority: 1 });

// Job với priority thấp
await queue.add('newsletter', data, { priority: 10 });

// Job bình thường
await queue.add('regular-email', data); // priority: 0
```

## Concurrency

```javascript
// Worker với concurrency cao
const worker = new Worker('email-queue', async (job) => {
  // Xử lý job
}, {
  concurrency: 10 // Xử lý 10 job cùng lúc
});

// Worker với concurrency thấp cho job nặng
const heavyWorker = new Worker('video-processing', async (job) => {
  // Xử lý video
}, {
  concurrency: 2 // Chỉ 2 job cùng lúc
});
```

## Monitoring

### Queue Events

```javascript
// Queue events
queue.on('waiting', (job) => {
  console.log(`Job ${job.id} is waiting`);
});

queue.on('active', (job) => {
  console.log(`Job ${job.id} started processing`);
});

queue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

queue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

queue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`);
});
```

### Queue Metrics

```javascript
// Lấy thông tin queue
const jobCounts = await queue.getJobCounts();
console.log('Job counts:', jobCounts);
// { waiting: 5, active: 2, completed: 100, failed: 3, delayed: 1 }

// Lấy jobs theo trạng thái
const waitingJobs = await queue.getWaiting();
const failedJobs = await queue.getFailed();

// Lấy job cụ thể
const job = await queue.getJob(jobId);
if (job) {
  console.log('Job state:', await job.getState());
  console.log('Job progress:', job.progress);
  console.log('Job logs:', job.logs);
}
```

## Advanced Features

### Job Dependencies

```javascript
// Job phụ thuộc vào job khác
const parentJob = await queue.add('parent-job', { data: 'parent' });
const childJob = await queue.add('child-job', { data: 'child' }, {
  dependencies: [parentJob.id]
});
```

### Job Progress

```javascript
const worker = new Worker('video-processing', async (job) => {
  const totalSteps = 100;
  
  for (let i = 0; i < totalSteps; i++) {
    // Xử lý từng bước
    await processVideoStep(i);
    
    // Cập nhật progress
    await job.updateProgress((i + 1) / totalSteps * 100);
  }
});

// Theo dõi progress
worker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});
```

### Job Logs

```javascript
const worker = new Worker('data-processing', async (job) => {
  // Log thông tin
  await job.log('Starting data processing');
  
  // Xử lý dữ liệu
  const result = await processData(job.data);
  
  await job.log(`Processed ${result.count} records`);
  
  return result;
});
```

### Rate Limiting

```javascript
const worker = new Worker('api-calls', async (job) => {
  // Xử lý API call
}, {
  concurrency: 1, // Chỉ 1 job cùng lúc
  limiter: {
    max: 10,      // Tối đa 10 job
    duration: 60000 // Trong 1 phút
  }
});
```

## Best Practices

### 1\. Error Handling

```javascript
const worker = new Worker('email-queue', async (job) => {
  try {
    await sendEmail(job.data);
  } catch (error) {
    // Log chi tiết
    console.error('Email sending failed:', {
      jobId: job.id,
      data: job.data,
      error: error.message,
      stack: error.stack
    });
    
    // Phân loại error
    if (error.code === 'INVALID_EMAIL') {
      // Không retry cho invalid email
      return;
    }
    
    throw error; // Retry cho các error khác
  }
});
```

### 2\. Resource Management

```javascript
// Đóng connections khi shutdown
process.on('SIGTERM', async () => {
  await worker.close();
  await queue.close();
  process.exit(0);
});
```

### 3\. Monitoring và Alerting

```javascript
// Monitor failed jobs
worker.on('failed', async (job, err) => {
  const failedCount = await queue.getJobCounts('failed');
  
  if (failedCount.failed > 100) {
    // Gửi alert
    await sendAlert(`Too many failed jobs: ${failedCount.failed}`);
  }
});
```

### 4\. Performance Optimization

```javascript
// Sử dụng batch processing
const worker = new Worker('batch-processing', async (jobs) => {
  const results = [];
  
  for (const job of jobs) {
    const result = await processItem(job.data);
    results.push(result);
  }
  
  return results;
}, {
  concurrency: 1,
  batch: {
    size: 10,
    delay: 1000
  }
});
```

## Ví dụ thực tế: Email Service

```javascript
import { Queue, Worker } from 'bullmq';
import nodemailer from 'nodemailer';

// Email queue
const emailQueue = new Queue('email-queue');

// Email worker
const emailWorker = new Worker('email-queue', async (job) => {
  const { to, subject, body, type } = job.data;
  
  // Xử lý theo loại email
  switch (type) {
    case 'welcome':
      await sendWelcomeEmail(to, subject, body);
      break;
    case 'newsletter':
      await sendNewsletter(to, subject, body);
      break;
    case 'notification':
      await sendNotification(to, subject, body);
      break;
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}, {
  concurrency: 5,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});

// Thêm email jobs
async function queueEmail(type, to, subject, body, options = {}) {
  return await emailQueue.add(type, {
    to,
    subject,
    body,
    type
  }, {
    priority: options.priority || 0,
    delay: options.delay || 0,
    attempts: options.attempts || 3,
    ...options
  });
}

// Sử dụng
await queueEmail('welcome', 'user@example.com', 'Welcome!', 'Welcome to our platform');
await queueEmail('newsletter', 'user@example.com', 'Newsletter', 'Weekly updates', {
  delay: 24 * 60 * 60 * 1000 // Gửi sau 24h
});
```

## Kết luận

BullMQ cung cấp một giải pháp mạnh mẽ và linh hoạt cho việc xử lý job bất đồng bộ trong Node.js. Với các tính năng như retry, delay, priority, và monitoring, nó phù hợp cho các ứng dụng production cần xử lý job một cách đáng tin cậy.

**Tài liệu tham khảo:**

*   [BullMQ Documentation](https://docs.bullmq.io/)
*   [Redis Documentation](https://redis.io/documentation)
*   [Node.js Documentation](https://nodejs.org/docs/)