const apiKey = '730e2a2e299b05b0855e68eaef10d5ca';

document.querySelector('.search-box button').addEventListener('click', () => {
    getWeather(document.querySelector('.search-box input').value);
});

document.querySelector('.search-box input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather(document.querySelector('.search-box input').value);
    }
});

async function getWeather(city) {
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.innerHTML = '<div class="loading"></div>';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod === '404') {
            throw new Error('City not found');
        }

        displayWeather(data);
    } catch (error) {
        weatherInfo.innerHTML = `
            <div class="error">
                <p>${error.message || 'Something went wrong!'}</p>
            </div>
        `;
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                alert('Unable to get location');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser');
    }
}

async function getWeatherByCoords(lat, lon) {
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.innerHTML = '<div class="loading"></div>';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfo.innerHTML = `
            <div class="error">
                <p>Unable to fetch weather data</p>
            </div>
        `;
    }
}

function displayWeather(data) {
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="temp">${Math.round(data.main.temp)}°C</div>
        <div class="weather-description">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
            <p>${data.weather[0].description}</p>
        </div>
        <div class="weather-details">
            <div class="detail">
                <i class="fas fa-temperature-high"></i>
                <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
            </div>
            <div class="detail">
                <i class="fas fa-tint"></i>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
            <div class="detail">
                <i class="fas fa-wind"></i>
                <p>Wind: ${data.wind.speed} m/s</p>
            </div>
            <div class="detail">
                <i class="fas fa-compress-arrows-alt"></i>
                <p>Pressure: ${data.main.pressure} hPa</p>
            </div>
        </div>
    `;
}