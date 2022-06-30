var weatherFormEl = document.querySelector("#city-search");
var weatherFormInput = document.querySelector("#city");
var lat;
var lon;

//This function takes in the new city name and sends it to be processed
var clickHandler = function(event) {
    event.preventDefault();
    lat = "";
    lon = "";

    var city = weatherFormInput.value.trim();
    //console.log(city);

    if (city) {
        getNewCityLocation(city);
        weatherFormInput.value = "";
    }
    else {
        alert("You must enter in a valid city!");
    }
};

//This function grabs the latitude and longitude from a geo API to use to grab weather data
var getNewCityLocation = function(city) {
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
            });
        }
    });
    
}

weatherFormEl.addEventListener("submit", clickHandler);