const { Student } = require("./__mocks__/student.model")
const { Program } = require("./__mocks__/program.model")
const { Faculty } = require("./__mocks__/faculty.model")
const { IdentityDocument } = require("./__mocks__/identityDocument")
const StudentService = require("../../service/student.service")

const { NotFoundError, ValidationError } = require("../../util/errors");

describe("unit test for StudentService.update", () => {
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

    test("When update data is valid, should update successfully without throw error.", async () => {
        //Arrange
        const studentInfoToUpdate = {
            email: "nguyenvanb@student.university.edu.vn",
            status: "Đang học",
            phoneNumber: "+84901234564",
        };
        //Act && Assert
        await expect(studentService.update(mockStudent.id, studentInfoToUpdate)).resolves.toBeUndefined();
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


describe("unit test for StudentService.create", () => {
    let studentService;
    const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
    };
    beforeEach(() => {
        Student.create.mockResolvedValue({ studentCode: "SV001" });

        Student.sequelize = {
            transaction: jest.fn().mockResolvedValue(mockTransaction)
        };

        IdentityDocument.findOne.mockResolvedValue(null);
        IdentityDocument.create.mockResolvedValue({});

        studentService = new StudentService({
            Student: Student, Program: Program,
            Faculty: Faculty, IdentityDocument: IdentityDocument
        })
    })

    test("When data being full fields and valid, should create successfully without throw error.", async () => {
        //Arrange
        const newStudent = {
            studentCode: "SV001",
            fullName: "Nguyen Van A",
            dateOfBirth: "2025-03-03",
            gender: "male",
            email: "nguyenvana@student.university.edu.vn",
            phoneNumber: "+84901234567",
            nationality: "VN",
            facultyCode: "CNTT",
            programCode: "KTPM",
            cohortYear: 2022,
            identityDocuments: [{ type: "CCCD", number: "123456789" }],
        };
        //Act && Assert
        await expect(studentService.create(newStudent)).resolves.toBeUndefined();
    })

    test("When email does not end with student.university.edu.vn, then throw ValidationError", async () => {
        const newStudent = {
            studentCode: "SV002",
            fullName: "Nguyen Van B",
            dateOfBirth: "2025-03-03",
            gender: "female",
            email: "someone@gmail.com", // ❌ sai đuôi
            phoneNumber: "+84901234567",
            nationality: "VN",
            facultyCode: "CNTT",
            programCode: "KTPM",
            cohortYear: 2022,
            identityDocuments: [{ type: "CCCD", number: "987654321" }],
        };

        await expect(studentService.create(newStudent)).rejects.toThrow(ValidationError);
    });

    test("When phoneNumber is invalid, then throw ValidationError", async () => {
        const newStudent = {
            studentCode: "SV003",
            fullName: "Tran Van C",
            dateOfBirth: "2025-03-03",
            gender: "male",
            email: "tranvanc@student.university.edu.vn",
            phoneNumber: "+85901234567", // ❌ sai đầu số
            nationality: "VN",
            facultyCode: "CNTT",
            programCode: "KTPM",
            cohortYear: 2022,
            identityDocuments: [{ type: "CCCD", number: "1122334455" }],
        };

        await expect(studentService.create(newStudent)).rejects.toThrow(ValidationError);
    });


})




