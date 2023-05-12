const router = require("express").Router();
const { index } = require("../controllers/index");
router.post("/", index);

module.exports = router;