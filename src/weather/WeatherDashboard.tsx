import { useState, useEffect } from "react";
import WeatherMain from "./WeatherMain";
import WeatherSub from "./WeatherSub";
import NewLocationForm from "../forms/NewLocationForm";
import "./WeatherDashboard.css";

import useLocalStorage from "../common/useLocalStorage";
import {
  coord,
  weatherIconBgData
} from "../common/interface";


const WeatherDashboard = () => {

  const [tempUnit, setTempUnit] = useLocalStorage<string>("weather-tempUnit");
  const [list, setList] = useLocalStorage<coord[]>("weather-userList");
  const [mainLocation, setMainLocation] = useState<coord>({ lat: 0, lon: 0 });

  // save user's current home location to user list
  const saveHomeLocationToUserList = ({ lat, lon }: coord) => {
    setList(list => (list ? [{ lat, lon }, ...list.slice(1)] : [{ lat, lon }]));
  };

  // Save user's bookmarked location to user list
  const saveNewLocationToUserList = ({ lat, lon }: coord) => {
    setList(list => [...list, { lat, lon }]);
  };

  // Select units - metric or imperial
  const changeTempUnit = (unit: string): void => {
    setTempUnit(unit === "imperial" ? "imperial" : "metric");
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
      2: `weather-bg/200.jpg`,
      3: `weather-bg/300.jpg`,
      5: `weather-bg/500.jpg`,
      6: `weather-bg/600.jpg`,
      7: `weather-bg/700.jpg`,
      800: `weather-bg/800${dayOrNight}.jpg`,
      801: `weather-bg/801.jpg`,
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
    } else if (list && list.length > 0 && !mainLocation.lat && navigator.geolocation) {
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
          °C
        </span>{" "}
        |
        <span
          className={tempUnit === "imperial" ? "curr-unit" : "weather-link"}
          onClick={() => changeTempUnit("imperial")}
        >
          {" "}
          °F
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
            <span> (max 5)</span>
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
                    getWeatherIconUrl={getWeatherIconUrl}
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
