import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WeatherMain from "../WeatherMain";

import * as api from "../../api/api";
import { weatherDataResp, weatherForecastDataResp} from "./mockResp";

jest.mock("../../api/api", () => ({
  getWeatherData: jest.fn(),
  getWeatherForecastData: jest.fn(),
}));


describe("WeatherMain", () => {
  const getWeatherIconUrl = jest.fn(() => `weather-icons2/static/800n.svg`);

  const getWeatherBg = jest.fn(() => `800n.jpg`);

  const setMainLocation = jest.fn();
  const deleteLocation = jest.fn();

  beforeEach(() => {
    api.getWeatherData.mockResolvedValue(weatherDataResp);
    api.getWeatherForecastData.mockResolvedValue(weatherForecastDataResp);
  });

  it("ensures the page initially shows load spinner", () => {
     render(
      <WeatherMain />
    );

    expect(screen.getByTestId("LoadingSpinner")).toBeInTheDocument();

  });

  it("ensures the page is rendered properly after weather data is fetched from Api", async () => {
    render(
      <WeatherMain
        lat={37.77}
        lon={-122.42}
        unit="metric"
        getWeatherIconUrl={getWeatherIconUrl}
        getWeatherBg={getWeatherBg}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    expect(api.getWeatherData).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByAltText("weather-icon")).toBeInTheDocument();
      
    });

    expect(screen.getByText("San Francisco, US")).toBeInTheDocument();
    expect(screen.getByText(/8\s*°\s*C/)).toBeInTheDocument();
    expect(screen.getByText("Low Temp:")).toBeInTheDocument();
    expect(screen.getByText("High Temp:")).toBeInTheDocument();
    expect(screen.getByText("Sunrise:")).toBeInTheDocument();
    expect(screen.getByText("Sunset:")).toBeInTheDocument();
    expect(screen.getByText(/km/)).toBeInTheDocument();
    expect(screen.getByText("m/s", { exact: false })).toBeInTheDocument();
    
  });

  it("ensures the page is rendered properly if unit is set to imperial", async () => {
    render(
      <WeatherMain
        lat={37.77}
        lon={-122.42}
        unit="imperial"
        getWeatherIconUrl={getWeatherIconUrl}
        getWeatherBg={getWeatherBg}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    expect(api.getWeatherData).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByAltText("weather-icon")).toBeInTheDocument();
    });

    expect(screen.getByText(/46\s*°\s*F/)).toBeInTheDocument();
    expect(screen.getByText("miles", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("mph", { exact: false })).toBeInTheDocument();
  });

  it("ensures weatherforecast data is being fetched after clicking the button '7 DaysForecast'", async () => {
    render(
      <WeatherMain
        lat={37.77}
        lon={-122.42}
        unit="metric"
        getWeatherIconUrl={getWeatherIconUrl}
        getWeatherBg={getWeatherBg}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("7 Days Forecast")).toBeInTheDocument();
    });

    const forecastBtn = screen.getByText("7 Days Forecast");
    fireEvent.click(forecastBtn);
    
    expect(api.getWeatherForecastData).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

  });



})