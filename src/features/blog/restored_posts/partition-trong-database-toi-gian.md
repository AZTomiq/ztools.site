---
title: "Partition Trong Database Tối Giản"
date: 2024-03-20T10:16:05.000Z
tags: [Big Data, Database, Database Design, MySQL, Optimization, Partitioning, Performance]
categories: [Database, MySQL, Performance]
---

# Database Partitioning - Chia để trị với bảng “khủng long” 🦕

## I. Partition là gì?

**Partitioning** là kỹ thuật chia một bảng database lớn thành nhiều phần nhỏ hơn gọi là **partitions**. Mỗi partition được xử lý như một bảng riêng biệt nhưng vẫn giữ nguyên cấu trúc của bảng gốc.

> **Ví dụ đời thường**: Giống như chia tủ quần áo thành nhiều ngăn - áo ở ngăn này, quần ở ngăn kia. Tìm đồ nhanh hơn, dọn dẹp dễ hơn! 👔

## II. Tại sao phải partition bảng lớn?

### 🚀 **Tăng hiệu suất query**

*   Thay vì scan toàn bộ 10 triệu records, chỉ cần scan partition có 1 triệu records
*   Query nhanh hơn đáng kể, đặc biệt với `WHERE` clause

### 🗂️ **Quản lý dữ liệu dễ dàng**

*   Xóa dữ liệu cũ? Drop partition thay vì `DELETE` từng row
*   Backup/restore từng partition riêng lẻ
*   Archive dữ liệu theo thời gian

### ⚡ **Xử lý song song (Parallelism)**

*   Database có thể query nhiều partition cùng lúc
*   Tận dụng được multi-core CPU

### 📊 **Tối ưu index**

*   Index nhỏ hơn trên từng partition
*   Rebuild index nhanh hơn
*   Memory footprint thấp hơn

## III. Các loại Partition và khi nào dùng

### 🗓️ **Range Partitioning**

Chia theo khoảng giá trị (thường là thời gian)

**Khi nào dùng**:

*   Dữ liệu time-series (logs, transactions)
*   Dữ liệu có thể chia theo khoảng rõ ràng

```sql
PARTITION BY RANGE (YEAR(created_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);
```

### 📋 **List Partitioning**

Chia theo danh sách giá trị cụ thể

**Khi nào dùng**:

*   Phân loại theo regions, departments, categories
*   Giá trị enum có thể đếm được

```sql
PARTITION BY LIST (region) (
    PARTITION p_north VALUES IN ('Hanoi', 'Haiphong'),
    PARTITION p_south VALUES IN ('HCM', 'Cantho'),
    PARTITION p_central VALUES IN ('Danang', 'Hue')
);
```

### 🔀 **Hash Partitioning**

Chia theo hash function

**Khi nào dùng**:

*   Phân bố đều dữ liệu
*   Không có pattern rõ ràng để chia

```sql
PARTITION BY HASH(user_id)
PARTITIONS 4;
```

### 🔑 **Key Partitioning**

Giống Hash nhưng database tự chọn hash function

### 🎯 **Composite Partitioning**

Kết hợp 2 loại partition (Range + Hash, List + Hash)

## IV. Ví dụ thực tế: Bảng `deleted_item`

### Bảng gốc (chưa partition):

```sql
CREATE TABLE `deleted_item` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `item_id` bigint NOT NULL,
  `item_uid` varbinary(1000) DEFAULT NULL,
  `item_type` varbinary(50) NOT NULL DEFAULT '',
  `is_recovery` tinyint unsigned DEFAULT '0',
  `created_date` double(13,3) NOT NULL,
  `updated_date` double(13,3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `unq_on_user_id_and_item_id_and_item_uid_and_item_type` (`user_id`,`item_id`,`item_uid`,`item_type`),
  KEY `idx_updated_date` (`updated_date`),
  KEY `idx_object_uid_and_object_type` (`item_uid`,`item_type`)
) ENGINE=InnoDB AUTO_INCREMENT=12941937 DEFAULT CHARSET=latin1 COMMENT='latin1_swedish_ci';
```

### Bảng sau khi partition (theo `item_type`):

```sql
CREATE TABLE `deleted_item_partitioned` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `item_id` bigint NOT NULL,
  `item_uid` varbinary(1000) DEFAULT NULL,
  `item_type` varbinary(50) NOT NULL DEFAULT '',
  `is_recovery` tinyint unsigned DEFAULT '0',
  `created_date` double(13,3) NOT NULL,
  `updated_date` double(13,3) DEFAULT NULL,
  PRIMARY KEY (`id`, `item_type`), -- Chú ý: phải include partition key
  KEY `idx_user_id` (`user_id`),
  KEY `unq_on_user_id_and_item_id_and_item_uid_and_item_type` (`user_id`,`item_id`,`item_uid`,`item_type`),
  KEY `idx_updated_date` (`updated_date`),
  KEY `idx_object_uid_and_object_type` (`item_uid`,`item_type`)
) 
PARTITION BY LIST COLUMNS(item_type) (
  PARTITION p_kanban VALUES IN (UNHEX(HEX('KANBAN'))),
  PARTITION p_link VALUES IN (UNHEX(HEX('LINK'))),
  PARTITION p_history VALUES IN (UNHEX(HEX('HISTORY'))),
  PARTITION p_collection_link VALUES IN (UNHEX(HEX('COLLECTION_LINK'))),
  PARTITION p_collection_notification VALUES IN (UNHEX(HEX('COLLECTION_NOTIFICATION'))),
  PARTITION p_canvas VALUES IN (UNHEX(HEX('CANVAS'))),
  PARTITION p_trash VALUES IN (UNHEX(HEX('TRASH'))),
  PARTITION p_collection_comment VALUES IN (UNHEX(HEX('COLLECTION_COMMENT'))),
  PARTITION p_share_member VALUES IN (UNHEX(HEX('SHARE_MEMBER'))),
  PARTITION p_conferencing VALUES IN (UNHEX(HEX('CONFERENCING'))),
  PARTITION p_folder VALUES IN (UNHEX(HEX('FOLDER'))),
  PARTITION p_folder_member VALUES IN (UNHEX(HEX('FOLDER_MEMBER'))),
  PARTITION p_vtodo VALUES IN (UNHEX(HEX('VTODO'))),
  PARTITION p_metadata_email VALUES IN (UNHEX(HEX('METADATA_EMAIL'))),
  PARTITION p_conference_member VALUES IN (UNHEX(HEX('CONFERENCE_MEMBER'))),
  PARTITION p_csfile VALUES IN (UNHEX(HEX('CSFILE'))),
  PARTITION p_url VALUES IN (UNHEX(HEX('URL'))),
  PARTITION p_other VALUES IN (
    UNHEX(HEX('COLLECTION_HISTORY')), -- convert to vabinary
    UNHEX(HEX('SET_3RD_ACC')),
    UNHEX(HEX('TRACK')),
    UNHEX(HEX('RECENT_OBJ')),
    UNHEX(HEX('SYSTEM_COLLECTION')),
    UNHEX(HEX('COLLECTION_ACTIVITY')),
    UNHEX(HEX('CONFERENCE_HISTORY')),
    UNHEX(HEX('MANUAL_RULE')),
    UNHEX(HEX('FILE')),
    UNHEX(HEX('COMMENT_ATTACHMENT')),
    UNHEX(HEX('VIDEO_CALL')),
    UNHEX(HEX('SUGGESTED_COLLECTION')),
    UNHEX(HEX('CREDENTIAL')),
    UNHEX(HEX('FILE_MEMBER')),
    UNHEX(HEX('COLLECTION_INSTANCE_MEMBER')),
    UNHEX(HEX('CONFERENCE_CHAT')),
    UNHEX(HEX('CONFFERENCE_CHAT')),
    UNHEX(HEX('VEVENT')),
    UNHEX(HEX('VJOURNAL')),
    UNHEX(HEX('ORDER_OBJ')),
    UNHEX(HEX('VCARD'))
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='latin1_swedish_ci';
```

> **Lưu ý**: Đây chỉ là ví dụ minh họa, không phải giải pháp cuối cùng cho bảng này. Cần phân tích kỹ hơn cho các bảng lớn trong hệ thống.

## V. Kế hoạch Migration

### Bước 1: Tạo bảng mới có partition

```sql
-- Tạo bảng partitioned như ví dụ trên
-- Lưu ý: Bỏ AUTO_INCREMENT để tránh conflict
```

### Bước 2: Migrate dữ liệu hiện tại

```sql
INSERT INTO deleted_item_partitioned (id, user_id, item_id, item_uid, item_type, is_recovery, created_date, updated_date)
SELECT id, user_id, item_id, item_uid, item_type, is_recovery, created_date, updated_date
FROM deleted_item_old;
```

### Bước 3: Tạo trigger cho dữ liệu mới

Trong quá trình migration, dữ liệu mới vẫn được insert vào bảng cũ. Trigger sẽ tự động sync sang bảng mới:

```sql
DELIMITER $$
CREATE TRIGGER `before_insert_deleted_item`
BEFORE INSERT ON `deleted_item_old`
FOR EACH ROW
BEGIN
  INSERT INTO deleted_item_partitioned (id, user_id, item_id, item_uid, item_type, is_recovery, created_date, updated_date)
  VALUES (NEW.id, NEW.user_id, NEW.item_id, NEW.item_uid, NEW.item_type, NEW.is_recovery, NEW.created_date, NEW.updated_date);
END$$
DELIMITER ;
```

### Bước 4: Kiểm tra tính nhất quán dữ liệu

```sql
-- So sánh số lượng records
SELECT COUNT(*) AS original_count FROM deleted_item_old;
SELECT COUNT(*) AS partitioned_count FROM deleted_item_partitioned;

-- Kiểm tra spot-check
SELECT * FROM deleted_item_old WHERE id = 1;
SELECT * FROM deleted_item_partitioned WHERE id = 1;
```

### Bước 5: Tắt trigger

```sql
DROP TRIGGER IF EXISTS `before_insert_deleted_item`;
```

## VI. Đổi tên và xóa bảng cũ

### Bước 1: Đổi tên bảng

```sql
RENAME TABLE 
  deleted_item_old TO deleted_item_backup, 
  deleted_item_partitioned TO deleted_item;
```

### Bước 2: Xóa bảng cũ (sau khi đảm bảo an toàn)

```sql
DROP TABLE IF EXISTS deleted_item_backup;
```

## VII. Lưu ý quan trọng

### ⚠️ **Trước khi làm**

*   **Backup**: Luôn backup trước khi thực hiện bất kỳ thao tác nào
*   **Testing**: Test kỹ trên DEV và QA environment trước
*   **Monitoring**: Theo dõi performance sau khi partition

### 📈 **Sau khi partition**

*   So sánh query performance giữa bảng cũ và mới
*   Monitor memory usage và I/O
*   Kiểm tra application có hoạt động bình thường không

### 🎯 **Best Practices**

*   Chọn partition key phù hợp với query pattern
*   Tránh cross-partition queries nếu có thể
*   Cân nhắc số lượng partition (quá nhiều cũng không tốt)
*   Định kỳ maintenance các partition

> **Kết luận**: Partition là “thuốc bổ” cho bảng lớn, nhưng dôi khi bổ quá cũng không tốt nha bro!

* * *

_Happy querying, happy coding_

ph4n4n