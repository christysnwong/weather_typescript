

// Convert measurements to metric or imperial for temperature, pressure, visibility, wind speed and degree
export const convertTemp = (unit: string, temp: number) => Math.round(unit === "imperial" ? (temp * 9) / 5 + 32 : temp);

export const convertPressure = (unit: string, pressure: number) => Math.round(unit === "imperial" ? pressure * 0.03 : pressure);

export const convertVis = (unit: string, vis: number) => Math.round(unit === "imperial" ? (vis / 1000) * 0.621371 : vis / 1000);

export const convertWindSpeed = (unit: string, windSpeed: number) => Math.round(unit === "imperial" ? windSpeed * 0.621371 : windSpeed);

export const convertWindDeg = (unit: string, windDeg: number) => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  // angles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];

  windDeg = (windDeg + 11.25) % 360;
  const index = Math.floor(windDeg / 22.5);

  return directions[index];
};

// get metric or imperial units for measurements
export const units = (unit: string, category: string) => {
    const metric: { [key: string]: string } = {
      temp: `°C`,
      pressure: `mbar`,
      vis: `km`,
      windSpeed: `m/s`,
      windDeg: `°`,
    };

    const imperial: { [key: string]: string } = {
      temp: `°F`,
      pressure: `inches`,
      vis: `miles`,
      windSpeed: `mph`,
      windDeg: `°`,
    };

    return unit === "imperial" ? imperial[category] : metric[category];
};


// old

// export const convertTemp = (unit: string, temp: number) => {
//   if (unit === "imperial") {
//     return Math.round((temp * 9) / 5) + 32;
//   } else if (unit === "metric") {
//     return Math.round(temp);
//   }
// };

// export const convertPressure = (unit: string, pressure: number) => {
//   if (unit === "imperial") {
//     return Math.round(pressure * 0.03);
//   } else if (unit === "metric") {
//     return pressure;
//   }
// };

// export const convertVis = (unit: string, vis: number) => {
//   if (unit === "imperial") {
//     return Math.round((vis / 1000) * 0.621371);
//   } else if (unit === "metric") {
//     return Math.round(vis / 1000);
//   }
// };

// export const convertWindSpeed = (unit: string, windSpeed: number) => {
//   if (unit === "imperial") {
//     return Math.round(windSpeed * 0.621371);
//   } else if (unit === "metric") {
//     return Math.round(windSpeed);
//   }
// };