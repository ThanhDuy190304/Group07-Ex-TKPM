const express = require("express");
const { getCourses } = require("../modules/course/courseController");

const router = express.Router();
router.get("/", getCourses);
module.exports = router;
