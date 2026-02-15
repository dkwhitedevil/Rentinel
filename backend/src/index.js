const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./auth");
const applicationsRoutes = require("./applications");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/applications", applicationsRoutes);

app.get("/test", (req, res) => {
  res.send("Sentinel backend running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5001");
});
