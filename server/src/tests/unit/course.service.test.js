const CourseService = require("../../service/course.service");
const { Course } = require("./__mocks__/course.model");
const { Faculty } = require("./__mocks__/faculty.model");
const { Class } = require("./__mocks__/class.model");
const { Student } = require("./__mocks__/student.model");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../../util/errors");
const { validateUUID } = require("../../util/validator");
const { mapSequelizeError } = require("../../util/errorsMapperFromPostgres");

jest.mock("../util/validator");
jest.mock("../util/errorsMapperFromPostgres");

describe("unit test for CourseService", () => {
  let courseService;
  let mockCourse;

  beforeEach(() => {

    // Mock mapSequelizeError to throw the original error
    mapSequelizeError.mockImplementation((err) => { throw err; });

    // Mock course data
    mockCourse = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      courseCode: "CS101",
      name: "Introduction to Programming",
      credits: 3,
      facultyCode: "CS",
      description: "Basic programming course",
      prerequisiteCourseCode: [],
      isActive: true,
      createdAt: new Date(),
      update: jest.fn().mockImplementation(function (data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      }),
      destroy: jest.fn().mockResolvedValue(null),
      get: function () {
        return this;
      },
    };

    // Reset mocks
    Course.findOne.mockReset();
    Course.findOne.mockResolvedValue(mockCourse);
    Course.findAll.mockReset();
    Course.findAll.mockResolvedValue([]);
    Course.create.mockReset();
    Course.create.mockImplementation((data) => Promise.resolve({ ...mockCourse, ...data }));

    Faculty.findOne.mockReset();
    Faculty.findOne.mockResolvedValue({ faculty_code: "CS", name: "Computer Science", get: () => ({ faculty_code: "CS" }) });

    Class.findAll.mockReset();
    Class.findAll.mockResolvedValue([]);

    Student.findAll.mockReset();
    Student.findAll.mockResolvedValue([]);

    // Initialize CourseService with mocked models
    courseService = new CourseService({
      Course,
      Faculty,
      Class,
      Student,
    });
  });

  describe("create", () => {
    test("When creating with valid data, then return created course", async () => {
      const courseData = {
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
        prerequisiteCourseCode: [],
      };

      const result = await courseService.create(courseData);

      expect(result.course).toMatchObject({
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
        prerequisiteCourseCode: [],
        isActive: true,
      });
      expect(Course.create).toHaveBeenCalledWith({
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
        prerequisiteCourseCode: [],
      });
    });

    test("When creating with missing required fields, then throw ValidationError", async () => {
      const courseData = {
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
      }; // Missing name, description

      await expect(courseService.create(courseData)).rejects.toThrow(
        new ValidationError("Missing required fields", "Thiếu dữ liệu")
      );
    });

    test("When creating with credits < 2, then throw ValidationError", async () => {
      const courseData = {
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 1,
        facultyCode: "CS",
        description: "Basic programming course",
      };

      await expect(courseService.create(courseData)).rejects.toThrow(
        new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ")
      );
    });

    test("When creating with duplicate courseCode, then throw DuplicateResourceError", async () => {
      Course.findOne.mockResolvedValue(mockCourse); // Simulate existing course
      const courseData = {
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
      };

      await expect(courseService.create(courseData)).rejects.toThrow(
        new DuplicateResourceError("Course code already exists", "Mã khóa học đã tồn tại")
      );
    });

    test("When creating with invalid facultyCode, then throw NotFoundError", async () => {
      Faculty.findOne.mockResolvedValue(null); // Invalid faculty
      const courseData = {
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "INVALID",
        description: "Basic programming course",
      };

      await expect(courseService.create(courseData)).rejects.toThrow(
        new NotFoundError("Faculty not found", "Khoa không tồn tại: INVALID")
      );
    });

    test("When creating with invalid prerequisiteCourseCode, then throw NotFoundError", async () => {
      Course.findAll.mockResolvedValue([]); // No prerequisite courses
      const courseData = {
        name: "Advanced Programming",
        courseCode: "CS102",
        credits: 3,
        facultyCode: "CS",
        description: "Advanced course",
        prerequisiteCourseCode: ["CS100"],
      };

      await expect(courseService.create(courseData)).rejects.toThrow(
        new NotFoundError("Prerequisite course(s) not found", "Môn tiên quyết không tồn tại: CS100")
      );
    });

    test("When creating with self-referencing prerequisite, then throw ValidationError", async () => {
      const courseData = {
        name: "Introduction to Programming",
        courseCode: "CS101",
        credits: 3,
        facultyCode: "CS",
        description: "Basic programming course",
        prerequisiteCourseCode: ["CS101"],
      };

      await expect(courseService.create(courseData)).rejects.toThrow(
        new ValidationError("Course cannot be its own prerequisite", "Khóa học không thể là môn tiên quyết của chính nó")
      );
    });

    test("When creating with valid prerequisite courses, then return created course", async () => {
      Course.findOne.mockResolvedValue(null); // No duplicate courseCode
      Course.findAll.mockResolvedValue([{ courseCode: "CS100", get: () => ({ courseCode: "CS100" }) }]);
      const courseData = {
        name: "Advanced Programming",
        courseCode: "CS102",
        credits: 3,
        facultyCode: "CS",
        description: "Advanced course",
        prerequisiteCourseCode: ["CS100"],
      };

      const result = await courseService.create(courseData);
      expect(result.course.prerequisiteCourseCode).toEqual(["CS100"]);
    });
  });

  describe("update", () => {
    test("When updating with valid data, then return updated course", async () => {
      const updateData = {
        name: "Updated Programming Course",
        description: "Updated description",
        facultyCode: "CS",
        prerequisiteCourseCode: [],
      };

      const result = await courseService.update(mockCourse.id, updateData);

      expect(result.course).toMatchObject({
        name: "Updated Programming Course",
        description: "Updated description",
        facultyCode: "CS",
        prerequisiteCourseCode: [],
        credits: 3, // Unchanged
      });
      expect(mockCourse.update).toHaveBeenCalledWith({
        name: "Updated Programming Course",
        description: "Updated description",
        facultyCode: "CS",
        prerequisiteCourseCode: [],
      });
    });

    test("When updating with no valid fields, then throw ValidationError", async () => {
      await expect(courseService.update(mockCourse.id, {})).rejects.toThrow(
        new ValidationError("No valid fields provided for update", "Không có trường hợp lệ để cập nhật")
      );
    });

    test("When updating with invalid courseId, then throw ValidationError", async () => {
      validateUUID.mockReturnValue(false);
      await expect(courseService.update("invalid-uuid", { name: "Updated" })).rejects.toThrow(
        new ValidationError("Invalid course ID", "ID khóa học không hợp lệ")
      );
    });

    test("When updating non-existent course, then throw NotFoundError", async () => {
      Course.findOne.mockResolvedValue(null);
      await expect(courseService.update(mockCourse.id, { name: "Updated" })).rejects.toThrow(
        new NotFoundError("Course not found", "Khóa học không tồn tại")
      );
    });

    test("When updating credits < 2, then throw ValidationError", async () => {
      await expect(courseService.update(mockCourse.id, { credits: 1 })).rejects.toThrow(
        new ValidationError("Invalid credits", "Số tín chỉ không hợp lệ")
      );
    });

    test("When updating credits with registered students, then throw ValidationError", async () => {
      Class.findAll.mockResolvedValue([
        {
          id: "class-uuid-1",
          courseCode: "CS101",
          name: "Class 1",
          studentCodeStudents: [{ student_code: "S001", name: "Student 1", get: () => ({ student_code: "S001" }) }],
          get: () => ({}),
        },
      ]);

      await expect(courseService.update(mockCourse.id, { credits: 4 })).rejects.toThrow(
        new ValidationError(
          "Cannot update credits, students have already registered for the course",
          "Không thể cập nhật tín chỉ, có sinh viên đã đăng ký khóa học này"
        )
      );
    });

    test("When updating credits with no registered students, then return updated course", async () => {
      Class.findAll.mockResolvedValue([]); // No students
      const result = await courseService.update(mockCourse.id, { credits: 4 });

      expect(result.course.credits).toBe(4);
      expect(mockCourse.update).toHaveBeenCalledWith({ credits: 4 });
    });

    test("When updating with invalid facultyCode, then throw NotFoundError", async () => {
      Faculty.findOne.mockResolvedValue(null);
      await expect(courseService.update(mockCourse.id, { facultyCode: "INVALID" })).rejects.toThrow(
        new NotFoundError("Faculty not found", "Khoa không tồn tại: INVALID")
      );
    });

    test("When updating with invalid prerequisiteCourseCode, then throw NotFoundError", async () => {
      Course.findAll.mockResolvedValue([]);
      await expect(courseService.update(mockCourse.id, { prerequisiteCourseCode: ["INVALID"] })).rejects.toThrow(
        new NotFoundError("Prerequisite course(s) not found", "Môn tiên quyết không tồn tại: INVALID")
      );
    });

    test("When updating with valid prerequisiteCourseCode, then return updated course", async () => {
      Course.findAll.mockResolvedValue([{ courseCode: "CS100", get: () => ({ courseCode: "CS100" }) }]);
      const result = await courseService.update(mockCourse.id, { prerequisiteCourseCode: ["CS100"] });

      expect(result.course.prerequisiteCourseCode).toEqual(["CS100"]);
      expect(mockCourse.update).toHaveBeenCalledWith({ prerequisiteCourseCode: ["CS100"] });
    });
  });

});