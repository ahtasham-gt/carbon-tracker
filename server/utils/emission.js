const vehicleConfig = require("./vehicleConfig");

function calculateEmission(vehicle, fuel, distance, model, year) {
  vehicle = String(vehicle || "").trim().toLowerCase();
  fuel = String(fuel || "").trim().toLowerCase();
  model = String(model || "").trim().toLowerCase();

  const config = vehicleConfig[vehicle];
  if (!config) return null;

  if (!config.fuels.includes(fuel)) return null;

  const factor = config.models[model];
  if (factor === undefined) return null;

  distance = Number(distance);
  year = Number(year);

  if (isNaN(distance) || distance <= 0) return null;

  let finalFactor = factor;

  // Age factor
  if (!isNaN(year) && year > 1900) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    finalFactor += age * 0.002;
  }

  return distance * finalFactor;
}

// EV comparison
function compareWithEV(distance) {
  const evFactor = 0.04; // EV emission factor
  distance = Number(distance);

  if (isNaN(distance)) return null;

  return distance * evFactor;
}

// Suggestion logic
function suggestAlternative(emission) {
  if (emission > 10) return "Consider public transport 🚌";
  if (emission > 5) return "Try carpooling 🚗";
  return "Good job! Low emission 🌱";
}

module.exports = {
  calculateEmission,
  compareWithEV,
  suggestAlternative
};