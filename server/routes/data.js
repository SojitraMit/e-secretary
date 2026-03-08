const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  User,
  Funds,
  Complaint,
  Update,
  Bill,
  Suggestion,
  Poll,
  Maintenance,
} = require("../models");

// Helper functions for email encoding/decoding
const encodeEmail = (email) => Buffer.from(email).toString("base64");
const decodeEmail = (encoded) =>
  Buffer.from(encoded, "base64").toString("utf-8");

// Apply middleware to all routes in this router
router.use(verifyToken);

// Get All Initial Data (Dashboard Load)
router.get("/data", async (req, res) => {
  const [users, funds, complaints, updates, bills, suggestions, poll] =
    await Promise.all([
      User.find({}, "-password"),
      Funds.findOne().sort({ _id: -1 }),
      Complaint.find().sort({ createdAt: -1 }),
      Update.find().sort({ createdAt: -1 }),
      Bill.find().sort({ createdAt: -1 }),
      Suggestion.find().sort({ createdAt: -1 }),
      Poll.findOne({ isActive: true }),
    ]);

  res.json({
    users,
    funds: funds || { balance: 0 },
    complaints,
    updates,
    bills,
    suggestions,
    poll: poll ? poll.toObject() : null,
  });
});

// Complaints
router.post("/complaints", async (req, res) => {
  const newC = new Complaint(req.body);
  await newC.save();
  res.json(newC);
});

router.put("/complaints/:id", async (req, res) => {
  const { status } = req.body;
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.json(updated);
});

// Updates
router.post("/updates", async (req, res) => {
  const newU = new Update(req.body);
  await newU.save();
  res.json(newU);
});

// Funds
router.post("/funds", async (req, res) => {
  const newF = new Funds(req.body);
  await newF.save();
  res.json(newF);
});

// Suggestions
router.post("/suggestions", async (req, res) => {
  const newS = new Suggestion(req.body);
  await newS.save();
  res.json(newS);
});

// Bills
router.post("/bills", async (req, res) => {
  const newB = new Bill(req.body);
  await newB.save();
  res.json(newB);
});

// Polls
router.post("/poll", async (req, res) => {
  await Poll.updateMany({}, { isActive: false });
  const newP = new Poll(req.body);
  await newP.save();
  res.json(newP);
});

// router.put("/poll/vote", async (req, res) => {
//   try {
//     const { pollId, optionIndex, userEmail } = req.body;
//     const poll = await Poll.findById(pollId);
//     if (!poll || !poll.isActive)
//       return res.status(400).json({ msg: "Poll inactive" });

//     if (poll.votesBy && poll.votesBy.get(userEmail))
//       return res.status(400).json({ msg: "Already voted" });

//     if (optionIndex >= 0 && optionIndex < poll.options.length) {
//       const option = poll.options[optionIndex];
//       option.votes += 1;
//       if (!poll.votesBy) poll.votesBy = new Map();
//       poll.votesBy.set(userEmail, String(optionIndex));
//       await poll.save();
//       res.json(poll.toObject());
//     } else {
//       return res.status(400).json({ msg: "Invalid option" });
//     }
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

router.put("/poll/vote", async (req, res) => {
  try {
    const { pollId, optionIndex, userEmail } = req.body;

    if (!pollId || optionIndex === null || !userEmail) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Use findByIdAndUpdate with atomic operation to prevent race conditions
    const update = { $inc: {} };
    update.$inc[`options.${optionIndex}.votes`] = 1;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(400).json({ msg: "Poll not found" });
    }

    if (!poll.isActive) {
      return res.status(400).json({ msg: "Poll is closed" });
    }

    // Encode email to handle special characters safely for MongoDB Map keys
    const encodedEmail = encodeEmail(userEmail);

    // Check if user already voted (read-only check)
    if (poll.votesBy && poll.votesBy.has(encodedEmail)) {
      return res.status(400).json({ msg: "You already voted" });
    }

    // Validate option index
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: "Invalid option" });
    }

    // Initialize votesBy if needed
    if (!poll.votesBy) {
      poll.votesBy = new Map();
    }

    // Add vote with encoded email
    poll.votesBy.set(encodedEmail, optionIndex);
    poll.options[optionIndex].votes += 1;

    // Save and return updated poll
    const updatedPoll = await poll.save();

    res.json(updatedPoll.toObject());
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});
router.put("/poll/close/:id", async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  res.json(poll);
});

// Maintenance
router.get("/maintenance/:monthKey", async (req, res) => {
  const data = await Maintenance.findOne({ monthKey: req.params.monthKey });
  if (!data) {
    return res.json({
      monthKey: req.params.monthKey,
      amount: 2500,
      records: {},
    });
  }
  res.json(data);
});

router.post("/maintenance", async (req, res) => {
  try {
    console.log("Maintenance update request:", req.body);
    const { monthKey, email, status, txnId } = req.body;

    let maint = await Maintenance.findOne({ monthKey });
    console.log("Found maintenance:", maint);

    if (!maint) {
      maint = new Maintenance({ monthKey, amount: 2500, records: {} });
      console.log("Created new maintenance:", maint);
    }

    // Ensure records is an object
    if (!maint.records) {
      maint.records = {};
    }

    // Update the record
    const safeEmail = email.replace(/\./g, ",");

    const currentRecord = maint.records[safeEmail] || {};

    console.log("Current record for", email, ":", currentRecord);

    maint.records[safeEmail] = {
      ...currentRecord,
      status,
      txnId,
      updatedAt: new Date(),
    };

    console.log("Updated records:", maint.records);

    try {
      maint.markModified("records");
      await maint.save();
      console.log("Saved maintenance successfully");
    } catch (saveErr) {
      console.error("Save error:", saveErr);
      throw saveErr;
    }

    res.json(maint);
  } catch (err) {
    console.error("Maintenance update error:", err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
