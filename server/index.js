const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
//=============================
const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP Requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });
  next();
});


app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
//=============================


const Trip = require("./models/Trip");
const {
  calculateEmission,
  compareWithEV,
  suggestAlternative
} = require("./utils/emission");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Calculate
app.post("/api/calculate", async (req, res) => {
  try {
    const { vehicle, fuel, distance, model, year } = req.body;

    if (!vehicle || !fuel || !distance || !model) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const emission = calculateEmission(vehicle, fuel, distance, model, year);

    if (!emission) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const evEmission = compareWithEV(distance);
    const suggestion = suggestAlternative(emission);

    const trip = await Trip.create({
      vehicle,
      fuel,
      distance,
      model,
      year,
      emission
    });

    res.json({
      trip,
      comparison: {
        current: emission,
        ev: evEmission,
        saved: emission - evEmission
      },
      suggestion
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// History
app.get("/api/history", async (req, res) => {
  const trips = await Trip.find().sort({ createdAt: -1 });
  res.json(trips);
});

app.listen(5000, () => console.log("Server running on port 5000"));