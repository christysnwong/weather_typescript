import { weatherCompProps, weatherData, weatherData2 } from "./interface";
import { useState, useEffect } from "react";
import LoadingSpinner from "./common/LoadingSpinner";
import LoadingSkeleton2 from "./common/LoadingSkeleton2";
import { DateTime } from "luxon";

import "./WeatherMain.css";

const WeatherMain = ({
  id,
  lat,
  lon,
  unit,
  convertUnits,
  getWeatherData,
  getWeatherData2,
  getWeatherIconUrl,
  getWeatherBg,
  setMainLocation,
  deleteLocation,
}: weatherCompProps) => {
  let [weatherDataResp, setWeatherDataResp] = useState<weatherData | null>(
    null
  );
  let [weatherDataResp2, setWeatherDataResp2] = useState<weatherData2 | null>(
    null
  );
  let [weatherIconUrl, setWeatherIconUrl] = useState<string>("");
  let [weatherBg, setWeatherBg] = useState<string>("");
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [infoLoaded2, setInfoLoaded2] = useState<boolean>(false);
  const [show7DayDetails, setShow7DayDetails] = useState<boolean>(false);

  // get metric or imperial units for measurements
  const units = (unit: string, category: string) => {
    let metric: { [key: string]: string } = {
      temp: `${String.fromCharCode(176)}C`,
      pressure: `mbar`,
      vis: `km`,
      windSpeed: `m/s`,
      windDeg: `${String.fromCharCode(176)}`,
    };

    let imperial: { [key: string]: string } = {
      temp: `${String.fromCharCode(176)}F`,
      pressure: `inches`,
      vis: `miles`,
      windSpeed: `mph`,
      windDeg: `${String.fromCharCode(176)}`,
    };

    if (unit === "metric") {
      return metric[category];
    }

    if (unit === "imperial") {
      return imperial[category];
    }
  };

  // Fetch weather forecasts for the next 7 days
  const getWeather2 = async () => {
    setShow7DayDetails(!show7DayDetails);

    if (!weatherDataResp2) {
      try {
        let resp: weatherData2 = await getWeatherData2(lat, lon);

        setWeatherDataResp2(resp);
        setInfoLoaded2(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (lat && lon) {
      // Fetch basic weather data, weather icon and background for current weather
      const getWeather = async () => {
        setInfoLoaded(false);
        setInfoLoaded2(false);
        setShow7DayDetails(false);
        setWeatherDataResp2(null);

        try {
          let resp: weatherData = await getWeatherData(lat, lon);
          let iconUrl: string = getWeatherIconUrl({
            weatherId: resp.weather[0].id,
            currTime: resp.dt,
            sunrise: resp.sys.sunrise,
            sunset: resp.sys.sunset,
            animated: true,
          });
          let bg: string = getWeatherBg({
            weatherId: resp.weather[0].id,
            currTime: resp.dt,
            sunrise: resp.sys.sunrise,
            sunset: resp.sys.sunset,
          });

          setWeatherDataResp(resp);
          setWeatherIconUrl(iconUrl);
          setWeatherBg(bg);

          setInfoLoaded(true);

        } catch (e) {
          console.error(e);
        }
      };

      getWeather();
    }

  }, [lat, lon]);

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="WeatherMain">
      {weatherDataResp && (
        <>
          <div
            className="weather-main-info"
            style={{ backgroundImage: "url(" + weatherBg + ")" }}
          >
            <div className="mask-bg">
              <h4 className="curr-city">
                {weatherDataResp.name}, {weatherDataResp.sys.country}
              </h4>
              {/* <pre>{lat}, {lon}</pre> */}
              <span>
                {DateTime.utc()
                  .plus({ hours: weatherDataResp.timezone / 60 / 60 })
                  .toFormat("LLLL dd, h:mm a")}
              </span>
              <div className="info-container">
                <span className="curr-temp">
                  {convertUnits({
                    unit: unit,
                    temp: weatherDataResp.main.temp,
                  })}
                  {units(unit, "temp")}
                </span>

                <div className="weather-info">
                  <img
                    className="imgMain"
                    src={weatherIconUrl}
                    alt="weather-icon"
                  />
                  <span>{weatherDataResp.weather[0].description}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="weather-details">
            <span className="bold">Low Temp: </span>
            <span>
              {convertUnits({
                unit: unit,
                temp: weatherDataResp.main.temp_min,
              })}
              {units(unit, "temp")}
            </span>
            <span className="bold">High Temp: </span>
            <span>
              {convertUnits({
                unit: unit,
                temp: weatherDataResp.main.temp_max,
              })}
              {units(unit, "temp")}
            </span>
            <span className="bold">Pressure: </span>
            <span>
              {convertUnits({
                unit: unit,
                pressure: weatherDataResp.main.pressure,
              })}{" "}
              {units(unit, "pressure")}
            </span>
            <span className="bold">Humidity: </span>
            <span>{weatherDataResp.main.humidity}%</span>
            <span className="bold">Visibility: </span>
            <span>
              {convertUnits({ unit: unit, vis: weatherDataResp.visibility })}{" "}
              {units(unit, "vis")}
            </span>
            <span className="bold">Wind Speed: </span>
            <span>
              {convertUnits({
                unit: unit,
                windSpeed: weatherDataResp.wind.speed,
              })}{" "}
              {units(unit, "windSpeed")}{" "}
              {convertUnits({
                unit: unit,
                windDeg: weatherDataResp.wind.deg,
              })}
            </span>
            <span className="bold">Sunrise: </span>
            <span>
              {DateTime.fromSeconds(weatherDataResp.sys.sunrise, {
                zone: "utc",
              })
                .plus({ hours: weatherDataResp.timezone / 60 / 60 })
                .toFormat("h:mm a")}
            </span>
            <span className="bold">Sunset: </span>
            <span>
              {DateTime.fromSeconds(weatherDataResp.sys.sunset, {
                zone: "utc",
              })
                .plus({ hours: weatherDataResp.timezone / 60 / 60 })
                .toFormat("h:mm a")}
            </span>
          </div>

          <div>
            <button className="btn" onClick={() => getWeather2()}>
              <i
                className={
                  show7DayDetails
                    ? "fa-solid fa-angles-up"
                    : "fa-solid fa-angles-down"
                }
              ></i>{" "}
              7 Days Forecast
            </button>
          </div>

          {show7DayDetails && !infoLoaded2 && <LoadingSkeleton2 />}

          {show7DayDetails && weatherDataResp2 && (
            <div className="weather-details-more">
              {weatherDataResp2.daily.map((dayWeather, idx) => {
                return (
                  <div className="weather-info2" key={idx}>
                    <p className="bold">
                      {weatherDataResp && idx !== 0
                        ? DateTime.utc()
                            .plus({
                              hours: weatherDataResp.timezone / 60 / 60,
                              days: idx,
                            })
                            .toFormat("LLL dd")
                        : "Today"}
                    </p>

                    <span className="color3">
                      Low:{" "}
                      <span className="bold">
                        {convertUnits({
                          unit: unit,
                          temp: dayWeather.temp.min,
                        })}
                        {units(unit, "temp")}
                      </span>
                    </span>
                    <span className="color3">
                      High:{" "}
                      <span className="bold">
                        {convertUnits({
                          unit: unit,
                          temp: dayWeather.temp.max,
                        })}
                        {units(unit, "temp")}
                      </span>
                    </span>
                    <span>
                      <img
                        className="imgSub"
                        src={getWeatherIconUrl({
                          weatherId: dayWeather.weather[0].id,
                          currTime: dayWeather.dt,
                          sunrise: dayWeather.sunrise,
                          sunset: dayWeather.sunset,
                          animated: false,
                        })}
                        alt="weather-icon"
                      />
                    </span>
                    <span className="color3 bold">
                      {dayWeather.weather[0].description}
                    </span>
                    <span>
                      {dayWeather.pop && dayWeather.pop > 0.1
                        ? Math.round(dayWeather.pop * 100) + "%"
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherMain;
