const router = require("express").Router();
const { index, createIndex } = require("../controllers/index");
router.post("/", index);
router.post("/create", createIndex);

module.exports = router;