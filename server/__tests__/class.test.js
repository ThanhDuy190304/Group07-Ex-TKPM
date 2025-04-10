const request = require("supertest");
const express = require("express");
const classRoute = require("../src/route/classRoute");
const classController = require("../src/controller/class.controller");

const app = express();
app.use(express.json());
app.use("/api/class", classRoute);

describe("Class Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new class", async () => {
    const newClassData = {
      classCode: "21_CQ3",
      courseCode: "FRA101",
      semester: "Kỳ 2",
      academicYear: "2023",
      instructor: "Lý Phương Thắm",
      maxStudents: 80,
      room: "E102",
      schedule: "T2(1-3)-P.cs2:E102",
    };

    const res = await request(app).post("/api/class").send(newClassData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("class");
    const createdClass = res.body.data.class;

    expect(createdClass).toHaveProperty("id");
    expect(typeof createdClass.id).toBe("string");
    // UUID v4 pattern check (simple version)
    expect(createdClass.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );

    // Ensure all other fields match
    expect(createdClass).toMatchObject(newClassData);
    // expect(classController.create).toHaveBeenCalledTimes(1);
  });

  it("should allocate a student to a class", async () => {
    const allocationData = {
      studentId: "92320824-e17b-446c-be8b-86494420f7a8",
      classId: "7b8d3f25-2ce2-42ac-bbdd-cc48afc652b2",
    };
    const res = await request(app)
      .post("/api/class/allocate")
      .send(allocationData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("classCode");
    expect(res.body.data).toHaveProperty("studentCode");
    expect(res.body.data.classCode).toEqual("21_CQ1");
    expect(res.body.data.studentCode).toEqual("2022016");
    // expect(classController.allocateStudent).toHaveBeenCalledTimes(1);
  });

  it("should return 409 if student is already allocated to the class", async () => {
    const allocationData = {
      studentId: "8d667db6-de72-4674-8464-145731496267",
      classId: "7b8d3f25-2ce2-42ac-bbdd-cc48afc652b2",
    };

    const res = await request(app)
      .post("/api/class/allocate")
      .send(allocationData);

    expect(res.statusCode).toEqual(409);
    // expect(classController.allocateStudent).toHaveBeenCalledTimes(1);
  });

  it("should handle errors when creating a class and missing semester", async () => {
    const newClassData = {
      classCode: "21_CQ3",
      courseCode: "FRA101", // missing classCode
      academicYear: "2023",
      instructor: "Lý Phương Thắm",
      maxStudents: 80,
      room: "E102",
      schedule: "T2(1-3)-P.cs2:E102",
    };

    const res = await request(app).post("/api/class").send(newClassData);


    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error");

    // expect(classController.create).toHaveBeenCalledTimes(1);
  });

  // it('should handle errors when allocating a student to class', async () => {
  //   classController.allocateStudent.mockImplementationOnce((req, res) => {
  //       res.status(400).json({ message: 'Bad request' });
  //   });

  //   const allocationData = { studentId: 1, classId: 1 };
  //   const res = await request(app)
  //     .post('/api/class/allocate')
  //     .send(allocationData);

  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body.message).toEqual('Bad request');
  //   expect(classController.allocateStudent).toHaveBeenCalledTimes(1);
  // });

  //   it('should handle errors on post / with invalid class data', async () => {
  //       const invalidClassData = {};

  //       classController.create.mockImplementationOnce((req, res) => {
  //           res.status(400).json({ message: "Invalid Class Data" })
  //       });

  //       const res = await request(app).post("/api/class").send(invalidClassData);

  //       expect(res.statusCode).toBe(400);
  //       expect(res.body.message).toBe("Invalid Class Data");
  //       expect(classController.create).toHaveBeenCalledTimes(1);
  //   });

  //       it('should handle errors on post /allocate with invalid allocation data', async () => {
  //       const invalidAllocationData = {};

  //       classController.allocateStudent.mockImplementationOnce((req, res) => {
  //           res.status(400).json({ message: "Invalid Allocation Data" })
  //       });

  //       const res = await request(app).post("/api/class/allocate").send(invalidAllocationData);

  //       expect(res.statusCode).toBe(400);
  //       expect(res.body.message).toBe("Invalid Allocation Data");
  //       expect(classController.allocateStudent).toHaveBeenCalledTimes(1);
  //   });
});
