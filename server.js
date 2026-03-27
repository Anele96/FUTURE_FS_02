const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mini_crm")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// schema
const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
  notes: String
});

const Lead = mongoose.model("Lead", LeadSchema);

// ===== CRUD =====

// READ
app.get("/leads", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// CREATE
app.post("/leads", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

// UPDATE
app.put("/leads/:id", async (req, res) => {
  const updated = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// start
app.listen(5000, () => {
  console.log("Running on http://localhost:5000");
});