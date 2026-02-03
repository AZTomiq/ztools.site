---
title: "ĐÙa Nghịch Với Docker Trong 5 Phút"
date: 2019-01-03T10:34:40.000Z
tags: [docker]
categories: [docker]
---

![Docker Logo](/images/docker_logo.png)

# Docker là gì?

Định nghĩa cũng tràn lan trên mạng rồi nên tôi cũng không cần phải copy lại chi cho mệt. Giờ tôi sẽ giải thích một cách đơn giản và dân dã nhất để cho ai cũng có thể hiểu được!

Đầu tiên cùng tưởng tượng rằng bạn và đồng nghiệp của mình đang cùng làm việc trên cùng một dự án. Một ngày đẹp trời đồng nghiệp của bạn bỗng nhiên chạy source code để debug nhưng kết quả lại khác với kết quả trên máy của bạn khi chạy với cùng dữ liệu như nhau.

## Vậy câu hỏi đặt ra là nguyên nhân do đâu?

Có thể có một số nguyên nhân ví dụ như:

*   Hệ điều hành của bạn và đồng nghiệp không giống nhau
*   Version của library trên máy bạn và trên máy của đồng nghiệp khác nhau
*   Các cấu hình môi trường khác nhau
*   v.v.

Docker sinh ra để giải quyết những vấn đề như vậy. Hiểu một cách đơn giản, Docker container có thể được coi như là một cái “máy tính” nằm bên trong cái máy tính của bạn. Điều hay ho là bạn có thể gửi cái “máy tính” đó cho bạn bè, đồng nghiệp của mình để họ có thể bật nó lên và chạy code mà kết quả sẽ giống y hệt với kết quả mà bạn thấy trên máy của mình.

**Tóm lại:** Docker giúp cho bạn gói gém tất cả môi trường máy tính của bạn, tạo thành một “image” và mang nó chạy trên một máy tính khác một cách dễ dàng. Image khi được chạy lên thì tạo nên một instance của image đó và nó được gọi là “container”. **Image** và **Container** chính là hai từ khoá quan trọng mà bạn phải nhớ trong suốt bài viết này, cũng như trong quá trình làm việc với Docker.

# Docker Compose là gì?

Docker Compose là một công cụ để định nghĩa và chạy những Docker container. Một trong những trường hợp cụ thể mà bạn cần sử dụng tới Docker Compose đó là khi bạn muốn giả lập một môi trường giống hệt môi trường thực tế của ứng dụng ví dụ như:

*   Kết nối database
*   Gọi cache server
*   Các service khác

Một trường hợp khác nữa mà tôi có thể kể tới ví dụ như các bạn muốn thực hiện automation testing cho hệ thống của mình, và đảm bảo rằng mọi thứ được thực hiện tách biệt với những môi trường khác từ server, database, cache, v.v.

## Cùng làm chung với nhau phần này nhé!

### Chuẩn bị

Để tiến hành “đùa nghịch” thì các bạn nhớ chuẩn bị sẵn những công cụ sau đây:

*   Git
*   Docker
*   Docker Compose

Hướng dẫn cài đặt mấy thứ này thì cũng tràn lan trên mạng và thời gian cài đặt sẽ từ khoảng 5 đến 15 phút tuỳ trình độ cũng như tốc độ mạng của các bạn!

### Setup ứng dụng Node.js cơ bản

Đầu tiên là setup một ứng dụng Node.js đơn giản sử dụng MongoDB. Để cho các bạn có thể thoả sức nghịch Docker thì tôi làm sẵn luôn một ứng dụng Node.js cơ bản. Các bạn có thể checkout code như sau:

```bash
git clone https://github.com/codeaholicguy/nodejs-mongodb-docker-example.git
```

**Giới thiệu sơ qua:** Đây là RESTful API lưu danh bạ gồm 2 endpoint chính:

*   `POST` để lưu danh bạ
*   `GET` để lấy danh bạ

Các bạn có thể config mongo URL bằng cách thêm environment variable `MONGO_URL` hoặc dùng file `.env` đã được setup sẵn.

### Build Docker image của ứng dụng Node.js

Đây mới là phần chính của bài viết!

Để tạo một Docker image, chúng ta cần tạo một file gọi là `Dockerfile` ngay tại thư mục root của project.

```dockerfile
FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]
```

Các lệnh khá rõ ràng và dễ hiểu, các bạn có thể đọc thêm document của Docker để biết thêm chi tiết. Sau khi đã có `Dockerfile`, các bạn có thể build image bằng lệnh sau:

```bash
docker build -t awesome-app .
```

Như vậy, các bạn đã có một Docker image cho source code hiện tại, và các bạn cũng có thể chạy thử image bằng lệnh:

```bash
docker run awesome-app
```

Tuy nhiên các bạn sẽ nhận ra là chạy không được, do ứng dụng của chúng ta cần thêm MongoDB để lưu trữ dữ liệu nữa. Vậy làm thế nào để setup? Cùng bước sang phần tiếp theo nhé!

### Viết file docker-compose.yml

Các bạn tạo file `docker-compose.yml`, file này sẽ chứa thông tin của môi trường Docker.

```yaml
version: "3"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017
    depends_on:
      - mongo
  mongo:
    image: mongo
    ports:
      - "27017:27017"
```

Trong file này chúng ta định nghĩa hai Docker services:

*   **app:** Đây chính là ứng dụng Node.js của chúng ta
*   **mongo:** Chính là database MongoDB được map với port như định nghĩa

Mặc định `app` sẽ gọi `mongo` bằng cách sử dụng tên của service, như các bạn có thể thấy env `MONGO_URL` chúng ta sử dụng `mongo` cho phần hostname.

Sau khi các bạn đã có file `docker-compose.yml`, các bạn có thể chạy nó lên bằng lệnh sau:

```bash
docker-compose up
```

Giờ thử vào `http://localhost:3000/directory` để test xem mọi thứ đã chạy ổn chưa nhé.

## Test app

Bạn có thể test API bằng các tool như Postman hoặc curl:

```bash
# Lấy danh sách
curl http://localhost:3000/directory

# Thêm contact mới
curl -X POST http://localhost:3000/directory \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "123456789"}'
```

## Lưu trữ dữ liệu

Với setup như trên, mỗi lần xoá mongo image và rebuild lại thì dữ liệu trước đó sẽ mất hết, bởi vì dữ liệu được lưu trữ trong mongo container. Vậy làm sao để dữ liệu được giữ nguyên?

Để làm chuyện này, chúng ta sử dụng một kỹ thuật gọi là **volume**, để làm cho storage của container sẽ trỏ về một thư mục trên máy tính thật. Để làm chuyện này thì cũng khá đơn giản thôi. Các bạn chỉnh sửa file `docker-compose.yml` như sau:

```yaml
version: "3"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017
    depends_on:
      - mongo
  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

Như các bạn có thể thấy, chúng ta thêm `volumes` vào và map nó với thư mục `/data/db` trong mongo container. Vậy thực sự thư mục dữ liệu này nằm ở đâu?

Các bạn chạy lệnh sau:

```bash
docker inspect -f '{{ .Mounts }}' ${container_id}
```

Kết quả:

```plaintext
[{volume nodejs-mongodb-docker-example_mongo_data /var/lib/docker/volumes/nodejs-mongodb-docker-example_mongo_data/_data /data/db local rw true }]
```

Trong đó `container_id` chính là id của mongo container, các bạn có thể lấy nó thông qua lệnh `docker ps`.

Kết quả trả về có ba thành phần:

1.  **Volume name:** `nodejs-mongodb-docker-example_mongo_data`
2.  **Đường dẫn thực tế:** `/var/lib/docker/volumes/nodejs-mongodb-docker-example_mongo_data/_data`
3.  **Mapping trên container:** `/data/db`

## Tổng kết

Bài viết này đã giới thiệu cho các bạn về:

*   **Docker:** Công cụ containerization
*   **Docker Compose:** Quản lý multi-container applications
*   **Volume:** Cách lưu trữ dữ liệu persistent

Đây chính là tất cả những thứ đơn giản nhất (những thứ phức tạp còn nhiều vô số kể) để thực hiện việc Dockerize ứng dụng của các bạn và sử dụng Docker Compose để chạy môi trường của ứng dụng chỉ bằng một lệnh duy nhất, cũng như việc lưu trữ lại dữ liệu ngay cả khi container bị xoá.

## Các lệnh Docker hữu ích

```bash
# Xem danh sách containers đang chạy
docker ps

# Xem danh sách images
docker images

# Stop tất cả containers
docker-compose down

# Rebuild và start lại
docker-compose up --build

# Xem logs
docker-compose logs

# Vào shell của container
docker exec -it <container_name> /bin/bash
```

* * *

**Nguồn:** Bài viết được tham khảo từ [TechTalk](https://techtalk.vn/dua-nghich-voi-docker-trong-5-phut.html) với mục đích học tập.