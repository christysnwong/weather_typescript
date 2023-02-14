import {
  weatherData,
  weatherForecastData,
  locationData,
} from "../common/interface";
// import { googleApiKey, openWeatherApiKey } from "./apikeys";

const fccApi = `https://fcc-weather-api.glitch.me/api`;
const openWeatherApi = `https://api.openweathermap.org/data/3.0`;
const openWeatherApiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const googleApi = `https://maps.googleapis.com/maps/api/geocode`;
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

// Make an API call to fetch lat/lon and weather data
class WeatherApi {

  static async getLatLon(newLocationName: string): Promise<locationData> {
    const resp: locationData = await (
      await fetch(
        `${googleApi}/json?address=${newLocationName}&key=${googleApiKey}`
      )
    ).json();

    return resp;
  }

  static async getWeatherData(lat: number, lon: number): Promise<weatherData> {
    let resp: weatherData = await (
      await fetch(`${fccApi}/current?lat=${lat}&lon=${lon}`)
    ).json();

    // Verify weather data from FreeCodeCamp's API by checking requested latitude against responded latitude
    const checkWeatherData = (reqLat: string, respLat: string): boolean => {
      if (reqLat !== respLat) {
        return false;
      } else {
        return true;
      }
    };

    // wait function
    const wait = (millisec: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, millisec);
      });
    };

    while (!checkWeatherData(lat.toFixed(0), resp.coord.lat.toFixed(0))) {
      // console.log("======== CHECKING =========");
      // console.log("REQ lat", lat.toFixed(0));
      // console.log("RESP lat", resp.coord.lat.toFixed(0));
      // console.log("reload after 1500ms...");
      // console.log("==========================");

      await wait(1500);

      resp = await (
        await fetch(`${fccApi}/current?lat=${lat}&lon=${lon}`)
      ).json();
    }

    // console.log("RETURN RESP ==>", resp);
    return resp;
  }

  static async getWeatherForecastData(
    lat: number,
    lon: number
  ): Promise<weatherForecastData> {
    console.log("===> Fetch more weather data... <====");
    console.log("lookUP =====>", lat, lon);

    const resp: weatherForecastData = await (
      await fetch(
        `${openWeatherApi}/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${openWeatherApiKey}`
      )
    ).json();

    // console.log("RETURN RESP2 ==>", resp);
    return resp;
  }
}

export default WeatherApi;
