import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WeatherSub from "../WeatherSub";

import * as api from "../../api/api";
import { weatherDataResp } from "./mockResp";

jest.mock("../../api/api", () => ({
  getWeatherData: jest.fn(),
}));


describe("WeatherSub", () => {
  const getWeatherIconUrl = jest.fn(() => `weather-icons2/static/800n.svg`);

  const setMainLocation = jest.fn();
  const deleteLocation = jest.fn();

  beforeEach(() => {
    api.getWeatherData.mockResolvedValue(weatherDataResp);
  });

  it("ensures the page initially shows loading skeleton", () => {
    render(<WeatherSub />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("ensures the page is rendered properly after weather data is fetched from Api", async () => {
    render(
      <WeatherSub
        id={1}
        lat={37.77}
        lon={-122.42}
        unit="metric"
        getWeatherIconUrl={getWeatherIconUrl}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    expect(api.getWeatherData).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByAltText("weather-icon")).toBeInTheDocument();
    });

    expect(screen.getByText("San Francisco, US")).toBeInTheDocument();
    expect(screen.getByText("clear sky")).toBeInTheDocument();
  });

  it("should call setMainLocation function on click of the location-arrow icon", async () => {
    render(
      <WeatherSub
        id={1}
        lat={37.77}
        lon={-122.42}
        unit="metric"
        getWeatherIconUrl={getWeatherIconUrl}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    await screen.findByTitle("set-main-location");
    expect(screen.getByTitle("set-main-location")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("set-main-location"));

    expect(setMainLocation).toHaveBeenCalledWith({ lat: 37.77, lon: -122.42 });

  });

  it("should call deleteLocation function on click of the trash icon", async () => {
    render(
      <WeatherSub
        id={1}
        lat={37.77}
        lon={-122.42}
        unit="metric"
        getWeatherIconUrl={getWeatherIconUrl}
        setMainLocation={setMainLocation}
        deleteLocation={deleteLocation}
      />
    );

    await screen.findByTitle("delete-location");
    expect(screen.getByTitle("delete-location")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("delete-location"));

    expect(deleteLocation).toHaveBeenCalledWith(1);
  });


});
