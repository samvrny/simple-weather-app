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


//This function takes in the new city name and sends it to be processed
var clickHandler = function(event) {
    event.preventDefault();
    lat = "";
    lon = "";
    city = "";

    city = weatherFormInput.value.trim();
    console.log(city);

    if (city) {
        buttonMaker();
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
    //console.log(lat, lon, "yay"); //consolelog

    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&units=imperial&appid=0743f583ed199b32639e47dedaa949e4";
    
    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);

                //these if statements set the current weather to variables to print
                if (data.current.temp) {
                    todaysTemp = data.current.temp;
                    //console.log(todaysTemp, "temp"); //cosolelog
                }
                if (data.current.weather[0].icon) {
                    todaysIcon = data.current.weather[0].icon;
                }
                //console.log(todaysIcon, "icon"); //console.log
                if (data.current.wind_speed) {
                    todaysWind = data.current.wind_speed;
                    //console.log(todaysWind, "wind"); //console.log
                }
                if(data.current.humidity) {
                    todaysHumidity = data.current.humidity;
                    //console.log(todaysHumidity, "humidity"); //console.log
                }
                if (data.current.uvi) {
                    todaysUv = data.current.uvi;
                    //console.log(todaysUv, "uvi"); //console.log
                }

                //This sets the daily weather into a variable to use
                if (data.daily) {
                    fiveDayWeather = data.daily;
                    //console.log(fiveDayWeather, "Meow");
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

    var currentCityName = document.createElement("h2")
    currentCityName.textContent = "Current Weather For " + city;
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
    //console.log(fiveDayWeather, "Moo");
    for (var i = 0; i < 5; i++) {

        var dailyIcon = fiveDayWeather[i].weather[0].icon;
        //console.log(dailyIcon);

        var dailyTemp = fiveDayWeather[i].temp.day;
        //console.log(dailyTemp);

        var dailyHumidity = fiveDayWeather[i].humidity;
        //console.log(dailyHumidity);

        var dailyWind = fiveDayWeather[i].wind_speed;
        //console.log(dailyWind, "Wind");

        var futureWeatherCard = document.createElement("div");
        futureWeatherCard.classList.add("card");
        cityCards.appendChild(futureWeatherCard);

        var futureCity = document.createElement("div");
        futureCity.textContent = city;
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
    //needs date, icon, temp, wind speed, humidity
    //THIS IS WHERE I STOPPED WORKING. CONTINUE AND COMPLETE THE CARDS;
    //Then: Change color of UV index
    //make buttons with localStorage
    //If there's time, figure out how to search by state
    //All done!
};

var newCityButton;

var buttonMaker = function() {
    newCityButton = document.createElement("button");
    newCityButton.setAttribute("id", city);
    newCityButton.setAttribute("value", city);
    newCityButton.classList.add("btn-primary", "btn", "my-1", "history");
    newCityButton.innerText = city;
    searchHistory.appendChild(newCityButton);

    saveButton();
};

var saveButton = function() {

    var newButton = document.getElementById(city).value;
    console.log(newButton);
    
    if (localStorage.getItem("citylist") == null) {
        localStorage.setItem("citylist", "[]");
    }

    var oldHistory = JSON.parse(localStorage.getItem("citylist"));
    oldHistory.push(newButton);

    console.log(oldHistory);

    localStorage.setItem("citylist", JSON.stringify(oldHistory));
    
};

var loadButtons = function() {
    var savedButtons = localStorage.getItem("citylist")

    if (!savedButtons) {
        return false;
    }

    savedButtons = JSON.parse(savedButtons);

    for (var i = 0; i < savedButtons.length; i++)
        buttonMaker(savedButtons[i]);
    
};



//need the city name, the current date, the icon for weather, the temp, humidity, wind speed, UV index
weatherFormEl.addEventListener("submit", clickHandler);
//loadButtons();
