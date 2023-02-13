import { render, fireEvent, screen } from "@testing-library/react";
import WeatherDashboard from "../WeatherDashboard";

describe("WeatherDashboard component", () => {
  it("renders correctly", () => {
    render(<WeatherDashboard />);
  });

  it("displays the weather headings and sections correctly", () => {
    render(<WeatherDashboard />);

      expect(screen.getByText("°C")).toBeInTheDocument();
      expect(screen.getByText("Current Weather")).toBeInTheDocument();
      expect(screen.getByText("Bookmarks")).toBeInTheDocument();

  });

  it("updates temp unit correctly", async () => {
    render(<WeatherDashboard />);

    const celcius = screen.getByText("°C");
    const fahrenheit = screen.getByText("°F");
    fireEvent.click(fahrenheit);

    expect(celcius).toHaveClass("weather-link");
    expect(fahrenheit).toHaveClass("curr-unit");


  });

});
