const vehicleConfig = {
  car: {
    fuels: ["petrol", "diesel"],
    models: {
      hatchback: 0.18,
      sedan: 0.20,
      suv: 0.25
    }
  },

  bike: {
    fuels: ["petrol"],
    models: {
      standard: 0.10,
      sports: 0.14
    }
  },

  bus: {
    fuels: ["diesel", "electric"],
    models: {
      mini: 0.08,
      standard: 0.10,
      electric: 0.04
    }
  },

  truck: {
    fuels: ["diesel"],
    models: {
      light: 0.25,
      medium: 0.35,
      heavy: 0.50
    }
  },

  auto: {
    fuels: ["petrol", "cng", "electric"],
    models: {
      standard: 0.09,
      electric: 0.03
    }
  }
};

module.exports = vehicleConfig;