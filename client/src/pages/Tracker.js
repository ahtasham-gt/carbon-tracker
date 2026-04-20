import { useState, useEffect } from "react";
import axios from "axios";

const vehicleOptions = {
  car: ["hatchback", "sedan", "suv"],
  bike: ["standard", "sports"],
  bus: ["mini", "standard", "electric"],
  truck: ["light", "medium", "heavy"],
  auto: ["standard", "electric"]
};

const fuelOptions = {
  car: ["petrol", "diesel"],
  bike: ["petrol"],
  bus: ["diesel", "electric"],
  truck: ["diesel"],
  auto: ["petrol", "cng", "electric"]
};

function Tracker() {
  const [form, setForm] = useState({
    vehicle: "car",
    model: "hatchback",
    fuel: "petrol",
    distance: "",
    year: ""
  });

  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        distance: Number(form.distance),
        year: Number(form.year)
      };

      const res = await axios.post(process.env.REACT_APP_API_URL + "/api/calculate", payload);

      setResult(res.data.trip);
      setComparison(res.data.comparison);
      setSuggestion(res.data.suggestion);

      fetchHistory();

    } catch (err) {
      alert(err.response?.data?.error || "Error occurred");
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get(process.env.REACT_APP_API_URL + "/api/history");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1>📊 Carbon Calculator</h1>

      <form onSubmit={handleSubmit}>

        {/* Vehicle */}
        <select
          value={form.vehicle}
          onChange={(e) => {
            const v = e.target.value;
            setForm({
              ...form,
              vehicle: v,
              model: vehicleOptions[v][0],
              fuel: fuelOptions[v][0]
            });
          }}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="bus">Bus</option>
          <option value="truck">Truck</option>
          <option value="auto">Auto</option>
        </select>

        {/* Model */}
        <select
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        >
          {vehicleOptions[form.vehicle].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Year */}
        <input
          type="number"
          placeholder="Purchase Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        {/* Fuel */}
        <select
          value={form.fuel}
          onChange={(e) => setForm({ ...form, fuel: e.target.value })}
        >
          {fuelOptions[form.vehicle].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Distance */}
        <input
          type="number"
          placeholder="Distance (km)"
          value={form.distance}
          onChange={(e) => setForm({ ...form, distance: e.target.value })}
        />

        <button type="submit">Calculate</button>
      </form>

      {/* Result */}
      {result && (
        <div className="result">
          🌱 Emission: {result.emission.toFixed(2)} kg CO₂
        </div>
      )}

      {/* Comparison */}
      {comparison && (
        <div className="result">
          ⚡ EV Emission: {comparison.ev.toFixed(2)} kg CO₂ <br />
          🌍 You Save: {comparison.saved.toFixed(2)} kg CO₂
        </div>
      )}

      {/* Suggestion */}
      {suggestion && (
        <div className="result">
          💡 Suggestion: {suggestion}
        </div>
      )}

      <h3>History</h3>
      {history.map((item) => (
        <div key={item._id} className="history-item">
          {item.vehicle} | {item.model} | {item.fuel} | {item.year} | {item.distance} km → {item.emission.toFixed(2)} kg
        </div>
      ))}
    </div>
  );
}

export default Tracker;