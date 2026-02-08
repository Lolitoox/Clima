// ========================================
// Weather App - Open-Meteo API Integration
// ========================================

// API Base URLs
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const locationBtn = document.getElementById('locationBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherContent = document.getElementById('weatherContent');
const particles = document.getElementById('particles');

// Weather Elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const uvIndex = document.getElementById('uvIndex');
const precipitation = document.getElementById('precipitation');
const locationSubtitle = document.getElementById('locationSubtitle');
const hourlyForecast = document.getElementById('hourlyForecast');
const weeklyForecast = document.getElementById('weeklyForecast');

// SVG Weather Icons (compatible with all browsers)
const weatherIcons = {
    'clear-day': `<svg viewBox="-4 -4 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="4" fill="#ffd43b" stroke="#ffd43b"/>
        <path stroke="#ffd43b" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`,
    'clear-night': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#a5b4fc" stroke="#a5b4fc" stroke-width="1.5"/>
    </svg>`,
    'partly-cloudy-day': `<svg viewBox="-4 -4 32 32" fill="none">
        <circle cx="8" cy="8" r="3" fill="#ffd43b" stroke="#ffd43b"/>
        <path d="M8 3v1M8 12v1M3 8h1M12 8h1M4.5 4.5l.7.7M11.5 11.5l-.7-.7M4.5 11.5l.7-.7M11.5 4.5l-.7.7" stroke="#ffd43b" stroke-width="1"/>
        <path d="M18 18H8a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10.4 2.5A3 3 0 0 1 18 18z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    </svg>`,
    'partly-cloudy-night': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M12 3a5 5 0 0 0 5 5 5 5 0 0 0-5 5 5 5 0 0 0-5-5 5 5 0 0 0 5-5z" fill="#a5b4fc" stroke="#a5b4fc"/>
        <path d="M18 18H8a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10.4 2.5A3 3 0 0 1 18 18z" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
    </svg>`,
    'cloudy': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M18 18H6a5 5 0 0 1-.5-9.96 7 7 0 0 1 13.36 2.35A4 4 0 0 1 18 18z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>
    </svg>`,
    'fog': `<svg viewBox="-4 -4 32 32" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round">
        <path d="M4 6h16M4 10h16M4 14h12M4 18h8"/>
    </svg>`,
    'drizzle': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M16 13H7a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10 1A3.5 3.5 0 0 1 16 13z" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
        <path stroke="#60a5fa" stroke-width="2" stroke-linecap="round" d="M8 16v2M12 15v2M16 16v2"/>
    </svg>`,
    'rain': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M16 11H7a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10 1A3.5 3.5 0 0 1 16 11z" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
        <path stroke="#3b82f6" stroke-width="2" stroke-linecap="round" d="M6 14v4M10 13v4M14 14v4M18 13v4"/>
    </svg>`,
    'heavy-rain': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M16 10H7a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10 1A3.5 3.5 0 0 1 16 10z" fill="#475569" stroke="#64748b" stroke-width="1.5"/>
        <path stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" d="M5 13v5M8 14v5M11 13v5M14 14v5M17 13v5"/>
    </svg>`,
    'snow': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M16 12H7a4 4 0 0 1 0-8h.5a5.5 5.5 0 0 1 10 1A3.5 3.5 0 0 1 16 12z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="7" cy="17" r="1.5" fill="#e2e8f0"/>
        <circle cx="12" cy="16" r="1.5" fill="#e2e8f0"/>
        <circle cx="17" cy="17" r="1.5" fill="#e2e8f0"/>
        <circle cx="9.5" cy="20" r="1.5" fill="#e2e8f0"/>
        <circle cx="14.5" cy="20" r="1.5" fill="#e2e8f0"/>
    </svg>`,
    'thunderstorm': `<svg viewBox="-4 -4 32 32" fill="none">
        <path d="M17 9H8a4 4 0 1 1 .5-7.96 5.5 5.5 0 0 1 10.39 2.31A3.5 3.5 0 0 1 17 9z" fill="#475569" stroke="#64748b" stroke-width="1.5"/>
        <path d="M12.5 10l-2.5 4h3.5l-2 4.5" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
};

// Weather Code to Description & Icon mapping
const weatherCodes = {
    0: { description: 'Despejado', icon: 'clear-day', iconNight: 'clear-night', type: 'clear' },
    1: { description: 'Mayormente despejado', icon: 'partly-cloudy-day', iconNight: 'partly-cloudy-night', type: 'clear' },
    2: { description: 'Parcialmente nublado', icon: 'partly-cloudy-day', iconNight: 'partly-cloudy-night', type: 'cloudy' },
    3: { description: 'Nublado', icon: 'cloudy', iconNight: 'cloudy', type: 'cloudy' },
    45: { description: 'Niebla', icon: 'fog', iconNight: 'fog', type: 'fog' },
    48: { description: 'Niebla helada', icon: 'fog', iconNight: 'fog', type: 'fog' },
    51: { description: 'Llovizna ligera', icon: 'drizzle', iconNight: 'drizzle', type: 'rain' },
    53: { description: 'Llovizna moderada', icon: 'drizzle', iconNight: 'drizzle', type: 'rain' },
    55: { description: 'Llovizna densa', icon: 'rain', iconNight: 'rain', type: 'rain' },
    56: { description: 'Llovizna helada ligera', icon: 'drizzle', iconNight: 'drizzle', type: 'rain' },
    57: { description: 'Llovizna helada densa', icon: 'rain', iconNight: 'rain', type: 'rain' },
    61: { description: 'Lluvia ligera', icon: 'rain', iconNight: 'rain', type: 'rain' },
    63: { description: 'Lluvia moderada', icon: 'rain', iconNight: 'rain', type: 'rain' },
    65: { description: 'Lluvia fuerte', icon: 'heavy-rain', iconNight: 'heavy-rain', type: 'heavy-rain' },
    66: { description: 'Lluvia helada ligera', icon: 'rain', iconNight: 'rain', type: 'rain' },
    67: { description: 'Lluvia helada fuerte', icon: 'heavy-rain', iconNight: 'heavy-rain', type: 'heavy-rain' },
    71: { description: 'Nevada ligera', icon: 'snow', iconNight: 'snow', type: 'snow' },
    73: { description: 'Nevada moderada', icon: 'snow', iconNight: 'snow', type: 'snow' },
    75: { description: 'Nevada fuerte', icon: 'snow', iconNight: 'snow', type: 'heavy-snow' },
    77: { description: 'Granizo', icon: 'snow', iconNight: 'snow', type: 'snow' },
    80: { description: 'Chubascos ligeros', icon: 'drizzle', iconNight: 'drizzle', type: 'rain' },
    81: { description: 'Chubascos moderados', icon: 'rain', iconNight: 'rain', type: 'rain' },
    82: { description: 'Chubascos violentos', icon: 'heavy-rain', iconNight: 'heavy-rain', type: 'heavy-rain' },
    85: { description: 'Chubascos de nieve ligeros', icon: 'snow', iconNight: 'snow', type: 'snow' },
    86: { description: 'Chubascos de nieve fuertes', icon: 'snow', iconNight: 'snow', type: 'heavy-snow' },
    95: { description: 'Tormenta', icon: 'thunderstorm', iconNight: 'thunderstorm', type: 'thunderstorm' },
    96: { description: 'Tormenta con granizo ligero', icon: 'thunderstorm', iconNight: 'thunderstorm', type: 'thunderstorm' },
    99: { description: 'Tormenta con granizo fuerte', icon: 'thunderstorm', iconNight: 'thunderstorm', type: 'thunderstorm' }
};

// Days of the week in Spanish
const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Current weather state
let isDay = true;

// ========================================
// Helper: Get weather icon
// ========================================
function getWeatherIcon(code, isDaytime = true) {
    const weather = weatherCodes[code] || weatherCodes[0];
    const iconKey = isDaytime ? weather.icon : weather.iconNight;
    return weatherIcons[iconKey] || weatherIcons['clear-day'];
}

// ========================================
// Search Functionality
// ========================================

let searchTimeout;

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (query.length < 2) {
        hideSearchResults();
        return;
    }

    searchTimeout = setTimeout(() => searchCities(query), 300);
});

searchInput.addEventListener('focus', () => {
    if (searchResults.children.length > 0) {
        searchResults.classList.add('active');
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        hideSearchResults();
    }
});

async function searchCities(query) {
    try {
        const response = await fetch(`${GEO_API}?name=${encodeURIComponent(query)}&count=5&language=es`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displaySearchResults(data.results);
        } else {
            searchResults.innerHTML = '<li><span class="city">No se encontraron resultados</span></li>';
            searchResults.classList.add('active');
        }
    } catch (error) {
        console.error('Error searching cities:', error);
    }
}

function displaySearchResults(results) {
    searchResults.innerHTML = results.map(result => `
        <li data-lat="${result.latitude}" data-lon="${result.longitude}" data-name="${result.name}">
            <span class="city">${result.name}</span>
            <span class="country">${result.admin1 ? result.admin1 + ', ' : ''}${result.country}</span>
        </li>
    `).join('');

    searchResults.classList.add('active');

    // Add click handlers
    searchResults.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const lat = li.dataset.lat;
            const lon = li.dataset.lon;
            const name = li.dataset.name;

            searchInput.value = name;
            hideSearchResults();
            getWeather(lat, lon, name, false);
        });
    });
}

function hideSearchResults() {
    searchResults.classList.remove('active');
}

// ========================================
// Geolocation
// ========================================

locationBtn.addEventListener('click', getUserLocation);

function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Tu navegador no soporta geolocalización');
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            // Get city name from coordinates using Nominatim (better coverage)
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`);
                const data = await response.json();
                // Try to get city, town, village, or municipality name
                const name = data.address?.city ||
                    data.address?.town ||
                    data.address?.village ||
                    data.address?.municipality ||
                    data.address?.county ||
                    'Tu ubicación';
                getWeather(latitude, longitude, name, true);
            } catch (error) {
                getWeather(latitude, longitude, 'Tu ubicación', true);
            }
        },
        (error) => {
            let message = 'Error al obtener ubicación';
            if (error.code === 1) message = 'Permiso de ubicación denegado';
            if (error.code === 2) message = 'Ubicación no disponible';
            if (error.code === 3) message = 'Tiempo de espera agotado';
            showError(message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// ========================================
// Weather Data
// ========================================

async function getWeather(lat, lon, name, isCurrentLocation = false) {
    showLoading();

    // Store if this is current location for later use
    window.isCurrentLocation = isCurrentLocation;

    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day,precipitation',
            hourly: 'temperature_2m,weather_code,precipitation_probability',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max',
            timezone: 'auto',
            forecast_days: 8
        });

        const response = await fetch(`${WEATHER_API}?${params}`);

        if (!response.ok) {
            throw new Error('Error al obtener datos del clima');
        }

        const data = await response.json();
        updateWeather(data, name);
    } catch (error) {
        console.error('Weather API error:', error);
        showError('No se pudo cargar el clima. Intenta de nuevo.');
    }
}

function updateWeather(data, name) {
    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    // Update current weather
    const weatherInfo = weatherCodes[current.weather_code] || weatherCodes[0];
    isDay = current.is_day === 1;

    cityName.textContent = name;

    // Show "Ubicación actual" subtitle when using geolocation
    if (window.isCurrentLocation) {
        locationSubtitle.textContent = 'Ubicación actual';
        locationSubtitle.style.display = 'block';
    } else {
        locationSubtitle.textContent = '';
        locationSubtitle.style.display = 'none';
    }

    currentDate.textContent = formatCurrentDate();
    temperature.textContent = Math.round(current.temperature_2m);
    weatherDescription.textContent = weatherInfo.description;
    weatherIcon.innerHTML = getWeatherIcon(current.weather_code, isDay);
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    uvIndex.textContent = daily.uv_index_max?.[0]?.toFixed(1) || '--';

    // Precipitation info - show today's expected rain and probability
    const todayPrecip = daily.precipitation_sum?.[0] || 0;
    const todayProbability = daily.precipitation_probability_max?.[0] || 0;
    precipitation.innerHTML = `${todayPrecip.toFixed(1)} mm<br><small>${todayProbability}%</small>`;

    // Update background based on time and weather
    updateBackground(current.is_day, weatherInfo.type);

    // Update weather animations
    updateWeatherAnimations(weatherInfo.type);

    // Update hourly forecast
    updateHourlyForecast(hourly);

    // Update weekly forecast
    updateWeeklyForecast(daily);

    // Show content
    showWeatherContent();
}

function formatCurrentDate() {
    const now = new Date();
    const day = daysOfWeek[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    return `${day}, ${date} de ${month}`;
}

function updateHourlyForecast(hourly) {
    const now = new Date();
    const currentHour = now.getHours();

    // Get next 24 hours
    let html = '';
    for (let i = 0; i < 24; i++) {
        const hourIndex = currentHour + i;
        if (hourIndex >= hourly.time.length) break;

        const time = new Date(hourly.time[hourIndex]);
        const hour = time.getHours();
        const temp = Math.round(hourly.temperature_2m[hourIndex]);
        const code = hourly.weather_code[hourIndex];
        const probability = hourly.precipitation_probability?.[hourIndex] || 0;

        // Determine if it's day or night for this hour
        const isDayHour = hour >= 6 && hour < 20;
        const icon = getWeatherIcon(code, isDayHour);

        const isNow = i === 0;
        const timeLabel = isNow ? 'Ahora' : `${hour}:00`;

        // Show rain probability if > 0
        const rainInfo = probability > 0 ? `<span class="hourly-rain">${probability}%</span>` : '';

        html += `
            <div class="hourly-item ${isNow ? 'now' : ''}">
                <span class="hourly-time">${timeLabel}</span>
                <span class="hourly-icon">${icon}</span>
                <span class="hourly-temp">${temp}°</span>
                ${rainInfo}
            </div>
        `;
    }

    hourlyForecast.innerHTML = html;
}

function updateWeeklyForecast(daily) {
    let html = '';

    // Start from index 1 to skip today (show next 7 days)
    for (let i = 1; i < Math.min(daily.time.length, 8); i++) {
        const date = new Date(daily.time[i]);
        const dayName = daysOfWeek[date.getDay()];
        const dayDate = `${date.getDate()}/${date.getMonth() + 1}`;
        const code = daily.weather_code[i];
        const icon = getWeatherIcon(code, true);
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const precipMm = daily.precipitation_sum?.[i] || 0;
        const precipProb = daily.precipitation_probability_max?.[i] || 0;

        // Rain info column
        const rainInfo = precipProb > 0
            ? `<div class="forecast-rain"><span class="rain-prob">${precipProb}%</span><span class="rain-mm">${precipMm.toFixed(1)} mm</span></div>`
            : '<div class="forecast-rain"><span class="rain-prob">--</span></div>';

        html += `
            <div class="forecast-item">
                <div class="forecast-day">
                    <span class="day-name">${dayName}</span>
                    <span class="day-date">${dayDate}</span>
                </div>
                <span class="forecast-icon">${icon}</span>
                ${rainInfo}
                <div class="forecast-temps">
                    <span class="temp-high">${maxTemp}°</span>
                    <span class="temp-low">${minTemp}°</span>
                </div>
            </div>
        `;
    }

    weeklyForecast.innerHTML = html;
}

// ========================================
// Background & Animations
// ========================================

function updateBackground(isDayValue, weatherType) {
    document.body.classList.remove('night', 'sunset');

    const hour = new Date().getHours();

    if (!isDayValue || hour >= 19 || hour < 6) {
        document.body.classList.add('night');
    } else if (hour >= 17 && hour < 19) {
        document.body.classList.add('sunset');
    }
}

function updateWeatherAnimations(weatherType) {
    // Clear previous animations
    particles.innerHTML = '';

    // Remove any existing overlays
    document.querySelectorAll('.thunder-flash, .fog-overlay').forEach(el => el.remove());

    switch (weatherType) {
        case 'rain':
        case 'heavy-rain':
            createRainAnimation(weatherType === 'heavy-rain' ? 100 : 50);
            break;
        case 'snow':
        case 'heavy-snow':
            createSnowAnimation(weatherType === 'heavy-snow' ? 80 : 40);
            break;
        case 'thunderstorm':
            createRainAnimation(80);
            createThunderAnimation();
            break;
        case 'fog':
            createFogAnimation();
            break;
        case 'cloudy':
            createCloudAnimation(5);
            break;
        case 'clear':
            // Only show sun animation during daytime
            if (isDay) {
                createSunAnimation();
            }
            break;
    }
}

function createRainAnimation(count) {
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        particles.appendChild(drop);
    }
}

function createSnowAnimation(count) {
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.width = `${4 + Math.random() * 6}px`;
        flake.style.height = flake.style.width;
        flake.style.animationDuration = `${5 + Math.random() * 10}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        particles.appendChild(flake);
    }
}

function createThunderAnimation() {
    const flash = document.createElement('div');
    flash.className = 'thunder-flash';
    document.body.appendChild(flash);
}

function createFogAnimation() {
    const fog = document.createElement('div');
    fog.className = 'fog-overlay';
    document.body.appendChild(fog);
}

function createCloudAnimation(count) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = `${100 + Math.random() * 150}px`;
        cloud.style.height = `${40 + Math.random() * 30}px`;
        cloud.style.top = `${5 + Math.random() * 30}%`;
        cloud.style.animationDuration = `${60 + Math.random() * 60}s`;
        cloud.style.animationDelay = `${-Math.random() * 60}s`;
        particles.appendChild(cloud);
    }
}

function createSunAnimation() {
    const container = document.createElement('div');
    container.className = 'sun-container';

    const sun = document.createElement('div');
    sun.className = 'sun';

    const rays = document.createElement('div');
    rays.className = 'sun-rays';

    // Create 12 rays
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        ray.style.transform = `translateX(-50%) rotate(${i * 30}deg) translateY(-60px)`;
        rays.appendChild(ray);
    }

    container.appendChild(sun);
    container.appendChild(rays);
    particles.appendChild(container);
}

// ========================================
// UI State Management
// ========================================

function showLoading() {
    loading.classList.add('active');
    errorMessage.classList.remove('active');
    weatherContent.classList.remove('active');
}

function showError(message) {
    errorText.textContent = message;
    loading.classList.remove('active');
    errorMessage.classList.add('active');
    weatherContent.classList.remove('active');
}

function showWeatherContent() {
    loading.classList.remove('active');
    errorMessage.classList.remove('active');
    weatherContent.classList.add('active');
}

// ========================================
// Initialize
// ========================================

// Try to get user's location on load, or show default city
document.addEventListener('DOMContentLoaded', () => {
    // Try to get user's location automatically
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Get city name from coordinates using Nominatim
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`);
                    const data = await response.json();
                    const name = data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.municipality ||
                        data.address?.county ||
                        'Tu ubicación';
                    getWeather(latitude, longitude, name, true);
                } catch (error) {
                    getWeather(latitude, longitude, 'Tu ubicación', true);
                }
            },
            (error) => {
                // If user denies permission or error, fallback to Rafaela
                console.log('Geolocalización no disponible, usando ubicación por defecto');
                getWeather(-31.2533, -61.4867, 'Rafaela', false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        // Fallback for browsers without geolocation
        getWeather(-31.2533, -61.4867, 'Rafaela', false);
    }
});

// Keyboard navigation for search
searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('li');
    const activeItem = searchResults.querySelector('li.active');
    let activeIndex = -1;

    if (activeItem) {
        activeIndex = Array.from(items).indexOf(activeItem);
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < items.length - 1) {
            items.forEach(item => item.classList.remove('active'));
            items[activeIndex + 1].classList.add('active');
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
            items.forEach(item => item.classList.remove('active'));
            items[activeIndex - 1].classList.add('active');
        }
    } else if (e.key === 'Enter') {
        if (activeItem) {
            activeItem.click();
        } else if (items.length > 0) {
            items[0].click();
        }
    } else if (e.key === 'Escape') {
        hideSearchResults();
    }
});
