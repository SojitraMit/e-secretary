const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, flatNo, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, flatNo, role });
    await user.save();
    res.json({ success: true, message: "User created" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Email likely exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (isAdmin) {
    if (email === "admin@society.com" && password === "admin123") {
      const token = jwt.sign(
        { role: "admin", email: "admin@society.com", name: "Admin" },
        process.env.JWT_SECRET,
      );
      return res.json({
        token,
        user: { role: "admin", name: "Admin", email: "admin@society.com" },
      });
    }
    return res.status(401).json({ message: "Invalid Admin Credentials" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
  );
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      flatNo: user.flatNo,
      role: user.role,
    },
  });
});

module.exports = router;
