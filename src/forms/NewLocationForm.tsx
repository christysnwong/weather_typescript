import { useState } from "react";
import { newLocationForm, newLocationFormProps, locationData } from "../common/interface";
import WeatherApi from "../api/api";

import "./NewLocationForm.css";

const NewLocationForm = ({ saveNewLocation } : newLocationFormProps) => {
  const [formData, setFormData] = useState<newLocationForm>({ newLocationName: "" });

  const handleChange = (evt : any) => {
    const { name, value } = evt.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt : any) => {
    evt.preventDefault();

    try {
        const resp : locationData = await WeatherApi.getLatLon(formData.newLocationName);

        saveNewLocation({lat: resp.results[0].geometry.location.lat, lon: resp.results[0].geometry.location.lng });

        setFormData({newLocationName: "" });
    } catch (e) {
        console.error(e);
    }
  }


  return (
    <div className="NewLocationForm">
      
        <form onSubmit={handleSubmit}>
            <div className="container-form">
              <input
                id="newLocationName"
                name="newLocationName"
                className="location-input"
                value={formData.newLocationName}
                onChange={handleChange}
                placeholder="Bookmark a City"
              />
              <button type="submit" className="btn"><i className="fa-solid fa-plus"></i></button>
            </div>
        </form>

    </div>
  );
};

export default NewLocationForm;