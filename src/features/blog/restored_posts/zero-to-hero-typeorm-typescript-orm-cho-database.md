---
title: "Zero to Hero: TypeORM - TypeScript ORM Cho Database"
date: 2025-01-27T03:00:00.000Z
tags: [Database, Entity, Migration, ORM, Query Builder, Relations, TypeORM, TypeScript]
categories: [Database, TypeORM, TypeScript]
---

# Zero to Hero: TypeORM - TypeScript ORM cho Database

TypeORM là Object-Relational Mapping (ORM) library cho TypeScript và JavaScript, hỗ trợ nhiều database khác nhau như MySQL, PostgreSQL, SQLite, MongoDB. Nó cung cấp cách tiếp cận object-oriented để làm việc với database.

## 1\. Tại sao chọn TypeORM?

### So sánh với các ORM khác

```typescript
// Raw SQL - Khó maintain
const users = await db.query(`
  SELECT u.id, u.name, u.email, p.title 
  FROM users u 
  LEFT JOIN posts p ON u.id = p.userId 
  WHERE u.isActive = true
`);

// TypeORM - Type-safe và dễ đọc
const users = await userRepository.find({
  where: { isActive: true },
  relations: ['posts']
});
```

### Lợi ích của TypeORM

*   **TypeScript Support**: Type safety từ đầu
*   **Multiple Databases**: MySQL, PostgreSQL, SQLite, MongoDB
*   **Entity-based**: Object-oriented approach
*   **Migrations**: Version control cho database schema
*   **Query Builder**: Powerful query building
*   **Relations**: Easy relationship management
*   **Decorators**: Clean, readable syntax
*   **Active Record**: Familiar pattern

## 2\. Cài đặt và Setup

### Cài đặt TypeORM

```bash
# Cài đặt TypeORM và dependencies
npm install typeorm reflect-metadata
npm install mysql2 # cho MySQL
npm install pg # cho PostgreSQL
npm install sqlite3 # cho SQLite

# Development dependencies
npm install --save-dev @types/node typescript
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Database Configuration

```typescript
// src/config/database.ts
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "typeorm_demo",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Post],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
```

## 3\. Entities và Decorators

### Basic Entity

```typescript
// src/entities/User.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Post } from "./Post";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Không select password mặc định
  password: string;

  @Column({ 
    type: "enum", 
    enum: ["user", "admin", "moderator"],
    default: "user"
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @ManyToOne(() => Role, role => role.users)
  userRole: Role;

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_followers",
    joinColumn: { name: "follower_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "following_id", referencedColumnName: "id" }
  })
  followers: User[];
}
```

### Advanced Entity với Relations

```typescript
// src/entities/Post.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  ManyToMany,
  JoinTable,
  Index
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Category } from "./Category";

@Entity("posts")
@Index(["title", "author"]) // Composite index
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: "int", default: 0 })
  viewCount: number;

  @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: "post_categories",
    joinColumn: { name: "post_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" }
  })
  categories: Category[];

  @Column("simple-array")
  tags: string[];
}
```

### Custom Decorators

```typescript
// src/decorators/UniqueEmail.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isUniqueEmail",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          // Custom validation logic
          return true;
        }
      }
    });
  };
}

// Usage
export class CreateUserDto {
  @IsUniqueEmail({ message: "Email already exists" })
  email: string;
}
```

## 4\. Repository Pattern

### Basic Repository Operations

```typescript
// src/repositories/UserRepository.ts
import { Repository, EntityRepository } from "typeorm";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.find({ 
      where: { isActive: true },
      select: ["id", "name", "email", "role"]
    });
  }

  async findUsersWithPosts(): Promise<User[]> {
    return this.find({
      relations: ["posts"],
      where: { isActive: true }
    });
  }

  async findUserWithPostsAndComments(userId: number): Promise<User | null> {
    return this.findOne({
      where: { id: userId },
      relations: ["posts", "posts.comments"]
    });
  }
}

// Usage
const userRepository = AppDataSource.getRepository(User);
const users = await userRepository.findActiveUsers();
```

### Custom Repository Methods

```typescript
// src/repositories/PostRepository.ts
import { Repository, EntityRepository, Like } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async searchPosts(keyword: string): Promise<Post[]> {
    return this.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { content: Like(`%${keyword}%`) }
      ],
      relations: ["author", "categories"],
      order: { createdAt: "DESC" }
    });
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    return this.find({
      where: { isPublished: true },
      order: { viewCount: "DESC" },
      take: limit,
      relations: ["author"]
    });
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return this.createQueryBuilder("post")
      .leftJoinAndSelect("post.categories", "category")
      .leftJoinAndSelect("post.author", "author")
      .where("category.id = :categoryId", { categoryId })
      .andWhere("post.isPublished = :isPublished", { isPublished: true })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }
}
```

## 5\. Query Builder

### Basic Query Builder

```typescript
// src/services/UserService.ts
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findUsersWithPostCount(): Promise<any[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.posts", "post")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "COUNT(post.id) as postCount"
      ])
      .groupBy("user.id")
      .getRawMany();
  }

  async findUsersByRole(role: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .where("user.role = :role", { role })
      .andWhere("user.isActive = :isActive", { isActive: true })
      .orderBy("user.createdAt", "DESC")
      .getMany();
  }

  async findUsersWithRecentPosts(days: number = 7): Promise<User[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.posts", "post")
      .where("post.createdAt >= :date", { date })
      .andWhere("post.isPublished = :isPublished", { isPublished: true })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }
}
```

### Complex Queries

```typescript
// src/services/PostService.ts
import { AppDataSource } from "../config/database";
import { Post } from "../entities/Post";

export class PostService {
  private postRepository = AppDataSource.getRepository(Post);

  async getPostStatistics(): Promise<any> {
    return this.postRepository
      .createQueryBuilder("post")
      .select([
        "COUNT(*) as totalPosts",
        "COUNT(CASE WHEN post.isPublished = true THEN 1 END) as publishedPosts",
        "AVG(post.viewCount) as avgViews",
        "SUM(post.viewCount) as totalViews"
      ])
      .getRawOne();
  }

  async getPostsByAuthorWithStats(authorId: number): Promise<any[]> {
    return this.postRepository
      .createQueryBuilder("post")
      .leftJoin("post.comments", "comment")
      .select([
        "post.id",
        "post.title",
        "post.viewCount",
        "COUNT(comment.id) as commentCount"
      ])
      .where("post.author.id = :authorId", { authorId })
      .groupBy("post.id")
      .orderBy("post.createdAt", "DESC")
      .getRawMany();
  }

  async searchPostsAdvanced(searchTerm: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("post.categories", "category")
      .where("post.title LIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
      .orWhere("post.content LIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
      .orWhere("category.name LIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
      .andWhere("post.isPublished = :isPublished", { isPublished: true })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }
}
```

## 6\. Migrations

### Creating Migrations

```bash
# Tạo migration
npx typeorm migration:create src/migrations/CreateUsersTable

# Generate migration từ entity changes
npx typeorm migration:generate src/migrations/CreateUsersTable -d src/config/database.ts

# Run migrations
npx typeorm migration:run -d src/config/database.ts

# Revert migration
npx typeorm migration:revert -d src/config/database.ts
```

### Migration Example

```typescript
// src/migrations/1703123456789-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable1703123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "name",
            type: "varchar",
            length: "100"
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true
          },
          {
            name: "password",
            type: "varchar",
            length: "255"
          },
          {
            name: "role",
            type: "enum",
            enum: ["user", "admin", "moderator"],
            default: "'user'"
          },
          {
            name: "isActive",
            type: "boolean",
            default: true
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
          }
        ]
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_USERS_EMAIL",
        columnNames: ["email"]
      })
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_USERS_ROLE",
        columnNames: ["role"]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
```

## 7\. Subscribers và Events

### Entity Subscribers

```typescript
// src/subscribers/UserSubscriber.ts
import { 
  EventSubscriber, 
  EntitySubscriberInterface, 
  InsertEvent, 
  UpdateEvent,
  RemoveEvent
} from "typeorm";
import { User } from "../entities/User";
import { hash } from "bcrypt";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    // Hash password before insert
    if (event.entity.password) {
      event.entity.password = await hash(event.entity.password, 10);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    // Hash password if changed
    if (event.entity.password && event.databaseEntity.password !== event.entity.password) {
      event.entity.password = await hash(event.entity.password, 10);
    }
  }

  async afterInsert(event: InsertEvent<User>) {
    console.log(`User created: ${event.entity.email}`);
  }

  async afterUpdate(event: UpdateEvent<User>) {
    console.log(`User updated: ${event.entity.email}`);
  }

  async afterRemove(event: RemoveEvent<User>) {
    console.log(`User removed: ${event.entity.email}`);
  }
}
```

### Custom Events

```typescript
// src/events/UserEvents.ts
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { User } from "../entities/User";

@EventSubscriber()
export class UserEvents implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    // Send welcome email
    await this.sendWelcomeEmail(event.entity);
    
    // Create user profile
    await this.createUserProfile(event.entity);
  }

  private async sendWelcomeEmail(user: User) {
    // Email sending logic
    console.log(`Welcome email sent to ${user.email}`);
  }

  private async createUserProfile(user: User) {
    // Profile creation logic
    console.log(`Profile created for user ${user.id}`);
  }
}
```

## 8\. Best Practices và Performance

### Connection Pooling

```typescript
// src/config/database.ts
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Disable in production
  logging: false, // Disable in production
  entities: [User, Post],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
  // Connection pooling
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  }
});
```

### Query Optimization

```typescript
// src/services/OptimizedUserService.ts
export class OptimizedUserService {
  private userRepository = AppDataSource.getRepository(User);

  // Use select to limit fields
  async getUsersList(): Promise<Partial<User>[]> {
    return this.userRepository.find({
      select: ["id", "name", "email", "role"],
      where: { isActive: true }
    });
  }

  // Use pagination
  async getUsersPaginated(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" }
    });

    return { users, total };
  }

  // Use relations carefully
  async getUserWithPosts(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ["posts"], // Only load necessary relations
      select: ["id", "name", "email", "posts.id", "posts.title"]
    });
  }

  // Use query builder for complex queries
  async getUsersWithPostCount(): Promise<any[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.posts", "post")
      .select([
        "user.id",
        "user.name",
        "COUNT(post.id) as postCount"
      ])
      .groupBy("user.id")
      .having("COUNT(post.id) > 0")
      .getRawMany();
  }
}
```

## Ví dụ thực tế: Blog API với TypeORM

```typescript
// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      
      const users = await this.userService.getUsersPaginated(
        parseInt(page as string),
        parseInt(limit as string),
        role as string,
        search as string
      );

      res.json({
        success: true,
        data: users.users,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: users.total,
          pages: Math.ceil(users.total / parseInt(limit as string))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message
      });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create user",
        error: error.message
      });
    }
  }
}
```

TypeORM cung cấp cách tiếp cận object-oriented mạnh mẽ cho database operations. Với TypeScript support và rich feature set, nó là lựa chọn tuyệt vời cho các dự án enterprise.