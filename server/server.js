const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connect } = require("./utils/db");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

connect();

app.use("/api", authRoutes);
app.use("/api", dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
