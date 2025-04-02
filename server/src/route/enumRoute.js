const express = require('express');
const EnumController = require('../controller/enum.controller');

const router = express.Router();

router.get("/student-status", EnumController.getStudentStatusTypes);
router.get("/semesters", EnumController.getSemesterTypes);
router.get("/genders", EnumController.getGenderTypes);
router.get("/identity-types", EnumController.getIdentityTypes);

module.exports = router;