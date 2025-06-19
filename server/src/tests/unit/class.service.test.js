const ClassService = require("../../service/class.service");

const {
  ValidationError,
  NotFoundError,
  DuplicateResourceError,
} = require("../../util/errors");

const { mockClassInfo, mockCreatedClass } = require("./__mocks__/class.mock");
const { mockCourse } = require("./__mocks__/course.mock");

jest.mock("../../config/db");
jest.mock("../../models/init-models", () => {
  return jest.fn(() => ({
    Class: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Course: {
      findOne: jest.fn(),
    },
    Student: {
      findOne: jest.fn(),
    },
    ClassRegistration: {
      count: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    },
  }));
});
jest.mock("../../util/validator", () => ({
  validateUUID: jest.fn(() => true),
}));

describe("ClassService", () => {
  let models;

  beforeEach(() => {
    jest.clearAllMocks();
    models = require("../../models/init-models")(require("../../config/db"));
  });

  describe("create", () => {
    it("should create a new class successfully", async () => {
      // Arrange
      const mockClassInfo = {
        classCode: "21_CQ1",
        courseCode: "FRA101",
        academicYear: "2023-2024",
        semester: "1",
        maxStudents: 30,
      };

      const mockCourse = {
        id: "course-123",
        courseCode: "FRA101",
        name: "French 101",
        credits: 3,
        facultyCode: "KHNN",
        get: jest.fn().mockReturnValue({
          id: "course-123",
          courseCode: "FRA101",
          name: "French 101",
          credits: 3,
          facultyCode: "KHNN",
        }),
      };

      const mockCreatedClass = {
        id: "class-123",
        ...mockClassInfo,
        get: jest.fn().mockReturnValue({
          id: "class-123",
          ...mockClassInfo,
        }),
      };

      // Setup mocks
      models.Course.findOne.mockResolvedValue(mockCourse);
      models.Class.findOne.mockResolvedValue(null); // No duplicate class
      models.Class.create.mockResolvedValue(mockCreatedClass);

      // Act
      const result = await ClassService.create(mockClassInfo);

      // Assert
      // Verify Course existence check
      expect(models.Course.findOne).toHaveBeenCalledWith({
        where: { courseCode: mockClassInfo.courseCode },
      });

      // Verify duplicate class check
      expect(models.Class.findOne).toHaveBeenCalledWith({
        where: { classCode: mockClassInfo.classCode },
      });

      // Verify class creation
      expect(models.Class.create).toHaveBeenCalledWith(mockClassInfo);

      // Verify returned data structure
      expect(result).toEqual({
        class: expect.objectContaining({
          id: "class-123",
          classCode: mockClassInfo.classCode,
          courseCode: mockClassInfo.courseCode,
          academicYear: mockClassInfo.academicYear,
          semester: mockClassInfo.semester,
          maxStudents: mockClassInfo.maxStudents,
        }),
      });
    });

    it("should throw ValidationError when required fields are missing", async () => {
      // Arrange
      const classInfo = {
        classCode: "21_CQ1",
        // Missing courseCode
        academicYear: "2023",
        semester: "Kỳ 2",
        maxStudents: 80,
      };

      // Act & Assert
      await expect(ClassService.create(classInfo)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw NotFoundError when course does not exist", async () => {
      // Arrange
      const classInfo = {
        classCode: "21_CQ1",
        courseCode: "NON_EXISTENT",
        academicYear: "2023",
        semester: "Kỳ 2",
        maxStudents: 80,
      };

      models.Course.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(ClassService.create(classInfo)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw DuplicateResourceError when class code already exists", async () => {
      // Arrange
      const classInfo = {
        classCode: "21_CQ1",
        courseCode: "FRA101",
        academicYear: "2023",
        semester: "Kỳ 2",
        maxStudents: 80,
      };

      const mockExistingClass = { id: 1, classCode: "21_CQ1" };

      models.Course.findOne.mockResolvedValue({ id: 1 });
      models.Class.findOne.mockResolvedValue(mockExistingClass);

      // Act & Assert
      await expect(ClassService.create(classInfo)).rejects.toThrow(
        DuplicateResourceError
      );
    });
  });

  describe("allocateStudent", () => {
    it("should allocate a student to a class successfully", async () => {
      // Arrange
      const classId = "class-id";
      const studentId = "student-id";

      const mockClass = {
        id: classId,
        classCode: "21_CQ1",
        maxStudents: 30,
        courseCodeCourse: { prerequisiteCourseCode: [] },
      };

      const mockStudent = { id: studentId, studentCode: "2022016" };

      models.Class.findOne.mockResolvedValue(mockClass);
      models.Student.findOne.mockResolvedValue(mockStudent);
      models.ClassRegistration.count.mockResolvedValue(10);
      models.ClassRegistration.findAll.mockResolvedValue([]);
      models.ClassRegistration.create.mockResolvedValue({
        classCode: "21_CQ1",
        studentCode: "2022016",
      });

      // Act
      const result = await ClassService.allocateStudent(classId, studentId);

      // Assert
      expect(models.Class.findOne).toHaveBeenCalledWith({
        where: { id: classId },
        include: [{ model: models.Course, as: "courseCodeCourse" }],
      });
      expect(models.Student.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(models.ClassRegistration.create).toHaveBeenCalledWith({
        classCode: "21_CQ1",
        studentCode: "2022016",
      });
      expect(result).toEqual({
        data: { classCode: "21_CQ1", studentCode: "2022016" },
      });
    });

    it("should throw ValidationError when class is full", async () => {
      // Arrange
      const classId = "class-id";
      const studentId = "student-id";

      const mockClass = {
        id: classId,
        classCode: "21_CQ1",
        maxStudents: 30,
        courseCodeCourse: { prerequisiteCourseCode: [] },
      };

      models.Class.findOne.mockResolvedValue(mockClass);
      models.ClassRegistration.count.mockResolvedValue(30); // Class is full

      // Act & Assert
      await expect(
        ClassService.allocateStudent(classId, studentId)
      ).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError when class does not exist", async () => {
      // Arrange
      const classId = "non-existent-class-id";
      const studentId = "student-id";

      models.Class.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        ClassService.allocateStudent(classId, studentId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when student does not exist", async () => {
      // Arrange
      const classId = "class-id";
      const studentId = "non-existent-student-id";

      const mockClass = {
        id: classId,
        classCode: "21_CQ1",
        maxStudents: 30,
        courseCodeCourse: { prerequisiteCourseCode: [] },
      };

      models.Class.findOne.mockResolvedValue(mockClass);
      models.Student.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        ClassService.allocateStudent(classId, studentId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("cancelStudentRegistration", () => {
    it("should cancel a student's registration successfully", async () => {
      // Arrange
      const classId = "class-id";
      const studentId = "student-id";

      const mockClass = { id: classId, classCode: "21_CQ1" };
      const mockStudent = { id: studentId, studentCode: "2022016" };
      const mockRegistration = { destroy: jest.fn() };

      models.Class.findOne.mockResolvedValue(mockClass);
      models.Student.findOne.mockResolvedValue(mockStudent);
      models.ClassRegistration.findOne.mockResolvedValue(mockRegistration);

      // Act
      const result = await ClassService.cancelStudentRegistration(
        classId,
        studentId
      );

      // Assert
      expect(models.Class.findOne).toHaveBeenCalledWith({
        where: { id: classId },
      });
      expect(models.Student.findOne).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(models.ClassRegistration.findOne).toHaveBeenCalledWith({
        where: { classCode: "21_CQ1", studentCode: "2022016" },
      });
      expect(mockRegistration.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Registration canceled successfully",
        message_vi: "Hủy đăng ký thành công",
      });
    });

    it("should throw NotFoundError when registration does not exist", async () => {
      // Arrange
      const classId = "class-id";
      const studentId = "student-id";

      const mockClass = { id: classId, classCode: "21_CQ1" };
      const mockStudent = { id: studentId, studentCode: "2022016" };

      models.Class.findOne.mockResolvedValue(mockClass);
      models.Student.findOne.mockResolvedValue(mockStudent);
      models.ClassRegistration.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        ClassService.cancelStudentRegistration(classId, studentId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
