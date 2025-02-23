const apiKey = "8979be4b3b1fc0f59f684764f8c3d823"
let weatherEntities = []
let weatherVisible = false
// fetch("/locations.json")
// .then((response) => response.json())
// .then((data) => {
//     plotWeatherForecastOnGlobe(data)
// })
// .catch((error) => console.error("Error loading weather forecast data from locations.json", error))

document.getElementById("toggle-weather").addEventListener("click", () => {
    toggleWeatherForecasts();
  });
  
  async function toggleWeatherForecasts() {
    if (weatherVisible) {
      // If weather icons are visible, clear them
      clearWeatherIcons();
      document.getElementById("toggle-weather").textContent = "Load Weather"; // Change button text
    } else {
      // If weather icons are not visible, load them only if not already loaded
      if (weatherEntities.length === 0) {
        fetch("/locations.json")
          .then((response) => response.json())
          .then((data) => {
            plotWeatherForecastOnGlobe(data);
          })
          .catch((error) => console.error("Error loading weather forecast data from locations.json", error));
      }
      document.getElementById("toggle-weather").textContent = "Clear Weather"; // Change button text
    }
  
    // Toggle the weather visibility state
    weatherVisible = !weatherVisible;
    console.log(weatherVisible);
  }

  function clearWeatherIcons() {
    const viewer = window.viewer;
    weatherEntities.forEach((entity) => {
      viewer.entities.remove(entity);
    });
    weatherEntities = [];
  }


  async function plotWeatherForecastOnGlobe(data) {
    const viewer = window.viewer;
    const locations = data;
  
    for (const location of locations) {
      const latitude = location.latitude;
      const longitude = location.longitude;
      if (latitude != null && longitude != null) {
        const weather = await fetchWeatherData(latitude, longitude);
        if (weather) {
          let weatherIconUrl;
          if (weather.description.includes("rain")) {
            weatherIconUrl = "/icons/rain.png";
          } else if (weather.description.includes("cloud")) {
            weatherIconUrl = "/icons/cloudy.png";
          } else if (weather.description.includes("clear")) {
            weatherIconUrl = "/icons/sun.png";
          }
  
          if (viewer.entities) {
            const weatherEntity = viewer.entities.add({
              name: `${weather.description}`,
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude + 0.1),
              billboard: {
                image: weatherIconUrl, // Display weather icon
                width: 50,
                height: 50,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
              label: {
                text: `${weather.temperature}°C`,
                font: "16px sans-serif",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 0), // Adjust position
              },
              description: `
                Description: ${weather.description} <br>
                Temperature: ${weather.temperature} °C<br>
              `,
            });
  
            weatherEntities.push(weatherEntity);
          } else {
            console.error("Entities is undefined");
          }
        }
      }
    }
  }

async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data fetch failed");
        const data = await response.json();
        
        return {
            temperature: data.main.temp,
            icon: data.weather[0].icon, // Icon ID (e.g., "10d" for rain)
            description: data.weather[0].description,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}   