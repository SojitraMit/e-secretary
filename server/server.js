const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const {
  User,
  Complaint,
  Update,
  Bill,
  Suggestion,
  Poll,
  Funds,
  Maintenance,
} = require("./models/AllModels");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increased limit for base64 file uploads

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// --- Middleware ---
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token required");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

// --- Auth Routes ---
app.post("/api/register", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (isAdmin) {
    // Hardcoded Admin for demo simplicity (In real app, store admin in DB)
    if (email === "admin@society.com" && password === "admin123") {
      const token = jwt.sign(
        { role: "admin", email: "admin@society.com", name: "Admin" },
        process.env.JWT_SECRET
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
    process.env.JWT_SECRET
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

// --- Data Routes ---

// Get All Initial Data (Dashboard Load)
app.get("/api/data", verifyToken, async (req, res) => {
  const [users, funds, complaints, updates, bills, suggestions, poll] =
    await Promise.all([
      User.find({}, "-password"), // Exclude passwords
      Funds.findOne().sort({ _id: -1 }),
      Complaint.find().sort({ createdAt: -1 }),
      Update.find().sort({ createdAt: -1 }),
      Bill.find().sort({ createdAt: -1 }),
      Suggestion.find().sort({ createdAt: -1 }),
      Poll.findOne({ isActive: true }), // Only fetch active poll
    ]);

  res.json({
    users,
    funds: funds || { balance: 0 },
    complaints,
    updates,
    bills,
    suggestions,
    poll,
  });
});

// Complaints
app.post("/api/complaints", verifyToken, async (req, res) => {
  const newC = new Complaint(req.body);
  await newC.save();
  res.json(newC);
});

app.put("/api/complaints/:id", verifyToken, async (req, res) => {
  const { status } = req.body;
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(updated);
});

// Updates
app.post("/api/updates", verifyToken, async (req, res) => {
  const newU = new Update(req.body);
  await newU.save();
  res.json(newU);
});

// Funds
app.post("/api/funds", verifyToken, async (req, res) => {
  const newF = new Funds(req.body);
  await newF.save();
  res.json(newF);
});

// Suggestions
app.post("/api/suggestions", verifyToken, async (req, res) => {
  const newS = new Suggestion(req.body);
  await newS.save();
  res.json(newS);
});

// Bills (File Upload handled as base64 string in body for simplicity)
app.post("/api/bills", verifyToken, async (req, res) => {
  const newB = new Bill(req.body);
  await newB.save();
  res.json(newB);
});

// Polls
app.post("/api/poll", verifyToken, async (req, res) => {
  // Deactivate old polls
  await Poll.updateMany({}, { isActive: false });
  const newP = new Poll(req.body);
  await newP.save();
  res.json(newP);
});

app.put("/api/poll/vote", verifyToken, async (req, res) => {
  const { pollId, optionId, userEmail } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll || !poll.isActive)
    return res.status(400).json({ msg: "Poll inactive" });

  if (poll.votesBy.get(userEmail))
    return res.status(400).json({ msg: "Already voted" });

  const option = poll.options.id(optionId);
  if (option) {
    option.votes += 1;
    poll.votesBy.set(userEmail, optionId);
    await poll.save();
  }
  res.json(poll);
});

app.put("/api/poll/close/:id", verifyToken, async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  res.json(poll);
});

// Maintenance
app.get("/api/maintenance/:monthKey", verifyToken, async (req, res) => {
  const data = await Maintenance.findOne({ monthKey: req.params.monthKey });
  res.json(
    data || { monthKey: req.params.monthKey, amount: 2500, records: {} }
  );
});

app.post("/api/maintenance", verifyToken, async (req, res) => {
  const { monthKey, email, status, txnId } = req.body;
  let maint = await Maintenance.findOne({ monthKey });

  if (!maint) {
    maint = new Maintenance({ monthKey, amount: 2500, records: {} });
  }

  // Update specific record in Map
  const currentRecord = maint.records.get(email) || {};
  maint.records.set(email, {
    ...currentRecord,
    status,
    txnId,
    updatedAt: new Date(),
  });

  await maint.save();
  res.json(maint);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
