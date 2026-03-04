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
    poll,
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

router.put("/poll/vote", async (req, res) => {
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
  res.json(
    data || { monthKey: req.params.monthKey, amount: 2500, records: {} },
  );
});

router.post("/maintenance", async (req, res) => {
  const { monthKey, email, status, txnId } = req.body;
  let maint = await Maintenance.findOne({ monthKey });

  if (!maint) {
    maint = new Maintenance({ monthKey, amount: 2500, records: {} });
  }

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

module.exports = router;
