const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management System API",
      version: "1.0.0",
      description: "API documentation for Student Management System",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Course: {
          type: "object",
          required: ["courseCode", "name", "credits", "facultyCode"],
          properties: {
            id: { type: "string", format: "uuid" },
            courseCode: { type: "string", example: "CS101" },
            name: { type: "string", example: "Introduction to Programming" },
            credits: { type: "integer", minimum: 1, example: 3 },
            facultyCode: { type: "string", example: "CNTT" },
            description: { type: "string" },
            prerequisiteCourseCode: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        Class: {
          type: "object",
          required: [
            "classCode",
            "courseCode",
            "academicYear",
            "semester",
            "maxStudents",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            classCode: { type: "string", example: "21_CQ1" },
            courseCode: { type: "string", example: "CS101" },
            academicYear: { type: "string", example: "2023-2024" },
            semester: { type: "string", enum: ["1", "2", "3"] },
            maxStudents: { type: "integer", minimum: 1, example: 30 },
          },
        },
        Student: {
          type: "object",
          required: [
            "studentId",
            "firstName",
            "lastName",
            "email",
            "programCode",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            studentId: { type: "string", example: "20120123" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            programCode: { type: "string" },
          },
        },
      },
      responses: {
        NotFound: {
          description: "The specified resource was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  message_vi: { type: "string" },
                  statusCode: { type: "integer", example: 404 },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Invalid input parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  message_vi: { type: "string" },
                  statusCode: { type: "integer", example: 400 },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/route/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
