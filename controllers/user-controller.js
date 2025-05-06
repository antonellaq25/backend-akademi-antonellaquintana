const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-contraseña");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error searching user" });
  }
};

exports.upadateUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "User successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.activeToggle = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.active = !user.active;
    await user.save();

    res.json({ message: `User ${user.active ? "activated" : "inactive"}` });
  } catch (error) {
    res.status(500).json({ message: "Error changing user state" });
  }
};
