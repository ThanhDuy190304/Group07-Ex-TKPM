const { Student } = require("./__mocks__/student.model")
const { Program } = require("./__mocks__/program.model")
const { Faculty } = require("./__mocks__/faculty.model")
const { IdentityDocument } = require("./__mocks__/identityDocument")
const StudentService = require("../service/student.service")

const { NotFoundError, ValidationError } = require("../util/errors");

describe("StudentService.update", () => {
    let mockStudent;
    let studentService;

    beforeEach(() => {
        //Arrange
        mockStudent = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            studentCode: "SV001",
            fullName: "Nguyen Van A",
            email: "nguyenvana@student.university.edu.vn",
            phoneNumber: "+84901234567",
            nationality: "VN",
            gender: "male",
            facultyCode: "CNTT",
            programCode: "KTPM",
            cohortYear: 2022,
            status: "Tạm dừng học",
            update: jest.fn().mockImplementation(function (data) {
                Object.assign(this, data);
                return Promise.resolve(this);
            }),
            get: function () {
                return this;
            },
        };

        Student.findOne.mockResolvedValue(mockStudent);

        studentService = new StudentService({
            Student: Student, Program: Program,
            Faculty: Faculty, IdentityDocument: IdentityDocument
        })
    })

    test("When updating with valid student data, then return updated student.", async () => {
        //Arrange
        const studentInfoToUpdate = {
            email: "nguyenvanb@student.university.edu.vn",
            status: "Đang học",
            phoneNumber: "+84901234564",
        };
        //Act
        const result = await studentService.update(mockStudent.id, studentInfoToUpdate);
        //Assert
        expect(result.student.email).toBe("nguyenvanb@student.university.edu.vn");
        expect(result.student.status).toBe("Đang học");
        expect(result.student.phoneNumber).toBe("+84901234564");
    });

    test("When updating with invalid email suffix, then throw ValidationError", async () => {
        //Arrange
        const studentInfoToUpdate = { email: "hacker@gmail.com" };
        //Act & Assert
        await expect(studentService.update(mockStudent.id, studentInfoToUpdate))
            .rejects
            .toThrow(ValidationError);
    });

    test("When updating with invalid status, then throw ValidationError", async () => {
        //Arrange
        const studentInfoToUpdate = { status: "Đình chỉ" };
        //Act & Assert
        await expect(studentService.update(mockStudent.id, studentInfoToUpdate))
            .rejects
            .toThrow(ValidationError);
    });

    test("When updating with invalid phone, then throw ValidationError", async () => {
        //Arrange
        const studentInfoToUpdate = { phoneNumber: "+85901234564" };
        //Act & Assert
        await expect(studentService.update(mockStudent.id, studentInfoToUpdate))
            .rejects
            .toThrow(ValidationError);
    });

})


