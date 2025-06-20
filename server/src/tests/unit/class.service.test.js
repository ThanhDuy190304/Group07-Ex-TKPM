// Mock the global models object
const mockClassRegistration = { destroy: jest.fn() };
const mockModels = {
  ClassRegistration: mockClassRegistration,
};

jest.mock("../../models/init-models", () => {
  return jest.fn(() => mockModels);
});

const { Class } = require("./__mocks__/class.model");
const { Course } = require("./__mocks__/course.model");
const { mockClassInfo, mockCreatedClass } = require("./__mocks__/class.mock");
const { mockCourse } = require("./__mocks__/course.mock");
const ClassService = require("../../service/class.service");
const {
  NotFoundError,
  ValidationError,
  DuplicateResourceError,
} = require("../../util/errors");

describe("unit test for ClassService.create", () => {
  let classService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Arrange
    Course.findOne.mockReset();
    Class.findOne.mockReset();
    Class.create.mockReset();
    Course.findOne.mockResolvedValue(mockCourse);
    Class.findOne.mockResolvedValue(null);
    Class.create.mockResolvedValue({
      ...mockCreatedClass,
      get: function () {
        return this;
      },
    });
    classService = new ClassService({ Class, Course });
  });

  test("When data is valid, should create class successfully", async () => {
    // Act
    const result = await classService.create(mockClassInfo);
    // Assert
    expect(result.class).toMatchObject(
      expect.objectContaining({
        classCode: mockClassInfo.classCode,
        courseCode: mockClassInfo.courseCode,
        academicYear: mockClassInfo.academicYear,
        semester: mockClassInfo.semester,
        maxStudents: mockClassInfo.maxStudents,
      })
    );
    expect(Class.create).toHaveBeenCalledWith(
      expect.objectContaining(mockClassInfo)
    );
  });

  test("When missing required fields, then throw ValidationError", async () => {
    const invalidData = { ...mockClassInfo };
    delete invalidData.classCode;
    await expect(classService.create(invalidData)).rejects.toThrow(
      ValidationError
    );
  });

  test("When course does not exist, then throw NotFoundError", async () => {
    Course.findOne.mockResolvedValue(null);
    await expect(classService.create(mockClassInfo)).rejects.toThrow(
      NotFoundError
    );
  });

  test("When class code already exists, then throw DuplicateResourceError", async () => {
    Class.findOne.mockResolvedValue(mockCreatedClass);
    await expect(classService.create(mockClassInfo)).rejects.toThrow(
      DuplicateResourceError
    );
  });
});

describe("unit test for ClassService.registerClassForStudent", () => {
  let classService;
  beforeEach(() => {
    jest.clearAllMocks();
    classService = new ClassService({ Class, Course });
  });

  test("When class does not exist, then throw NotFoundError", async () => {
    Class.findOne.mockResolvedValue(null);
    await expect(
      classService.registerClassForStudent("21_CQ1", "SV001")
    ).rejects.toThrow(NotFoundError);
  });

  test("When class is full, then throw ValidationError", async () => {
    const mockClass = {
      classCode: "21_CQ1",
      maxStudents: 1,
      courseCodeCourse: { prerequisiteCourseCode: [] },
    };
    Class.findOne.mockResolvedValue(mockClass);
    classService.ClassRegistration = {
      findAll: jest.fn().mockResolvedValue([{}]),
    };
    await expect(
      classService.registerClassForStudent("21_CQ1", "SV001")
    ).rejects.toThrow(ValidationError);
  });

  test("When missing prerequisites, then throw ValidationError", async () => {
    const mockClass = {
      classCode: "21_CQ1",
      maxStudents: 10,
      courseCodeCourse: { prerequisiteCourseCode: ["PRE101"] },
    };
    Class.findOne.mockResolvedValue(mockClass);
    classService.ClassRegistration = {
      findAll: jest
        .fn()
        .mockResolvedValueOnce([]) // registrations for class
        .mockResolvedValueOnce([]), // completed prerequisites
    };
    await expect(
      classService.registerClassForStudent("21_CQ1", "SV001")
    ).rejects.toThrow(ValidationError);
  });
});

describe("unit test for ClassService.cancelStudentRegistration", () => {
  let classService;

  beforeEach(() => {
    jest.clearAllMocks();
    classService = new ClassService({ Class, Course });
  });

  test("When registration exists, should cancel successfully", async () => {
    mockClassRegistration.destroy.mockResolvedValue(1);
    await expect(
      classService.cancelStudentRegistration("21_CQ1", "SV001")
    ).resolves.toBeUndefined();
  });

  test("When registration does not exist, then throw NotFoundError", async () => {
    mockClassRegistration.destroy.mockResolvedValue(0);
    await expect(
      classService.cancelStudentRegistration("21_CQ1", "SV001")
    ).rejects.toThrow(NotFoundError);
  });
});

describe("unit test for ClassService.getDetailByClassCode", () => {
  let classService;
  beforeEach(() => {
    jest.clearAllMocks();
    classService = new ClassService({ Class, Course });
    classService.ClassRegistration = { findAll: jest.fn() };
  });

  test("When class registrations exist, should return details", async () => {
    classService.ClassRegistration.findAll.mockResolvedValue([
      { classCode: "21_CQ1", studentCode: "SV001" },
    ]);
    const result = await classService.getDetailByClassCode("21_CQ1");
    expect(result.classRegistrations).toEqual([
      { classCode: "21_CQ1", studentCode: "SV001" },
    ]);
  });
});

describe("unit test for ClassService.createClassRegistrationPeriod", () => {
  let classService;
  beforeEach(() => {
    jest.clearAllMocks();
    classService = new ClassService({ Class, Course });
    classService.ClassRegistrationPeriod = { create: jest.fn() };
  });

  test("When data is valid, should create period successfully", async () => {
    classService.ClassRegistrationPeriod.create.mockResolvedValue({});
    const validPeriod = {
      startDateTime: "2025-06-01T08:00:00Z",
      endDateTime: "2025-06-10T17:00:00Z",
      semester: "Kỳ 1",
      academicYear: "2025",
    };
    await expect(
      classService.createClassRegistrationPeriod(validPeriod)
    ).resolves.toBeUndefined();
  });

  test("When missing required fields, then throw ValidationError", async () => {
    const invalidPeriod = {
      endDateTime: "2025-06-10T17:00:00Z",
      semester: "Kỳ 1",
    };
    await expect(
      classService.createClassRegistrationPeriod(invalidPeriod)
    ).rejects.toThrow(ValidationError);
  });

  test("When startDateTime >= endDateTime, then throw ValidationError", async () => {
    const invalidPeriod = {
      startDateTime: "2025-06-10T17:00:00Z",
      endDateTime: "2025-06-01T08:00:00Z",
      semester: "Kỳ 1",
      academicYear: "2025",
    };
    await expect(
      classService.createClassRegistrationPeriod(invalidPeriod)
    ).rejects.toThrow(ValidationError);
  });
});
