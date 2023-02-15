import { weatherCompProps, weatherData, weatherForecastData } from "../common/interface";
import { useState, useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import LoadingSkeleton2 from "../common/LoadingSkeleton2";
import WeatherApi from "../api/api";
import { DateTime } from "luxon";


import "./WeatherMain.css";
import { convertPressure, convertTemp, convertVis, convertWindDeg, convertWindSpeed, units } from "../common/util";

const WeatherMain = ({
  lat,
  lon,
  unit,
  getWeatherIconUrl,
  getWeatherBg
}: weatherCompProps) => {
  const [weatherDataResp, setWeatherDataResp] = useState<weatherData | null>(
    null
  );
  const [weatherForecastDataResp, setWeatherForecastDataResp] = useState<weatherForecastData | null>(
    null
  );
  const [weatherIconUrl, setWeatherIconUrl] = useState<string>("");
  const [weatherBg, setWeatherBg] = useState<string>("");
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [infoLoaded2, setInfoLoaded2] = useState<boolean>(false);
  const [showWeatherForecast, setShowWeatherForecast] = useState<boolean>(false);


  // Fetch weather forecasts for the next 7 days
  const getWeatherForecast = async () => {
    setShowWeatherForecast(!showWeatherForecast);

    if (!weatherForecastDataResp) {
      try {
        const resp: weatherForecastData = await WeatherApi.getWeatherForecastData(lat, lon);

        setWeatherForecastDataResp(resp);
        setInfoLoaded2(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (lat && lon && getWeatherBg) {
      // Fetch basic weather data, weather icon and background for current weather
      const getWeather = async () => {
        setInfoLoaded(false);
        setInfoLoaded2(false);
        setShowWeatherForecast(false);
        setWeatherForecastDataResp(null);

        try {
          const resp: weatherData = await WeatherApi.getWeatherData(lat, lon);
          const iconUrl: string = getWeatherIconUrl({
            weatherId: resp.weather[0].id,
            currTime: resp.dt,
            sunrise: resp.sys.sunrise,
            sunset: resp.sys.sunset,
            animated: true,
          });
          const bg: string = getWeatherBg({
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

  // if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="WeatherMain">
      {!infoLoaded && <LoadingSpinner />}
      {infoLoaded && weatherDataResp && (
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
                  .toFormat("ccc, LLLL dd, h:mm a")}
              </span>
              <div className="info-container">
                <span className="curr-temp">
                  {convertTemp(unit, weatherDataResp.main.temp)}
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
              {convertTemp(unit, weatherDataResp.main.temp_min)}
              {units(unit, "temp")}
            </span>
            <span className="bold">High Temp: </span>
            <span>
              {convertTemp(unit, weatherDataResp.main.temp_max)}
              {units(unit, "temp")}
            </span>
            <span className="bold">Pressure: </span>
            <span>
              {convertPressure(unit, weatherDataResp.main.pressure)}{" "}
              {units(unit, "pressure")}
            </span>
            <span className="bold">Humidity: </span>
            <span>{weatherDataResp.main.humidity}%</span>
            <span className="bold">Visibility: </span>
            <span>
              {convertVis(unit, weatherDataResp.visibility)}{" "}
              {units(unit, "vis")}
            </span>
            <span className="bold">Wind Speed: </span>
            <span>
              {convertWindSpeed(unit, weatherDataResp.wind.speed)}{" "}
              {units(unit, "windSpeed")}{" "}
              {convertWindDeg(unit, weatherDataResp.wind.deg)}
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
            <button className="btn" onClick={() => getWeatherForecast()}>
              <i
                className={
                  showWeatherForecast
                    ? "fa-solid fa-angles-up"
                    : "fa-solid fa-angles-down"
                }
              ></i>{" "}
              7 Days Forecast
            </button>
          </div>

          {showWeatherForecast && !infoLoaded2 && <LoadingSkeleton2 />}

          {showWeatherForecast && weatherForecastDataResp && (
            <div className="weather-details-more">
              {weatherForecastDataResp.daily.map((dayWeather, idx) => {
                return (
                  <div className="weather-info2" key={idx}>
                    <p className="bold">
                      {weatherDataResp && idx !== 0
                        ? DateTime.utc()
                            .plus({
                              hours: weatherDataResp.timezone / 60 / 60,
                              days: idx,
                            })
                            .toFormat("ccc, LLL dd")
                        : "Today"}
                    </p>

                    <span className="color3">
                      Low:{" "}
                      <span className="bold">
                        {convertTemp(unit, dayWeather.temp.min)}
                        {units(unit, "temp")}
                      </span>
                    </span>
                    <span className="color3">
                      High:{" "}
                      <span className="bold">
                        {convertTemp(unit, dayWeather.temp.max)}
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
                        alt="weather-icon-sub"
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
