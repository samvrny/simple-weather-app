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

//This function takes in a city name 
var clickHandler = function(event) {
    event.preventDefault();
    lat = "";
    lon = "";
    city = "";

    city = weatherFormInput.value.trim();

    if (city) {
        getNewCityLocation(city);
        weatherFormInput.value = "";
    }
    else {
        alert("You must enter a valid city!");
        return;
    }
};

//This function takes the city name and grabs the latitude and longitude from a geo API to use to get weather data
var getNewCityLocation = function(city) {
    
    var geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=0743f583ed199b32639e47dedaa949e4";
    
    fetch(geoApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                if (data.length === 0) {
                    return;
                }
                //this makes sure the search history button for the current selected city doesn't already exist before printing a new button
                var oldHistory = JSON.parse(localStorage.getItem("citylist"));
                if (oldHistory === null) {
                    buttonMaker();
                }
                else if (!oldHistory.includes(city.charAt(0).toUpperCase() + city.slice(1).toLowerCase())) {
                    buttonMaker();
                }
                saveButton();
                
                for (var i = 0; i < data.length; i++) {
                    if (data[i].lat) {
                        lat = data[i].lat;
                    }
                    if (data[i].lon) {
                        lon = data[i].lon;
                    }
                }
                getTheWeather();
            }).catch(function(error) {
                console.log(error);
            });
        }
        else {
            alert("Something went wrong");
        }
    });
};

//this function takes in the latitude and longitude and uses it to get the current weather
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
                if (!data.current.uvi) {
                    todaysUv = 0;
                }

                //This sets the daily weather into an array to be used to print the 5 day weather forcast
                if (data.daily) {
                    fiveDayWeather = data.daily;
                }
                printTheWeatherCurrent();  
                futureWeatherCards();
            });
        }
    });
};

//this function prints out the current weather for the given city 
var printTheWeatherCurrent = function() {
    
    rightSide.classList.remove("hide");

    while (currentCity.firstChild) { //This removes the old weather data from the previous search
        currentCity.removeChild(currentCity.firstChild);
    }

    currentDate = moment().format("dddd, MMMM Do");

    var currentCityName = document.createElement("h2")
    currentCityName.classList.add("text-light");
    currentCityName.textContent = "Current Weather For " + city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() + " " + currentDate;
    currentCity.appendChild(currentCityName);

    var currentCityIcon = document.createElement("img");
    currentCityIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + todaysIcon + "@2x.png");
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

    //these if statements add color to the background of the UV index
    if (todaysUv <= 2) {
        currentCityUv.classList.add("bg-success");
    }
    else if (todaysUv > 2 && todaysUv <= 5) {
        currentCityUv.classList.add("bg-warning");
    }
    else if (todaysUv > 5 && todaysUv <= 7) {
        currentCityUv.classList.add("orange");
    }
    else if (todaysUv > 7 && todaysUv <= 15) {
        currentCityUv.classList.add("bg-danger");
    }
    currentCity.appendChild(currentCityUv);

    var currentCityWind = document.createElement("p");
    currentCityWind.textContent = "Wind Speed: " + todaysWind + " M.P.H.";
    currentCity.appendChild(currentCityWind);
};

//this function prints the 5 day weather forcast for the given city
var futureWeatherCards = function() {

    while(cityCards.firstChild) { //removes the old 5 day forcast
        cityCards.removeChild(cityCards.firstChild);
    }
    
    fiveDayDate = moment().format("M/D");

    //loops through the 5 day weather forcast array and prints it on the screen
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
        futureCity.textContent = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() + " " + fiveDayDate;
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

//turns the given city into a button for search history
var buttonMaker = function() {
    var newCityButton = document.createElement("button");
    newCityButton.setAttribute("value", city);
    newCityButton.classList.add("btn-primary", "btn", "my-1", "history");
    newCityButton.innerText = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    searchHistory.appendChild(newCityButton);   
};

//saves the search history buttons to localStorage
var saveButton = function() {

    var newButton = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    
    if (localStorage.getItem("citylist") == null) {
        localStorage.setItem("citylist", "[]");
    }

    var oldHistory = JSON.parse(localStorage.getItem("citylist"));
    if (!oldHistory.includes(newButton)) {
        oldHistory.push(newButton);
    }

    localStorage.setItem("citylist", JSON.stringify(oldHistory));    
};

//loads the search history buttons from localStorage
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

//captures the clicks from the search history buttons and sends the results to the geolocation function
$("#search-history").on("click", "button", function() {
    var captureClick = $(this).val();
    city = captureClick;
    getNewCityLocation(city);
});

//listens for a new city name to be submitted and sends it to be turned into weather for the given city
weatherFormEl.addEventListener("submit", clickHandler);

//calls for the search history buttons to be loaded
loadButtons();

