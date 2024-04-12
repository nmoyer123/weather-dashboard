// Define API key (Same for both geolocation and weather data)
const apiKey = "f43a3e33916a936e9f0c409bb790815d";

// Function to fetch weather data for a given city
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=imperial`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        updateCurrentWeatherDisplay(data, cityName);
        fetchFiveDayForecast(cityName); // Separate call for 5-day forecast
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data.');
    }
}

// Function to fetch 5-day weather forecast
async function fetchFiveDayForecast(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=imperial`);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }
        const forecastData = await response.json();
        updateFiveDayForecastDisplay(forecastData);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Update the display of current weather
function updateCurrentWeatherDisplay(weatherData, cityName) {
    const currentWeatherEl = document.querySelector('#current-weather');
    currentWeatherEl.innerHTML = `<h2>${cityName} (${new Date().toLocaleDateString()})</h2>
        <p>Temp: ${weatherData.main.temp}°F</p>
        <p>Wind: ${weatherData.wind.speed} MPH</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>`;
}

// Function to determine the weather icon
function getWeatherIcon(condition) {
    // Assuming 'Clear' is the condition for a sunny day and 'Clouds' for a cloudy day
    const sunIconUrl = 'https://openweathermap.org/img/wn/01d.png'; // Change to your preferred sun icon URL
    const cloudIconUrl = 'https://openweathermap.org/img/wn/03d.png'; // Change to your preferred cloud icon URL
    return condition === 'Clear' ? sunIconUrl : cloudIconUrl;
}

// Update the display of the 5-day forecast
function updateFiveDayForecastDisplay(forecastData) {
    const fiveDayWeatherEl = document.querySelector('#five-day-weather');
    fiveDayWeatherEl.innerHTML = '<h3>5-Day Forecast:</h3>';
    forecastData.list.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const iconUrl = getWeatherIcon(day.weather[0].main); // Get appropriate icon URL based on weather
        fiveDayWeatherEl.innerHTML += `<div class="forecast-day">
            <p>${date}</p>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temp: ${day.main.temp}°F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity}%</p>
        </div>`;
    });
}

// Event listener for form submission to handle city search
document.querySelector('#citySearch').addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = document.querySelector('#cityName').value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
        saveSearchHistory(cityName);
        updateSearchHistory();
        document.querySelector('#cityName').value = ''; // Clear input after search
    } else {
        alert('Please enter a city name.');
    }
});

// Save search history to localStorage
function saveSearchHistory(cityName) {
    let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searches.includes(cityName)) {
        searches.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searches));
    }
}

// Update the search history display
function updateSearchHistory() {
    const searchHistoryEl = document.querySelector('#searchHistory');
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryEl.innerHTML = searches.map(city => `<button onclick="fetchWeatherData('${city}')">${city}</button>`).join('');
}

// Initial call to update the search history on page load
updateSearchHistory();
