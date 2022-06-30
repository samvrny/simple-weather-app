var weatherFormEl = document.querySelector("#city-search");
var weatherFormInput = document.querySelector("#city");

//This function takes in the new city name and sends it to be processed
var clickHandler = function(event) {
    event.preventDefault();

    var city = weatherFormInput.value.trim();
    console.log(city);

    if (city) {
        getNewCityLocation(city);
        weatherFormInput.textContent = "";
    }
    else {
        alert("You must enter in a valid city!");
    }
};

var getNewCityLocation = function(city) {
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=0743f583ed199b32639e47dedaa949e4";

    fetch(geoApiUrl).then(function(response) {

        if(response.ok) {
            console.log(response);
        }
        else {
            alert("Something went wrong");
        }
    })

};

weatherFormEl.addEventListener("submit", clickHandler);