const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth-controller");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.post("/register", auth, role("admin"), register);
router.post("/login", login);

module.exports = router;
