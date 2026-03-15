const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/mini_crm")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
  notes: String
});

const Lead = mongoose.model("Lead", LeadSchema);

// GET all leads
app.get("/leads", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// ADD lead
app.post("/leads", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

// DELETE lead
app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead deleted" });
});

// UPDATE lead
app.put("/leads/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' } // <-- updated to fix deprecation warning
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: "Failed to update lead" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});