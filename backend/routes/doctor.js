const router = require("express").Router();
const { createDoctor } = require("../controllers/doctor");
router.post("/create", createDoctor);

module.exports = router;