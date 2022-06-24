//Global variables
var apiKey = "5594d308b30b4677a98190029222406";
var currentWeatherEl = document.querySelector("#current-weather");

var currentTempEl = document.querySelector("#temperature");
var currentWindEl = document.querySelector("#wind");
var currentHumidEl = document.querySelector("#humidity");
var currentUVEl = document.querySelector("#uv");
var currentPlaceEl = document.querySelector("#city");
var cityInputEl = document.querySelector("#city-name");
var searchFormEl = document.querySelector("#search-form");
var cityMenuEl = document.querySelector("#choice-menu");
var populated = false;

// Function to get the current weather stats
function fetchWeatherStats(city){

    var weatherUrl = "http://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=" + city;


    fetch(weatherUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                
                currentWeather(data);
            })
        }
        else {
            alert("Cannot identify city");
        }
    });

}

//Function to get 5 day forecast
function fetchFiveDayForecast(city){
    var forecastUrl = "http://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + city + "&days=5" ;
    fetch(forecastUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                console.log(data.forecast.forecastday)
                showFiveDay(data.forecast.forecastday);
            })
        }
    })

}

//Function to fill out the 5 day forecast
function showFiveDay(dayArray){
  
    if(populated){
        console.log("the weather has been populated before, trying to remove list items")
            //If our card already has information in it, we will remove them before we create more
            var weatherList = document.querySelectorAll("[data-id]");
            var dates = document.querySelectorAll("[data-date]");
            console.log(weatherList);
            weatherList.forEach(el =>{
                el.remove();
            })
            dates.forEach(el =>{
                el.remove();
            })
        
        
    }
    for(var i = 0; i < dayArray.length; i++){
        // console.log(dayArray[i].date)
        //Create dates for 5 days
        var cardEl = document.querySelector("#day-"+i);
        var dayDate = document.createElement("h1");
        dayDate.setAttribute("data-date", i);
        dayDate.classList = "title day-date";
        dayDate.textContent = dayArray[i].date;
       
        //create weather lists
        var weatherListEl = document.createElement("ul");
        weatherListEl.setAttribute("data-id",  i);
        var weatherIconEl = document.createElement("img");
        var tempEl= document.createElement("li");
        var windEl= document.createElement("li");
        var humidEl= document.createElement("li");

        //Set all info with information from array
        weatherIconEl.src =  dayArray[i].day.condition.icon;
        tempEl.textContent = "Temp: " + dayArray[i].day.avgtemp_f +"° F";
        windEl.textContent = "Wind: " + dayArray[i].day.maxwind_mph+ " MPH";
        humidEl.textContent = "Humidity: " + dayArray[i].day.avghumidity + "%";

        //append to the parent UL
        weatherListEl.appendChild(weatherIconEl);
        weatherListEl.appendChild(tempEl);
        weatherListEl.appendChild(windEl);
        weatherListEl.appendChild(humidEl);

        
        //Append to the parent card
        cardEl.appendChild(dayDate);
        cardEl.appendChild(weatherListEl);
    }
    populated = true;

};

//Function that deals with user search Input
function searchSubmitHandler(event){
    // console.log("I clicked search!");
    event.preventDefault();

    var userCity = cityInputEl.value.trim();
    if(userCity){
        fetchWeatherStats(userCity)
        fetchFiveDayForecast(userCity);
        //Clear out the search bar when finished
        cityInputEl.value ="";
    }
}
//Function to deal with menu choices
function menuClickHandler(event){
    targetEl= event.target;
    fetchWeatherStats(targetEl.id);
    fetchFiveDayForecast(targetEl.id);
}

//Function to fill out the current weather information
function currentWeather(city){
    currentPlaceEl.textContent = city.location.name + " (" + city.location.localtime + ")";
    var currentIconEl = document.getElementById("weather-icon").src = city.current.condition.icon;
    console.log(currentIconEl);
    currentTempEl.textContent = "Temp: " + city.current.temp_f + "° F";
    currentWindEl.textContent = "Wind: " + city.current.wind_mph + " MPH";
    currentHumidEl.textContent = "Humidity: " + city.current.humidity + "%";
    currentUVEl.textContent = "UV Index: " + city.current.uv;
};


searchFormEl.addEventListener("submit", searchSubmitHandler);
cityMenuEl.addEventListener("click", menuClickHandler);
