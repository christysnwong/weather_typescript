export interface weatherData {
  coord: coord;
  weather: weather[];
  main: main;
  visibility: number;
  wind: wind;
  sys: sys;
  dt: number;
  name: string;
  timezone: number;
}

export interface coord {
  lat: number;
  lon: number;
}

export interface weather {
  id: number;
  main: string;
  description: string;
}

export interface wind {
  speed: number;
  deg: number;
}

export interface main {
  temp: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface sys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface weatherForecastData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: current;
  daily: daily[];
}

export interface current {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  rain?: {"1h" : number};
  snow?: {"1h" : number};
  weather: weather[];
}

export interface daily {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: temp;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: weather[];
  pop?: number;
  rain?: number;
  snow?: number;
}

export interface temp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface weatherIconBgData {
  weatherId : number;
  currTime : number;
  sunrise : number;
  sunset : number;
  animated? : boolean;
}

export interface locationData {
  status: string;
  results: results[];
}

export interface results {
  formatted_address: string;
  geometry: {
    location: {lat: number; lng: number}
  }
}

// export interface convertUnitsProps {
//   unit: string;
//   [key: string] : number;
// }

export interface convertProps {
  unit: string;
  temp?: number;
  pressure?: number;
  vis?: number;
  windSpeed?: number;
  windDeg?: number;
}

export interface weatherCompProps {
  id?: number;
  lat: number;
  lon: number;
  unit: string;
  getWeatherIconUrl: (weatherIconData : weatherIconBgData) => string;
  getWeatherBg?: (weatherBg : weatherIconBgData) => string;
  setMainLocation?: (location: coord) => void;
  deleteLocation?: (id: number) => void;
}

export interface newLocationFormProps {
  saveNewLocation: (location : coord) => void;
}

export interface newLocationForm {
  newLocationName: string;
}

