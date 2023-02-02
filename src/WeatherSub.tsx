import { weatherCompProps, weatherData } from "./interface";
import { useState, useEffect } from "react";

import LoadingSkeleton from "./common/LoadingSkeleton";
import "./WeatherSub.css";

const WeatherSub = ({
  id,
  lat,
  lon,
  unit,
  convertUnits,
  getWeatherData,
  getWeatherData2,
  getWeatherIconUrl,
  setMainLocation,
  deleteLocation,
}: weatherCompProps) => {
  let [weatherDataResp, setWeatherDataResp] = useState<weatherData | null>(
    null
  );
  let [weatherIconUrl, setWeatherIconUrl] = useState<string>("");
  const [infoLoaded, setInfoLoaded] = useState<boolean>(true);

  // get metric or imperial units for temperature
  const units = (unit: string, category: string) => {
    let metric: { [key: string]: string } = {
      temp: `${String.fromCharCode(176)}C`,
    };

    let imperial: { [key: string]: string } = {
      temp: `${String.fromCharCode(176)}F`,
    };

    if (unit === "metric") {
      return metric[category];
    }

    if (unit === "imperial") {
      return imperial[category];
    }
  };

  useEffect(() => {
    if (lat && lon) {
      const getWeather = async () => {

        setInfoLoaded(false);

        let resp: weatherData = await getWeatherData(lat, lon);
        let iconUrl: string = getWeatherIconUrl({
          weatherId: resp.weather[0].id,
          currTime: resp.dt,
          sunrise: resp.sys.sunrise,
          sunset: resp.sys.sunset,
          animated: true
        });

        setWeatherDataResp(resp);
        setWeatherIconUrl(iconUrl);

        setInfoLoaded(true);
      };

      getWeather();
    }
  }, [lat, lon]);

  if (!infoLoaded) return <LoadingSkeleton />

  return (
    <div className="WeatherSub">
      {weatherDataResp && (
        <div>
          
          <div className="weather-sub-city">
            <span className="weather-link" onClick={() => setMainLocation({ lat: lat, lon: lon })}>
                <i className="fa-solid fa-location-arrow"></i>
                {" "}{weatherDataResp.name}, {weatherDataResp.sys.country}
            </span>
            <span onClick={() => deleteLocation(id)}>
              <i className="fa-solid fa-trash"></i>
            </span>
            {/* <pre>{lat}, {lon}</pre> */}
          </div>
          <div className="weather-sub-info">
            <span>
              {convertUnits({ unit: unit, temp: weatherDataResp.main.temp })}
              {units(unit, "temp")}
            </span>
            <img className="imgSub" src={weatherIconUrl} alt="weather-icon" />
            <span>
              {weatherDataResp.weather[0].description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherSub;
