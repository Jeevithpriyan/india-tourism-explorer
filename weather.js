/*==========================================================
        INCREDIBLE INDIA EXPLORER
                weather.js
==========================================================*/

"use strict";

/*==========================================================
                    CONFIGURATION
==========================================================*/

// Get your free API key from:
// https://openweathermap.org/api

const WEATHER_API_KEY = "YOUR_API_KEY_HERE";

const WEATHER_BASE_URL =
"https://api.openweathermap.org/data/2.5/weather";

const FORECAST_BASE_URL =
"https://api.openweathermap.org/data/2.5/forecast";

/*==========================================================
                DOM ELEMENTS
==========================================================*/

const weatherCard =
document.getElementById("weatherCard");

const searchInput =
document.getElementById("destinationSearch");

const searchButton =
document.getElementById("searchButton");

/*==========================================================
            DEFAULT DESTINATION
==========================================================*/

let currentLocation = "Ooty";

/*==========================================================
            WEATHER ICONS
==========================================================*/

const weatherIcons = {

    Clear:"☀️",

    Clouds:"☁️",

    Rain:"🌧️",

    Drizzle:"🌦️",

    Thunderstorm:"⛈️",

    Snow:"❄️",

    Mist:"🌫️",

    Fog:"🌫️",

    Haze:"🌤️",

    Smoke:"🌫️"

};

/*==========================================================
            TEMPERATURE COLORS
==========================================================*/

function getTemperatureColor(temp){

    if(temp <= 10){

        return "#3B82F6";

    }

    if(temp <= 20){

        return "#10B981";

    }

    if(temp <= 30){

        return "#F59E0B";

    }

    return "#EF4444";

}
/*==========================================================
                LOADING STATE
==========================================================*/

function showWeatherLoading() {

    if (!weatherCard) return;

    weatherCard.innerHTML = `
        <div class="loader"></div>
        <h3 style="text-align:center;">Loading weather...</h3>
    `;

}

/*==========================================================
                ERROR STATE
==========================================================*/

function showWeatherError(message) {

    if (!weatherCard) return;

    weatherCard.innerHTML = `
        <div style="text-align:center;padding:40px;">
            <h2>⚠️</h2>
            <h3>Unable to load weather</h3>
            <p>${message}</p>
        </div>
    `;

}

/*==========================================================
                FETCH WEATHER
==========================================================*/

async function fetchWeather(city = currentLocation) {

    showWeatherLoading();

    try {

        const response = await fetch(

            `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)},IN&units=metric&appid=${WEATHER_API_KEY}`

        );

        if (!response.ok) {

            throw new Error("Location not found");

        }

        const data = await response.json();

        displayWeather(data);

    }

    catch (error) {

        console.error(error);

        showWeatherError(error.message);

    }

}
/*==========================================================
                DISPLAY WEATHER
==========================================================*/

function displayWeather(data) {

    if (!weatherCard) return;

    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const wind = data.wind.speed;
    const visibility = (data.visibility / 1000).toFixed(1);

    const weather = data.weather[0].main;
    const description = data.weather[0].description;

    const icon = weatherIcons[weather] || "🌍";

    const sunrise = new Date(data.sys.sunrise * 1000)
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    const sunset = new Date(data.sys.sunset * 1000)
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    const tempColor = getTemperatureColor(temp);

    weatherCard.innerHTML = `
...
`;

updateWeatherTheme(weather);

<div class="weather-live-card">

    <div class="weather-header">

        <h2>${icon} ${city}</h2>

        <p>${country}</p>

    </div>

    <div class="weather-main">

        <h1 style="color:${tempColor}">
            ${temp}°C
        </h1>

        <h3>${description}</h3>

    </div>

    <div class="weather-grid">

        <div class="weather-item">
            🌡 Feels Like
            <strong>${feelsLike}°C</strong>
        </div>

        <div class="weather-item">
            💧 Humidity
            <strong>${humidity}%</strong>
        </div>

        <div class="weather-item">
            💨 Wind
            <strong>${wind} m/s</strong>
        </div>

        <div class="weather-item">
            👁 Visibility
            <strong>${visibility} km</strong>
        </div>

        <div class="weather-item">
            🌅 Sunrise
            <strong>${sunrise}</strong>
        </div>

        <div class="weather-item">
            🌇 Sunset
            <strong>${sunset}</strong>
        </div>

        <div class="weather-item">
            📈 Pressure
            <strong>${pressure} hPa</strong>
        </div>

        <div class="weather-item">
            🌍 Condition
            <strong>${weather}</strong>
        </div>

    </div>

</div>

`;

}
/*==========================================================
                SEARCH WEATHER
==========================================================*/

function searchWeather(){

    if(!searchInput) return;

    const city = searchInput.value.trim();

    if(city === ""){

        showWeatherError("Please enter a tourist destination.");

        return;

    }

    currentLocation = city;

    saveRecentSearch(city);

    fetchWeather(city);

}

/*==========================================================
                SEARCH BUTTON
==========================================================*/

if(searchButton){

    searchButton.addEventListener("click",searchWeather);

}

/*==========================================================
                ENTER KEY SUPPORT
==========================================================*/

if(searchInput){

    searchInput.addEventListener("keydown",(event)=>{

        if(event.key==="Enter"){

            searchWeather();

        }

    });

}

/*==========================================================
                RECENT SEARCHES
==========================================================*/

function saveRecentSearch(city){

    let history =
    JSON.parse(localStorage.getItem("recentWeather")) || [];

    history = history.filter(item=>item!==city);

    history.unshift(city);

    history = history.slice(0,8);

    localStorage.setItem(

        "recentWeather",

        JSON.stringify(history)

    );

}

/*==========================================================
                LOAD DEFAULT WEATHER
==========================================================*/

window.addEventListener("DOMContentLoaded",()=>{

    fetchWeather(currentLocation);

});
/*==========================================================
                FAVORITE DESTINATIONS
==========================================================*/

let favoriteDestinations =
JSON.parse(localStorage.getItem("favoriteDestinations")) || [];

function addFavorite(city){

    city = city.trim();

    if(!city) return;

    if(!favoriteDestinations.includes(city)){

        favoriteDestinations.push(city);

        localStorage.setItem(

            "favoriteDestinations",

            JSON.stringify(favoriteDestinations)

        );

        if(typeof showToast === "function"){

            showToast(`${city} added to favorites ⭐`);

        }

    }

}

function removeFavorite(city){

    favoriteDestinations =

    favoriteDestinations.filter(item=>item!==city);

    localStorage.setItem(

        "favoriteDestinations",

        JSON.stringify(favoriteDestinations)

    );

}

/*==========================================================
            POPULAR DESTINATIONS
==========================================================*/

const popularDestinations=[

"Ooty",
"Kodaikanal",
"Goa",
"Manali",
"Shimla",
"Munnar",
"Jaipur",
"Udaipur",
"Varanasi",
"Agra",
"Leh",
"Darjeeling",
"Rameswaram",
"Kanyakumari",
"Mysuru",
"Coorg"

];

/*==========================================================
            RANDOM DESTINATION
==========================================================*/

function loadRandomDestination(){

    const random =

    popularDestinations[

        Math.floor(

            Math.random()

            * popularDestinations.length

        )

    ];

    fetchWeather(random);

}

/*==========================================================
            LAST UPDATED
==========================================================*/

function getLastUpdated(){

    const now = new Date();

    return now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/*==========================================================
            AUTO REFRESH
==========================================================*/

setInterval(()=>{

    fetchWeather(currentLocation);

    console.log(

        "Weather refreshed:",

        getLastUpdated()

    );

},600000); // 10 minutes
/*==========================================================
                USER LOCATION
==========================================================*/

function getCurrentLocationWeather(){

    if(!navigator.geolocation){

        showWeatherError("Geolocation is not supported.");

        return;

    }

    showWeatherLoading();

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat = position.coords.latitude;

            const lon = position.coords.longitude;

            try{

                const response = await fetch(

`${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`

                );

                if(!response.ok){

                    throw new Error("Unable to fetch weather.");

                }

                const data = await response.json();

                currentLocation = data.name;

                displayWeather(data);

            }

            catch(error){

                showWeatherError(error.message);

            }

        },

        ()=>{

            showWeatherError(

                "Location permission denied."

            );

        }

    );

}

/*==========================================================
            WEATHER BACKGROUND
==========================================================*/

function updateWeatherTheme(weather){

    const body=document.body;

    body.classList.remove(

        "weather-clear",

        "weather-clouds",

        "weather-rain",

        "weather-snow",

        "weather-thunder"

    );

    switch(weather){

        case "Clear":

            body.classList.add("weather-clear");

            break;

        case "Clouds":

            body.classList.add("weather-clouds");

            break;

        case "Rain":

        case "Drizzle":

            body.classList.add("weather-rain");

            break;

        case "Snow":

            body.classList.add("weather-snow");

            break;

        case "Thunderstorm":

            body.classList.add("weather-thunder");

            break;

    }

}

/*==========================================================
            OFFLINE DETECTION
==========================================================*/

window.addEventListener("offline",()=>{

    showWeatherError(

        "No internet connection."

    );

});

window.addEventListener("online",()=>{

    fetchWeather(currentLocation);

});

/*==========================================================
            RETRY FUNCTION
==========================================================*/

async function retryWeather(city,retries=3){

    while(retries>0){

        try{

            await fetchWeather(city);

            return;

        }

        catch{

            retries--;

        }

    }

}

/*==========================================================
                5 DAY FORECAST
==========================================================*/

async function fetchForecast(city = currentLocation){

    try{

        const response = await fetch(

`${FORECAST_BASE_URL}?q=${encodeURIComponent(city)},IN&units=metric&appid=${WEATHER_API_KEY}`

        );

        if(!response.ok){

            throw new Error("Forecast unavailable.");

        }

        const data = await response.json();

        displayForecast(data.list);

    }

    catch(error){

        console.error(error);

    }

}

/*==========================================================
                DISPLAY FORECAST
==========================================================*/

function displayForecast(list){

    let forecastContainer =

    document.getElementById("forecastContainer");

    if(!forecastContainer){

        forecastContainer =

        document.createElement("div");

        forecastContainer.id="forecastContainer";

        forecastContainer.className="forecast-grid";

        weatherCard.after(forecastContainer);

    }

    forecastContainer.innerHTML="";

    const dailyForecast = list.filter(item=>

        item.dt_txt.includes("12:00:00")

    );

    dailyForecast.forEach(day=>{

        const date = new Date(day.dt_txt);

        const weekday = date.toLocaleDateString(

            "en-IN",

            {weekday:"short"}

        );

        const temp =

        Math.round(day.main.temp);

        const weather =

        day.weather[0].main;

        const icon =

        weatherIcons[weather] || "🌍";

        forecastContainer.innerHTML += `

<div class="forecast-card">

    <h3>${weekday}</h3>

    <div class="forecast-icon">

        ${icon}

    </div>

    <h2>${temp}°C</h2>

    <p>${weather}</p>

</div>

`;

    });

}

/*==========================================================
                UPDATE FORECAST
==========================================================*/

const originalDisplayWeather = displayWeather;

displayWeather = function(data){

    originalDisplayWeather(data);

    fetchForecast(data.name);

};
/*==========================================================
                AIR QUALITY INDEX
==========================================================*/

async function fetchAirQuality(lat, lon){

    try{

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`

        );

        if(!response.ok) return;

        const data = await response.json();

        updateAQI(data.list[0].main.aqi);

    }

    catch(error){

        console.error("AQI Error:", error);

    }

}

function updateAQI(aqi){

    const levels={

        1:"🟢 Good",

        2:"🟡 Fair",

        3:"🟠 Moderate",

        4:"🔴 Poor",

        5:"🟣 Very Poor"

    };

    const element=document.getElementById("aqiValue");

    if(element){

        element.textContent=levels[aqi] || "N/A";

    }

}

/*==========================================================
                FAVORITE BUTTON
==========================================================*/

function createFavoriteButton(city){

    return `

<button

class="btn btn-primary"

onclick="addFavorite('${city}')">

⭐ Save Destination

</button>

`;

}

/*==========================================================
                WEATHER SUMMARY
==========================================================*/

function getWeatherAdvice(weather,temp){

    if(weather==="Rain"){

        return "🌧 Carry an umbrella.";

    }

    if(weather==="Clear" && temp>30){

        return "☀ Stay hydrated.";

    }

    if(weather==="Snow"){

        return "❄ Wear warm clothes.";

    }

    if(weather==="Clouds"){

        return "☁ Pleasant weather.";

    }

    return "🌤 Great time to travel.";

}

/*==========================================================
                UPDATE WEATHER CARD
==========================================================*/

const previousDisplay = displayWeather;

displayWeather=function(data){

    previousDisplay(data);

    const advice=getWeatherAdvice(

        data.weather[0].main,

        Math.round(data.main.temp)

    );

    weatherCard.innerHTML+=`

<div class="travel-advice">

<h3>Travel Advice</h3>

<p>${advice}</p>

${createFavoriteButton(data.name)}

</div>

`;

    fetchAirQuality(

        data.coord.lat,

        data.coord.lon

    );

};

/*==========================================================
                INITIALIZATION
==========================================================*/

window.addEventListener("load",()=>{

    fetchWeather(currentLocation);

});

/*==========================================================
                END OF weather.js
==========================================================*/
