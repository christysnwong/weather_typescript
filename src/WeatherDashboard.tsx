import { useState, useEffect } from "react";
import WeatherMain from "./WeatherMain";
import WeatherSub from "./WeatherSub";
import NewLocationForm from "./NewLocationForm";
import "./WeatherDashboard.css";

import useLocalStorage from "./common/useLocalStorage";
import {
  coord,
  weatherData,
  weatherData2,
  weatherIconBgData,
  convertProps,
} from "./interface";
import { openWeatherApiKey } from "./apikeys";

const WeatherDashboard = () => {

  const [tempUnit, setTempUnit] = useLocalStorage<string>("weather-tempUnit");
  const [list, setList] = useLocalStorage<coord[]>("weather-userList");

  const [mainLocation, setMainLocation] = useState<coord>({ lat: 0, lon: 0 });

  // API

  const fccApi = `https://fcc-weather-api.glitch.me/api`;
  const openWeatherApi = `https://api.openweathermap.org/data/3.0`;

  // save user's current home location to user list
  const saveHomeLocationToUserList = ({ lat, lon }: coord) => {
    if (!list) {
      setList([{ lat, lon }]);
    } else if (list.length > 1) {
      setList([{ lat, lon }, ...list.slice(1)]);
    }
  };

  // Save user's bookmarked location to user list
  const saveNewLocationToUserList = ({ lat, lon }: coord) => {
    setList([...list, { lat, lon }]);
  };

  // Select units - metric or imperial
  const changeTempUnit = (unit: string): void => {
    if (unit === "imperial") {
      setTempUnit("imperial");
    } else {
      setTempUnit("metric");
    }
  };

  // Convert measurements to metric or imperial for temperature, pressure, visibility, wind speed and degree
  const convertUnits = ({
    unit,
    temp,
    pressure,
    vis,
    windSpeed,
    windDeg,
  }: convertProps): number | string => {
    if (temp && unit === "imperial") {
      return Math.round((temp * 9) / 5) + 32;
    } else if (temp && unit === "metric") {
      return Math.round(temp);
    }

    if (pressure && unit === "imperial") {
      return Math.round(pressure * 0.03);
    } else if (pressure && unit === "metric") {
      return pressure;
    }

    if (vis && unit === "imperial") {
      return Math.round((vis / 1000) * 0.621371);
    } else if (vis && unit === "metric") {
      return Math.round(vis / 1000);
    }

    if (windSpeed && unit === "imperial") {
      return Math.round(windSpeed * 0.621371);
    } else if (windSpeed && unit === "metric") {
      return Math.round(windSpeed);
    }

    if (windDeg) {
      if (windDeg === 0) {
        return "N";
      } else if (windDeg > 0 && windDeg < 45) {
        return "NNE";
      } else if (windDeg === 45) {
        return "NE";
      } else if (windDeg > 45 && windDeg < 90) {
        return "ENE";
      } else if (windDeg === 90) {
        return "E";
      } else if (windDeg > 90 && windDeg < 135) {
        return "ESE";
      } else if (windDeg === 135) {
        return "SE";
      } else if (windDeg > 135 && windDeg < 180) {
        return "SSE";
      } else if (windDeg === 180) {
        return "S";
      } else if (windDeg > 180 && windDeg < 225) {
        return "SSW";
      } else if (windDeg === 225) {
        return "SW";
      } else if (windDeg > 225 && windDeg < 270) {
        return "WSW";
      } else if (windDeg === 270) {
        return "W";
      } else if (windDeg > 270 && windDeg < 315) {
        return "WNW";
      } else if (windDeg === 315) {
        return "NW";
      } else if (windDeg > 315 && windDeg < 360) {
        return "NNW";
      }
    }

    return 0;
  };

  // Make an API call to FreeCodeCamp and fetch basic weather data
  const getWeatherData = async (
    lat: number,
    lon: number
  ): Promise<weatherData> => {

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
  };

  // Make an API call to OpenWeatherMap and fetch weather forecasts for the next 7 days
  const getWeatherData2 = async (
    lat: number,
    lon: number
  ): Promise<weatherData2> => {
    console.log("===> Fetch more weather data... <====");
    console.log("lookUP =====>", lat, lon);

    let resp: weatherData2 = await (
      await fetch(
        `${openWeatherApi}/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${openWeatherApiKey}`
      )
    ).json();

    // console.log("RETURN RESP2 ==>", resp);
    return resp;
  };

  // Get weather icon based on the weather condition from API response 
  const getWeatherIconUrl = ({
    weatherId,
    currTime,
    sunrise,
    sunset,
    animated,
  }: weatherIconBgData): string => {
    const category: number =
      weatherId < 800 ? Math.floor(weatherId / 100) : weatherId;
    const dayOrNight: string =
      currTime >= sunrise && currTime < sunset ? "d" : "n";
    const svgCondition = animated === true ? "animated" : "static";

    const weatherIconMapUrl: { [key: number]: string } = {
      2: `weather-icons2/${svgCondition}/200${dayOrNight}.svg`,
      3: `weather-icons2/${svgCondition}/300${dayOrNight}.svg`,
      5: `weather-icons2/${svgCondition}/500${dayOrNight}.svg`,
      6: `weather-icons2/${svgCondition}/600${dayOrNight}.svg`,
      7: `weather-icons2/${svgCondition}/700${dayOrNight}.png`,
      800: `weather-icons2/${svgCondition}/800${dayOrNight}.svg`,
      801: `weather-icons2/${svgCondition}/801${dayOrNight}.svg`,
      802: `weather-icons2/${svgCondition}/802${dayOrNight}.svg`,
      803: `weather-icons2/${svgCondition}/803${dayOrNight}.svg`,
      804: `weather-icons2/${svgCondition}/804${dayOrNight}.svg`,
    };

    return weatherIconMapUrl[category];
  };

  // Get weather background based on the weather condition from API response 
  const getWeatherBg = ({
    weatherId,
    currTime,
    sunrise,
    sunset,
  }: weatherIconBgData): string => {
    const category: number =
      weatherId < 800
        ? Math.floor(weatherId / 100)
        : weatherId > 801
        ? 801
        : weatherId;
    
    const dayOrNight: string =
      currTime >= sunrise && currTime < sunset ? "d" : "n";

    const weatherBgMap: { [key: number]: string } = {
      2: `200.jpg`,
      3: `200.jpg`,
      5: `500.jpg`,
      6: `600.jpg`,
      7: `700.jpg`,
      800: `800${dayOrNight}.jpg`,
      801: `801.jpg`,
    };

    return weatherBgMap[category];
  };

  // Delete location from user list
  const deleteLocation = (id: number) => {
    setList((list) => [...list.filter((location, idx) => idx !== id)]);
  };

  useEffect(() => {

    if (!list && !mainLocation.lat && navigator.geolocation) {
      // check if the user uses this app the first time, set default temp unit and home location
      console.log(
        "setting default unit to metric and home lat and lon with navigator geolocation"
      );

      setTempUnit("metric");

      navigator.geolocation.getCurrentPosition((position) => {
        saveHomeLocationToUserList({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setMainLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else if (list && !mainLocation.lat && navigator.geolocation) {
      // check existing user's home location against current geolocation - if different, update home location

      navigator.geolocation.getCurrentPosition((position) => {
        setMainLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        if (
          list[0].lat !== position.coords.latitude ||
          list[0].lon !== position.coords.longitude
        ) {
          // console.log("Home location is being updated");
          saveHomeLocationToUserList({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        }
      });
    } else if (!navigator.geolocation) {
      // Check if user's browser support navigator gelocation
      console.log(
        "Geolocation is not supported by this browser."
      );
    }
  }, [list, tempUnit]);

  return (
    <div className="WeatherDashboard container-page">
      <h1 className="title-weather-app">Weather Dashb<i className="fa-solid fa-cloud-sun"></i>ard</h1>

      <span>
        <span
          className={tempUnit === "metric" ? "curr-unit" : "weather-link"}
          onClick={() => changeTempUnit("metric")}
        >
          {String.fromCharCode(176)}C
        </span>{" "}
        |
        <span
          className={tempUnit === "imperial" ? "curr-unit" : "weather-link"}
          onClick={() => changeTempUnit("imperial")}
        >
          {" "}
          {String.fromCharCode(176)}F
        </span>
      </span>

      {list && list.length < 6 && (
        <NewLocationForm saveNewLocation={saveNewLocationToUserList} />
      )}

      <div className="container-weather">
        <div className="container-main">
          <h2 className="title">Current Weather</h2>
          {mainLocation.lat && (
            <WeatherMain
              id={0}
              lat={mainLocation.lat}
              lon={mainLocation.lon}
              unit={tempUnit === "metric" ? "metric" : "imperial"}
              convertUnits={convertUnits}
              getWeatherData={getWeatherData}
              getWeatherData2={getWeatherData2}
              getWeatherIconUrl={getWeatherIconUrl}
              getWeatherBg={getWeatherBg}
              setMainLocation={setMainLocation}
              deleteLocation={deleteLocation}
            />
          )}
        </div>

        <div className="container-sub">
          <h2 className="title">
            Bookmarks
            <span> (max 4)</span>
          </h2>
          <div className="divider"></div>
          <div
            className="weather-link"
            onClick={() =>
              setMainLocation({ lat: list[0].lat, lon: list[0].lon })
            }
          >
            <i className="fa-solid fa-house-chimney"></i> Current City
          </div>

          {list &&
            list.length > 1 &&
            list.map((location: coord, idx: number) => {
              if (idx === 0) {
                return "";
              }

              return (
                <div key={idx}>
                  <div className="divider"></div>
                  <WeatherSub
                    id={idx}
                    lat={location.lat}
                    lon={location.lon}
                    unit={tempUnit}
                    convertUnits={convertUnits}
                    getWeatherData={getWeatherData}
                    getWeatherData2={getWeatherData2}
                    getWeatherIconUrl={getWeatherIconUrl}
                    getWeatherBg={getWeatherBg}
                    setMainLocation={setMainLocation}
                    deleteLocation={deleteLocation}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
