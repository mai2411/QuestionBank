# Hệ thống Quản lý Ngân hàng Câu hỏi

Ứng dụng web quản lý ngân hàng câu hỏi với khả năng tạo đề thi tự động, được xây dựng bằng Bun, Elysia.js và React.

## Tính năng chính

### 1. Quản lý Môn học

- ✅ Thêm, sửa, xóa môn học
- ✅ Quản lý mã môn học và mô tả
- ✅ Giao diện thân thiện với người dùng

### 2. Quản lý Câu hỏi

- ✅ Thêm câu hỏi thủ công với 4 đáp án (A, B, C, D)
- ✅ Import câu hỏi hàng loạt từ file CSV
- ✅ Lọc câu hỏi theo môn học
- ✅ Chỉnh sửa và xóa câu hỏi

### 3. Tạo Đề thi và Sinh mã đề

- ✅ Tạo đề thi cho từng môn học
- ✅ Sinh nhiều mã đề tự động với:
  - Xáo trộn thứ tự câu hỏi
  - Xáo trộn thứ tự đáp án (A, B, C, D)
- ✅ Quản lý các mã đề đã tạo
- ✅ Xuất đề thi và đáp án ra file text

### 4. Xác thực người dùng

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với JWT
- ✅ Bảo vệ các route yêu cầu xác thực

## Công nghệ sử dụng

### Backend

- **Bun** - JavaScript runtime
- **Elysia.js** - Web framework TypeScript
- **MikroORM** - ORM với PostgreSQL
- **JWT** - Xác thực người dùng

### Frontend

- **React 19** - UI library
- **React Router (Hash)** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Eden Treaty** - End-to-end type safety

## Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
bun install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/question_bank
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

### 3. Chạy ứng dụng

```bash
# Development mode với hot reload
bun run dev

# Build cho production
bun run build

# Chạy production
bun start
```

### 4. Truy cập ứng dụng

- **Ứng dụng**: <http://localhost:3000>
- **API Documentation**: <http://localhost:3000/api/docs>

## Hướng dẫn sử dụng

### 1. Đăng ký/Đăng nhập

- Truy cập `/register` để tạo tài khoản mới
- Truy cập `/login` để đăng nhập
- Sau khi đăng nhập, bạn sẽ được chuyển đến trang chủ

### 2. Quản lý Môn học

- Vào trang "Môn học" từ menu
- Nhấn "Thêm môn học" để tạo môn học mới
- Điền thông tin: Tên môn học, Mã môn học, Mô tả (tùy chọn)
- Có thể chỉnh sửa hoặc xóa môn học đã tạo

### 3. Quản lý Câu hỏi

- Vào trang "Câu hỏi" từ menu
- Chọn môn học để lọc câu hỏi (hoặc xem tất cả)
- **Thêm thủ công**: Nhấn "Thêm câu hỏi" và điền thông tin
- **Import CSV**: Nhấn "Import CSV" và chọn file theo định dạng:

  ```
  Câu hỏi,Đáp án A,Đáp án B,Đáp án C,Đáp án D,Đáp án đúng
  "Thủ đô của Việt Nam là gì?","Hà Nội","TP.HCM","Đà Nẵng","Huế","A"
  ```

### 4. Tạo Đề thi

- Vào trang "Đề thi" từ menu
- Nhấn "Thêm đề thi" để tạo đề thi mới
- Điền thông tin: Tên đề thi, Mã đề thi, Thời gian, Môn học
- **Sinh mã đề**: Chọn đề thi và nhấn "Sinh mã đề"
- Nhập số lượng mã đề cần tạo (ví dụ: 4, 6, 8...)
- Hệ thống sẽ tự động:
  - Xáo trộn thứ tự câu hỏi
  - Xáo trộn thứ tự đáp án A, B, C, D
  - Tạo mã đề theo format: `MÃ-ĐỀ-001`, `MÃ-ĐỀ-002`...

### 5. Xuất Đề thi

- Trong trang "Đề thi", nhấn "Xuất đề" để tải file text
- Có thể xuất:
  - Chỉ đề thi (không có đáp án)
  - Đề thi kèm đáp án
- File được tải xuống với tên: `de-thi-MÃ-ĐỀ.txt`

## Cấu trúc Database

### Bảng Subjects (Môn học)

- `id` - ID môn học
- `name` - Tên môn học
- `code` - Mã môn học
- `description` - Mô tả
- `createdAt`, `updatedAt` - Timestamps

### Bảng Questions (Câu hỏi)

- `id` - ID câu hỏi
- `question` - Nội dung câu hỏi
- `answerA`, `answerB`, `answerC`, `answerD` - 4 đáp án
- `correctAnswer` - Đáp án đúng (A, B, C, hoặc D)
- `subjectId` - ID môn học
- `createdAt`, `updatedAt` - Timestamps

### Bảng Exams (Đề thi)

- `id` - ID đề thi
- `name` - Tên đề thi
- `code` - Mã đề thi
- `duration` - Thời gian (phút)
- `subjectId` - ID môn học
- `createdAt`, `updatedAt` - Timestamps

### Bảng ExamQuestions (Câu hỏi trong đề thi)

- `id` - ID
- `examId` - ID đề thi
- `questionId` - ID câu hỏi gốc
- `questionOrder` - Thứ tự câu hỏi trong đề
- `variantCode` - Mã đề (ví dụ: MATH-001)
- `questionText` - Nội dung câu hỏi (đã xáo trộn)
- `answerA`, `answerB`, `answerC`, `answerD` - Đáp án (đã xáo trộn)
- `correctAnswer` - Đáp án đúng (đã điều chỉnh)
- `createdAt`, `updatedAt` - Timestamps

## API Endpoints

### Authentication

- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập

### Subjects

- `GET /api/subjects` - Lấy danh sách môn học
- `POST /api/subjects` - Tạo môn học mới
- `GET /api/subjects/:id` - Lấy chi tiết môn học
- `PUT /api/subjects/:id` - Cập nhật môn học
- `DELETE /api/subjects/:id` - Xóa môn học

### Questions

- `GET /api/questions` - Lấy danh sách câu hỏi
- `POST /api/questions` - Tạo câu hỏi mới
- `POST /api/questions/bulk` - Import câu hỏi hàng loạt
- `GET /api/questions/:id` - Lấy chi tiết câu hỏi
- `PUT /api/questions/:id` - Cập nhật câu hỏi
- `DELETE /api/questions/:id` - Xóa câu hỏi

### Exams

- `GET /api/exams` - Lấy danh sách đề thi
- `POST /api/exams` - Tạo đề thi mới
- `GET /api/exams/:id` - Lấy chi tiết đề thi
- `PUT /api/exams/:id` - Cập nhật đề thi
- `DELETE /api/exams/:id` - Xóa đề thi
- `POST /api/exams/:id/generate` - Sinh mã đề
- `GET /api/exams/:id/variants` - Lấy danh sách mã đề
- `GET /api/exams/:id/export` - Xuất đề thi

## Phát triển

### Cấu trúc thư mục

```
question-bank/
├── src/                    # Backend
│   ├── controllers/        # API controllers
│   ├── services/          # Business logic
│   ├── entities/          # Database models
│   ├── middlewares/       # Request/response middlewares
│   ├── macros/            # Elysia macros (auth)
│   └── index.ts           # Server entry point
├── client/                # Frontend
│   ├── pages/             # Page components
│   ├── layouts/           # Layout components
│   ├── store/             # Zustand stores
│   ├── libs/              # Utilities & API client
│   └── index.tsx          # React entry point
└── package.json
```

### Thêm tính năng mới

1. Tạo entity trong `src/entities/`
2. Thêm vào `src/db.ts`
3. Tạo service trong `src/services/`
4. Tạo controller trong `src/controllers/`
5. Thêm route vào `src/index.ts`
6. Tạo page component trong `client/pages/`
7. Thêm route vào `client/router.ts`

## Troubleshooting

### Lỗi thường gặp

1. **"Token not found" error**
   - Kiểm tra localStorage có `ACCESS_TOKEN_KEY`
   - Đăng nhập lại nếu cần

2. **Database connection fails**
   - Kiểm tra DATABASE_URL trong .env
   - Đảm bảo PostgreSQL đang chạy
   - Kiểm tra database đã được tạo

3. **Routes not working**
   - Đảm bảo sử dụng Hash Router (không phải Browser Router)
   - Kiểm tra static files được serve đúng

4. **Types not syncing**
   - Restart dev server để regenerate types
   - Kiểm tra `@server` path alias trong tsconfig.json

## License

MIT License
