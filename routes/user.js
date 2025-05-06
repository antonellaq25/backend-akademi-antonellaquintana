const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  upadateUser,
  activeToggle
} = require("../controllers/user-controller");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.use(auth); 
router.use(role(["admin"])); 

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", upadateUser);
router.patch("/:id/toggle", activeToggle);

module.exports = router;
