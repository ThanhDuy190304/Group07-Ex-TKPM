const CourseService = require("../../service/course.service");
const {
  ValidationError,
  NotFoundError,
  DuplicateResourceError,
} = require("../../util/errors");

// Mock the BaseService
jest.mock("../../service/base.service", () => {
  return class {
    constructor() {
      this.model = {};
    }
    async delete() {
      return true;
    }
  };
});

// Mock models
jest.mock("../../models/init-models", () => () => ({
  Course: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
  },
  Faculty: {
    findOne: jest.fn(),
  },
  Class: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Student: {
    findOne: jest.fn(),
  },
}));

// Mock sequelize
jest.mock("../../config/db", () => ({}));

describe("CourseService", () => {
  let courseService;
  let mockCourse;

  beforeEach(() => {
    courseService = CourseService;
    mockCourse = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      courseCode: "CS101",
      name: "Introduction to Computer Science",
      credits: 3,
      facultyCode: "CNTT",
      description: "An introductory course to computer science",
      prerequisiteCourseCode: ["MATH101"],
      update: jest.fn().mockImplementation(function (updateData) {
        Object.assign(this, updateData);
        return this;
      }),
      get: function (options) {
        return options?.plain ? this : this;
      },
    };

    // Setup mock models
    courseService.model = {
      findOne: jest.fn(),
      create: jest.fn().mockResolvedValue(mockCourse),
      findAll: jest.fn(),
    };

    // Setup global models
    global.models = {
      Course: courseService.model,
      Faculty: {
        findOne: jest.fn(),
      },
      Class: {
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
      Student: {
        findOne: jest.fn(),
      },
    };
  });

  describe("create", () => {
    test("When creating a course with empty prerequisiteCourseCode array, then create course successfully", async () => {
      const newCourseData = {
        courseCode: "CS101",
        name: "Introduction to Computer Science",
        credits: 3,
        facultyCode: "CNTT",
        description: "An introductory course to computer science",
        prerequisiteCourseCode: [],
      };

      courseService.model.findOne.mockResolvedValueOnce(null);
      global.models.Faculty.findOne.mockResolvedValueOnce({
        facultyCode: "CNTT",
      });

      const result = await courseService.create(newCourseData);

      expect(result).toEqual({
        course: mockCourse,
      });
    });

    test("When creating a course with duplicate courseCode, then throw DuplicateResourceError", async () => {
      const newCourseData = {
        courseCode: "CS101",
        name: "Introduction to Computer Science",
        credits: 3,
        facultyCode: "CNTT",
        description: "An introductory course to computer science",
        prerequisiteCourseCode: [],
      };

      // Mock finding an existing course with the same code
      courseService.model.findOne.mockResolvedValue({
        courseCode: "CS101",
        get: () => ({ courseCode: "CS101" }),
      });

      // Mock faculty find
      global.models.Faculty.findOne.mockResolvedValue({
        facultyCode: "CNTT",
      });

      // Test that the create method throws DuplicateResourceError
      await expect(courseService.create(newCourseData)).rejects.toThrow(
        DuplicateResourceError
      );

      // Verify findOne was called with correct params
      expect(courseService.model.findOne).toHaveBeenCalledWith({
        where: { courseCode: newCourseData.courseCode },
      });
    });

    test("When creating a course with invalid faculty, then throw NotFoundError", async () => {
      const newCourseData = {
        courseCode: "CS101",
        name: "Introduction to Computer Science",
        credits: 3,
        facultyCode: "INVALID",
        description: "An introductory course to computer science",
        prerequisiteCourseCode: [],
      };

      courseService.model.findOne.mockResolvedValueOnce(null);
      global.models.Faculty.findOne.mockResolvedValueOnce(null);

      await expect(courseService.create(newCourseData)).rejects.toThrow(
        NotFoundError
      );
    });

    test("When creating a course with invalid credits (negative), then throw ValidationError", async () => {
      const newCourseData = {
        courseCode: "CS101",
        name: "Introduction to Computer Science",
        credits: -1,
        facultyCode: "CNTT",
        description: "An introductory course to computer science",
        prerequisiteCourseCode: [],
      };

      await expect(courseService.create(newCourseData)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("update", () => {
    test("When updating course with invalid credits value (negative), then throw ValidationError", async () => {
      const courseId = mockCourse.id;
      const updateData = {
        credits: -1,
      };

      courseService.model.findOne.mockResolvedValueOnce(mockCourse);

      await expect(courseService.update(courseId, updateData)).rejects.toThrow(
        ValidationError
      );
    });

    test("When updating non-existent course, then throw NotFoundError", async () => {
      const courseId = "non-existent-id";
      const updateData = {
        name: "Updated Course Name",
      };

      courseService.model.findOne.mockResolvedValueOnce(null);

      await expect(courseService.update(courseId, updateData)).rejects.toThrow(
        NotFoundError
      );
    });

    test("When updating course with valid data, then update successfully", async () => {
      const courseId = mockCourse.id;
      const updateData = {
        name: "Updated Course Name",
        credits: 4,
        description: "Updated description",
      };

      const updatedCourse = {
        ...mockCourse,
        ...updateData,
      };

      courseService.model.findOne.mockResolvedValueOnce(mockCourse);
      mockCourse.update.mockResolvedValueOnce(updatedCourse);

      const result = await courseService.update(courseId, updateData);

      expect(result.course.name).toBe(updateData.name);
      expect(result.course.credits).toBe(updateData.credits);
      expect(result.course.description).toBe(updateData.description);
    });

    test("When updating course with invalid faculty, then throw NotFoundError", async () => {
      const courseId = mockCourse.id;
      const updateData = {
        facultyCode: "INVALID",
      };

      courseService.model.findOne.mockResolvedValueOnce(mockCourse);
      global.models.Faculty.findOne.mockResolvedValueOnce(null);

      await expect(courseService.update(courseId, updateData)).rejects.toThrow(
        NotFoundError
      );
    });

    test("When updating course with registered students, then throw ValidationError", async () => {
      const courseId = mockCourse.id;
      const updateData = {
        credits: 4,
      };

      courseService.model.findOne.mockResolvedValueOnce(mockCourse);
      global.models.Class.findAll.mockResolvedValueOnce([
        {
          studentCodeStudents: [{ id: 1 }],
        },
      ]);

      await expect(courseService.update(courseId, updateData)).rejects.toThrow(
        ValidationError
      );
    });

    test("When updating course with valid faculty, then update successfully", async () => {
      const courseId = mockCourse.id;
      const updateData = {
        facultyCode: "NEW_FACULTY",
      };

      const updatedCourse = {
        ...mockCourse,
        ...updateData,
      };

      courseService.model.findOne.mockResolvedValueOnce(mockCourse);
      global.models.Faculty.findOne.mockResolvedValueOnce({
        facultyCode: "NEW_FACULTY",
      });
      mockCourse.update.mockResolvedValueOnce(updatedCourse);

      const result = await courseService.update(courseId, updateData);

      expect(result.course.facultyCode).toBe(updateData.facultyCode);
    });
  });
});
