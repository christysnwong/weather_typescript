import { weatherCompProps, weatherData } from "../common/interface";
import { useState, useEffect } from "react";

import LoadingSkeleton from "../common/LoadingSkeleton";
import WeatherApi from "../api/api";
import "./WeatherSub.css";
import { convertTemp, units } from "../common/util";

const WeatherSub = ({
  id,
  lat,
  lon,
  unit,
  getWeatherIconUrl,
  setMainLocation,
  deleteLocation,
}: weatherCompProps) => {
  const [weatherDataResp, setWeatherDataResp] = useState<weatherData | null>(
    null
  );
  const [weatherIconUrl, setWeatherIconUrl] = useState<string>("");
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (lat && lon) {
      const getWeather = async () => {

        setInfoLoaded(false);

        const resp: weatherData = await WeatherApi.getWeatherData(lat, lon);
        const iconUrl: string = getWeatherIconUrl({
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


  return (
    <div className="WeatherSub">
      {!infoLoaded && <LoadingSkeleton />}
      {infoLoaded && weatherDataResp && (
        <div>
          
          <div className="weather-sub-city">
            {setMainLocation && <span title="set-main-location" className="weather-link" onClick={() => setMainLocation({ lat: lat, lon: lon })}>
                <i className="fa-solid fa-location-arrow"></i>
                {" "}{weatherDataResp.name}, {weatherDataResp.sys.country}
            </span>}
            {deleteLocation && <span title="delete-location" onClick={() => deleteLocation(id || 0)}>
              <i className="fa-solid fa-trash"></i>
            </span>}
            {/* <pre>{lat}, {lon}</pre> */}
          </div>
          <div className="weather-sub-info">
            <span>
              {convertTemp(unit, weatherDataResp.main.temp)}
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
