const CourseService = require("../../service/course.service");
const { Course } = require("./__mocks__/course.model");
const { NotFoundError, ValidationError, DuplicateResourceError } = require("../../util/errors");
const { Faculty } = require("./__mocks__/faculty.model");


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


describe("update a course", () => {
    let course;
    let courseService;
    beforeEach(() => {
        course = {
            id: 1,
            name: "Introduction to Programming",
            courseCode: "CS101",
            credits: 3,
            facultyCode: "CS",
            description: "Basic programming course",
            prerequisiteCourseCode: ["CS100", "CS200"],
        };
        Faculty.findOne.mockResolvedValue({ facultyCode: "CS" });
        Course.findAll.mockResolvedValue([{ courseCode: "CS100" }, { courseCode: "CS102" }]);
        Course.findByPk.mockImplementation((id) => {
            if (id === course.id) {
                return Promise.resolve({
                    ...course,
                    get: () => ({
                        ...course,
                        name: "Updated Programming Course",
                        description: "Updated description",
                        prerequisiteCourseCode: ["CS100", "CS102"],
                    }),
                });
            }
            return Promise.resolve(null);
        });
        Course.update.mockResolvedValue([1, []]); // Simulate successful update
        courseService = new CourseService({ Course, Faculty });
    });

    test("When updating with valid data, then return updated course", async () => {
        //Arrange
        const updateData = {
            name: "Updated Programming Course",
            description: "Updated description",
            facultyCode: "CS",
            prerequisiteCourseCode: ["CS100", "CS102"],
        };
        //Act && Assert
        await expect(courseService.update(course.id, updateData)).resolves.toBeDefined();
    });
});