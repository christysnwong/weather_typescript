import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import NewLocationForm from "./NewLocationForm";

describe("NewLocationForm component", () => {
  const saveNewLocation = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the input and submit button", () => {
    render(<NewLocationForm saveNewLocation={saveNewLocation} />);

    const input = screen.getByPlaceholderText("Bookmark a City");
    // const button = screen.getByText("Submit");
    const button = screen.getByRole("button");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should update the formData on input change", () => {
    render(<NewLocationForm saveNewLocation={saveNewLocation} />);

    const input = screen.getByPlaceholderText("Bookmark a City");
    fireEvent.change(input, { target: { value: "San Francisco" } });

    expect(input.value).toBe("San Francisco");
  });

  it("should call the saveNewLocation prop on form submit and clear the form after submitting", async () => {
    render(<NewLocationForm saveNewLocation={saveNewLocation} />);

    const input = screen.getByPlaceholderText("Bookmark a City");

    fireEvent.change(input, { target: { value: "San Francisco" } });

    const button = screen.getByText("Submit");

    fireEvent.click(button);

    await waitFor(() => {
      expect(saveNewLocation).toHaveBeenCalledWith({
        lat: 37.7749295,
        lon: -122.4194155,
      });
    });

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
