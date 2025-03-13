const express = require("express");
const { getPrograms } = require("../modules/program/programController");

const router = express.Router();
router.get("/", getPrograms);

module.exports = router;
