const express = require("express");
const router = express.Router();
const classController = require("../controller/class.controller");

router.get("/class-registration-periods", classController.getClassRegistrationPeriods);
router.post("/class-registration-periods", classController.createClassRegistrationPeriod);
router.put("/class-registration-periods/:id", classController.updateClassRegistrationPeriod);

router.get("/class-registrations/:classCode", classController.getDetailByClassCode);
router.get("/", classController.getAll);
// Route to create a new class
router.post("/allocate/:classCode/:studentCode", classController.allocateStudent);
router.delete("/cancel/:classId/:studentId", classController.cancelStudentRegistration);
router.post("/", classController.create);

module.exports = router;
