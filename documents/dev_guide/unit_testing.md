# Unit Test cho Backend (NodeJS + Sequelize)

## Mục tiêu

Hướng dẫn này giúp các lập trình viên hiểu và thực hiện **Unit Test** cho các dịch vụ backend (service layer), đảm bảo:

- Hàm hoạt động đúng với đầu vào hợp lệ
- Bắt lỗi đúng với đầu vào không hợp lệ
- Logic xử lý nghiệp vụ được kiểm thử độc lập
- Các truy vấn DB hoặc các service khác được **mock**

---


---

## Cách viết Unit Test

### Testing thư viện nào?
- Sử dụng [Jest](https://jestjs.io/) – đơn giản, phổ biến, hỗ trợ mock tích hợp

---

## Ví dụ: Test `CourseService.create()`

### Mục tiêu test:
1. Tạo khoá học thành công khi dữ liệu hợp lệ
2. Bắt lỗi nếu thiếu trường bắt buộc
3. Bắt lỗi nếu số tín chỉ < 2
4. Bắt lỗi nếu môn học tiên quyết tự tham chiếu chính nó

### Form test:

- Sử dụng AAA (Arrange, Act, Assert)

### Cấu trúc code test:
```js
describe("create a course", () => {
  let courseService;
  beforeEach(() => {
    Course.create.mockResolvedValue({
      get: () => ({
        id: 1,
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
        prerequisiteCourseCode: ["CS100", "CS200"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    // Mock Course.findAll to return prerequisite courses for valid data
    Course.findAll.mockResolvedValue([
      { courseCode: "CS100" },
      { courseCode: "CS200" },
    ]);

    courseService = new CourseService({ Course });
  });

  test("When creating with valid data, then return created course", async () => {
    //Arrange
    const courseData = {
      name: "Introduction to Programming",
      courseCode: "CS101",
      credits: 3,
      facultyCode: "CS",
      description: "Basic programming course",
      prerequisiteCourseCode: ["CS100", "CS200"],
    };
    //Act && Assert
    await expect(courseService.create(courseData)).resolves.toBeDefined();
  });

  test("When creating with missing required fields, then throw ValidationError", async () => {
    //Arrange
    const courseData = { courseCode: "CS101", credits: 3, facultyCode: "CS", };
    //Act && Assert
    await expect(courseService.create(courseData)).rejects.toThrow(ValidationError);
  });

  test("When creating with credits less than 2, then throw ValidationError", async () => {
    //Arrange
    const courseData = {
      name: "Introduction to Programming",
      courseCode: "CS101",
      credits: 1,
      facultyCode: "CS",
      description: "Basic programming course",
    };
    //Act && Assert
    await expect(courseService.create(courseData)).rejects.toThrow(ValidationError);
  });

  test("When creating with self-referencing prerequisite, then throw ValidationError", async () => {
    //Arrange
    const courseData = {
      name: "Introduction to Programming",
      courseCode: "CS101",
      credits: 3,
      facultyCode: "CS",
      description: "Basic programming course",
      prerequisiteCourseCode: ["CS101"],
    };
    //Act && Assert
    await expect(courseService.create(courseData)).rejects.toThrow(ValidationError);
  });
});

```

## Cách chạy test:
 ```
npm run test
```


