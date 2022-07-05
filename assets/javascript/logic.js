var weatherFormEl = document.querySelector("#city-search");
var weatherFormInput = document.querySelector("#city");
var rightSide = document.querySelector("#right-side");
var currentCity = document.getElementById("current-city");
var cityCards = document.getElementById("city-cards");
var searchHistory = document.getElementById("search-history");
var lat;
var lon;
var city;
var todaysTemp;
var todaysIcon;
var todaysWind;
var todaysUv;
var todaysHumidity;
var fiveDayWeather = [];
var currentDate;
var fiveDayDate;

//This function takes in the new city name and sends it to be processed
var clickHandler = function(event) {
    event.preventDefault();
    lat = "";
    lon = "";
    city = "";

    city = weatherFormInput.value.trim();

    if (city) {
        buttonMaker();
        getNewCityLocation(city);
        weatherFormInput.value = "";
    }
    else {
        alert("You must enter a valid city!");
    }
    saveButton();
};

//This function grabs the latitude and longitude from a geo API to use to grab weather data
var getNewCityLocation = function(city) {
    
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=0743f583ed199b32639e47dedaa949e4";
    
    fetch(geoApiUrl).then(function(response) {

        if(response.ok) {
            response.json().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].lat) {
                        lat = data[i].lat;
                    }
                    if (data[i].lon) {
                        lon = data[i].lon;
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

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&units=imperial&appid=0743f583ed199b32639e47dedaa949e4";
    
    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                //these if statements set the current weather to variables to print
                if (data.current.temp) {
                    todaysTemp = data.current.temp;
                }
                if (data.current.weather[0].icon) {
                    todaysIcon = data.current.weather[0].icon;
                }
                if (data.current.wind_speed) {
                    todaysWind = data.current.wind_speed;
                }
                if(data.current.humidity) {
                    todaysHumidity = data.current.humidity;
                }
                if (data.current.uvi) {
                    todaysUv = data.current.uvi;
                }

                //This sets the daily weather into a variable to use
                if (data.daily) {
                    fiveDayWeather = data.daily;
                }
                printTheWeatherCurrent(); //call to current weather display
                removeCards(); //call to future weather display
            });
        }
    });
};

var printTheWeatherCurrent = function() {
    
    rightSide.classList.remove("hide");
    while (currentCity.firstChild) { //This removes the old weather data
        currentCity.removeChild(currentCity.firstChild);
    }

    currentDate = moment().format("dddd, MMMM Do");

    var currentCityName = document.createElement("h2")
    currentCityName.classList.add("text-light");
    currentCityName.textContent = "Current Weather For " + city + " " + currentDate;
    currentCity.appendChild(currentCityName);

    var currentCityIcon = document.createElement("img");
    currentCityIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + todaysIcon + "@2x.png");
    currentCity.appendChild(currentCityIcon);

    var currentCityTemp = document.createElement("p");
    currentCityTemp.textContent = "Temperature: " + todaysTemp + " Degrees.";
    currentCity.appendChild(currentCityTemp);

    var currentCityHumidity = document.createElement("p");
    currentCityHumidity.textContent = "Humidity: " + todaysHumidity + " %";
    currentCity.appendChild(currentCityHumidity);

    var currentCityUv = document.createElement("p");
    currentCityUv.textContent = "UV Index: " + todaysUv;
    currentCityUv.classList.add("px-3", "rounded-3")
    if (todaysUv <= 2) {
        currentCityUv.classList.add("bg-success");
    }
    else if (todaysUv > 2 && todaysUv <= 5) {
        currentCityUv.classList.add("bg-warning");
    }
    else if (todaysUv > 5 && todaysUv <= 7) {
        currentCityUv.classList.add("orange");
    }
    else if (todaysUv > 7 && todaysUv <= 10) {
        currentCityUv.classList.add("bg-danger");
    }
    currentCity.appendChild(currentCityUv);

    var currentCityWind = document.createElement("p");
    currentCityWind.textContent = "Wind Speed: " + todaysWind + " M.P.H.";
    currentCity.appendChild(currentCityWind);
};

var removeCards = function() {

    while(cityCards.firstChild) {
        cityCards.removeChild(cityCards.firstChild);
    }
    futureWeatherCards();
};

var futureWeatherCards = function() {
    
    fiveDayDate = moment().format("M/D");

    for (var i = 0; i < 5; i++) {

        fiveDayDate = moment(fiveDayDate, "M/D").add(1, "days").format("M/D/YY");

        var dailyIcon = fiveDayWeather[i].weather[0].icon;

        var dailyTemp = fiveDayWeather[i].temp.day;

        var dailyHumidity = fiveDayWeather[i].humidity;

        var dailyWind = fiveDayWeather[i].wind_speed;

        var futureWeatherCard = document.createElement("div");
        futureWeatherCard.classList.add("card");
        cityCards.appendChild(futureWeatherCard);

        var futureCity = document.createElement("div");
        futureCity.textContent = city + " " + fiveDayDate;
        futureCity.classList.add("card-header");
        futureWeatherCard.appendChild(futureCity);

        var newCard = document.createElement("div")
        newCard.classList.add("card-body");
        futureWeatherCard.appendChild(newCard);

        var futureIcon = document.createElement("img");
        futureIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
        newCard.appendChild(futureIcon);

        var futureTemp = document.createElement("p");
        futureTemp.textContent = "Temp: " + dailyTemp + " F";
        newCard.appendChild(futureTemp);

        var futureHumidity = document.createElement("p");
        futureHumidity.textContent = "Humidity: " + dailyHumidity + " %";
        newCard.appendChild(futureHumidity);

        var futureWind = document.createElement("p");
        futureWind.textContent = "Wind Speed: " + dailyWind + " M.P.H."
        newCard.appendChild(futureWind);
    }
};

var buttonMaker = function() {
    var newCityButton = document.createElement("button");
    newCityButton.setAttribute("value", city);
    newCityButton.classList.add("btn-primary", "btn", "my-1", "history");
    newCityButton.innerText = city;
    searchHistory.appendChild(newCityButton);   
};

var saveButton = function() {

    var newButton = city 
    
    if (localStorage.getItem("citylist") == null) {
        localStorage.setItem("citylist", "[]");
    }

    var oldHistory = JSON.parse(localStorage.getItem("citylist"));
    oldHistory.push(newButton);

    localStorage.setItem("citylist", JSON.stringify(oldHistory));    
};

var loadButtons = function() {
    var savedButtons = localStorage.getItem("citylist")

    if (!savedButtons) {
        return false;
    }

    savedButtons = JSON.parse(savedButtons);

    for (var i = 0; i < savedButtons.length; i++) {
        var apple = document.createElement("button");
        apple.setAttribute("value", savedButtons[i]);
        apple.classList.add("btn-primary", "btn", "my-1", "history");
        apple.innerText = savedButtons[i];
        searchHistory.appendChild(apple);
    }      
};

$("#search-history").on("click", "button", function() {
    var captureClick = $(this).val();
    city = captureClick;
    getNewCityLocation(city);
});

weatherFormEl.addEventListener("submit", clickHandler);

loadButtons();

