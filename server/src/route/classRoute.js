const express = require("express");
const router = express.Router();
const classController = require("../controller/class.controller");

// Route to create a new class
router.post("/", classController.create);
router.post("/allocate", classController.allocateStudent);

module.exports = router;
