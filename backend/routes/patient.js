const router = require("express").Router();
const { createPatient } = require("../controllers/patient");
router.post("/create", createPatient);

module.exports = router;