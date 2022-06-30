var weatherFormEl = document.querySelector("#city-search");
var weatherFormInput = document.querySelector("#city");

var newCity = function(event) {
    event.preventDefault();
    console.log("Hello World");
};

weatherFormEl.addEventListener("submit", newCity);