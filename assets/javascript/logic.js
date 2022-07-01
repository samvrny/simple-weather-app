var weatherFormEl = document.querySelector("#city-search");
var weatherFormInput = document.querySelector("#city");
var rightSide = document.querySelector("#right-side");
var currentCity = document.getElementById("current-city");
var lat;
var lon;
var city;
var todaysTemp;
//var temp = [];
var todaysIcon;
var todaysWind;
var todaysUv;
var todaysHumidity;


//This function takes in the new city name and sends it to be processed
var clickHandler = function(event) {
    event.preventDefault();
    lat = "";
    lon = "";
    //temp = [];

    city = weatherFormInput.value.trim();
    console.log(city);

    if (city) {
        getNewCityLocation(city);
        weatherFormInput.value = ""; //will need to change this later so that the city shows up for the weather input
    }
    else {
        alert("You must enter in a valid city!");
    }
};

//This function grabs the latitude and longitude from a geo API to use to grab weather data
var getNewCityLocation = function(city) {
    //later will add another search field/OR a dropdown menu to chose locations from
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=0743f583ed199b32639e47dedaa949e4";

    fetch(geoApiUrl).then(function(response) {

        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].lat) {
                        lat = data[i].lat;
                        //console.log(lat);
                    }
                    if (data[i].lon) {
                        lon = data[i].lon;
                        //console.log(lon);
                    }
                }
                getTheWeather();
            });
        }
        else {
            alert("Something went wrong");
        }
    });
};

var getTheWeather = function() {
    //console.log(lat, lon, "yay");

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=0743f583ed199b32639e47dedaa949e4";
    
    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);

                if (data.current.temp) {
                    todaysTemp = data.current.temp;
                    console.log(todaysTemp, "temp"); //cosolelog
                }
                if (data.current.weather[0].icon) {
                    todaysIcon = data.current.weather[0].icon;
                }
                console.log(todaysIcon, "icon"); //console.log
                if (data.current.wind_speed) {
                    todaysWind = data.current.wind_speed;
                    console.log(todaysWind, "wind"); //console.log
                }
                if(data.current.humidity) {
                    todaysHumidity = data.current.humidity;
                    console.log(todaysHumidity, "humidity"); //console.log
                }
                if (data.current.uvi) {
                    todaysUv = data.current.uvi;
                    console.log(todaysUv, "uvi"); //console.log
                }
                printTheWeatherCurrent();
            });
        }
    });
};

var printTheWeatherCurrent = function() {
    
    rightSide.classList.remove("hide");
    while (currentCity.firstChild) { //This removes the old weather data
        currentCity.removeChild(currentCity.firstChild);
    }

    var currentCityName = document.createElement("h2")
    currentCityName.textContent = "Current Weather For " + city;
    currentCity.appendChild(currentCityName);

    var currentCityIcon = document.createElement("img");
    currentCityIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + todaysIcon + "@2x.png");
    currentCity.appendChild(currentCityIcon);

    var currentCityTemp = document.createElement("p");
    currentCityTemp.textContent = "Temperature: " + todaysTemp + " Degrees. Ouch!";
    currentCity.appendChild(currentCityTemp);

    // var currentCityIcon = document.createElement("img");
    // currentCityIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + todaysIcon + "@2x.png");
    // currentCity.appendChild(currentCityIcon);

    var currentCityHumidity = document.createElement("p");
    currentCityHumidity.textContent = "Humidity: " + todaysHumidity + " %";
    currentCity.appendChild(currentCityHumidity);

    var currentCityUv = document.createElement("p");
    currentCityUv.textContent = "UV Index: " + todaysUv;
    currentCity.appendChild(currentCityUv);

    var currentCityWind = document.createElement("p");
    currentCityWind.textContent = "Wind Speed: " + todaysWind + " M.P.H.";
    currentCity.appendChild(currentCityWind);
};



//need the city name, the current date, the icon for weather, the temp, humidity, wind speed, UV index
weatherFormEl.addEventListener("submit", clickHandler);