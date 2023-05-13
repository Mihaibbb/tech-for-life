const router = require("express").Router();
const { login, verifyToken } = require("../controllers/auth");

router.post("/login", login);
router.post("/verify-token", verifyToken);

module.exports = router;