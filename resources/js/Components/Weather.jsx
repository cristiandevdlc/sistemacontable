import React, { useEffect, useState } from 'react';
import weather from '../../png/flama.ico'
const WeatherTemperature = () => {
  const [temperature, setTemperature] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);

  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Torreon&appid=49f7d560d7f952f61b4fdf89dff0d1c8')
      .then(response => response.json())
      .then(data => {
        const currentTemperature = Math.round(data.main.temp - 273.15);
        setTemperature(currentTemperature);
        setWeatherIcon(data.weather[0].icon);
        setWeatherDescription(data.weather[0].description);
      })
      .catch(error => {
      });
  }, []);
  
  return (
    <div className="wheater">
      {temperature !== null ? (
        <div className='contentWheater'>
          <div className='contentWheater_info'>
            {weatherIcon !== null && (
              <img src={`https://openweathermap.org/img/w/${weatherIcon}.png`} alt="Weather Icon" />
            )}
          </div>
          <div className='contentWheater_p'>
            <p>{temperature} °C</p>
            {weatherDescription !== null && (
              <p>{weatherDescription}</p>
            )}
          </div>
        </div>
      ) : (
        <p>Cargando...</p>    
      )}
    </div>
  );
}

export default WeatherTemperature;