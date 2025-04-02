const express = require("express");
const programController = require("../controller/program.controller");
const router = express.Router();


router.get("/", programController.getAll);
router.post("/", programController.create);
router.put("/:programId", programController.update);

module.exports = router;
