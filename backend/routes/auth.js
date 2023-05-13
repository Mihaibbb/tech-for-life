const router = require("express").Router();
const { login, validToken, logOut } = require("../controllers/auth");

router.post("/login", login);
router.post("/valid-token", validToken);
router.post("/logout", logOut);

module.exports = router;