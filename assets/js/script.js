//Global variables

var currentWeatherEl = document.querySelector("#current-weather");
var cityname = "";
var currentTempEl = document.querySelector("#temperature");
var currentWindEl = document.querySelector("#wind");
var currentHumidEl = document.querySelector("#humidity");
var currentUVEl = document.querySelector("#uv");
var currentPlaceEl = document.querySelector("#city");
var cityInputEl = document.querySelector("#city-name");
var searchFormEl = document.querySelector("#search-form");
var cityMenuEl = document.querySelector("#choice-menu");
var populated = false;


var dateToday = new Date();
var apiKey = "056ce8fbcebf599ddf3dd6cf847ed696";
//Function to fetch the geo-location
function fetchGeoLocation(city){
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid="+ apiKey;

    fetch(geoApiUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data[0].lat)
                console.log(data[0].lon)
                console.log(data[0].name)
                cityname = data[0].name;
                fetchWeatherStats2(data[0].lat, data[0].lon)
            })
        }
    })
}
// Function to get the current weather stats
function fetchWeatherStats2(lat, lon){

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" + lon + "&appid=" + apiKey;


    fetch(weatherUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                console.log(data.current.weather);
                
                showFiveDay(data.daily);
            })
        }
        else {
            alert("Cannot identify city");
        }
    });

}



//Function to fill out the 5 day forecast
function showFiveDay(dayArray){
  
    if(populated){
        console.log("the weather has been populated before, trying to remove list items")
            //If our card already has information in it, we will remove them before we create more
            var weatherList = document.querySelectorAll("[data-id]");
            var dates = document.querySelectorAll("[data-date]");
            console.log(weatherList);
            // the arrow is used to replace the function words
            weatherList.forEach(el =>{
                el.remove();
            })
            dates.forEach(el =>{
                el.remove();
            })
        
        
    }
    for(var i = 0; i < 5; i++){
        // console.log(dayArray[i].date)
        //Create dates for 5 days
        var j = 1;
        var cardEl = document.querySelector("#day-"+i);
        var dayDate = document.createElement("h1");
        dayDate.setAttribute("data-date", i);
        dayDate.classList = "title day-date";
        dayDate.textContent = (dateToday.getDate() + j) + "/" + dateToday.getMonth() + "/" + dateToday.getFullYear();
        j++;
        //create weather lists
        var weatherListEl = document.createElement("ul");
        weatherListEl.setAttribute("data-id",  i);
        var weatherIconEl = document.createElement("img");
        var tempEl= document.createElement("li");
        var windEl= document.createElement("li");
        var humidEl= document.createElement("li");

        //Set all info with information from array
        temp_f = (dayArray[i].temp.day - 273) +(9/5) +32;
        // weatherIconEl.src =  "https://" +dayArray[i].day.condition.icon;
        tempEl.textContent = "Temp: " + temp_f +"° F";
        windEl.textContent = "Wind: " + dayArray[i].wind_speed+ " MPH";
        humidEl.textContent = "Humidity: " + dayArray[i].humidity + "%";

        //append to the parent UL
        // weatherListEl.appendChild(weatherIconEl);
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
        fetchGeoLocation(userCity)
        // fetchFiveDayForecast(userCity);
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

// //Function to fill out the current weather information
// function currentWeather(city){
//     currentPlaceEl.textContent = cityname + " (" + dateToday + ")";
//     var currentIconEl = document.getElementById("weather-icon").src = city.current.weather[0].icon;
//     console.log(currentIconEl);
//     temp_f = (city.current.temp - 273) +(9/5) +32;
//     currentTempEl.textContent = "Temp: " + temp_f + "° F";
//     currentWindEl.textContent = "Wind: " + city.current.wind_speed + " MPH";
//     currentHumidEl.textContent = "Humidity: " + city.current.humidity + "%";
//     currentUVEl.textContent = "UV Index: " + city.current.uvi;
// };


searchFormEl.addEventListener("submit", searchSubmitHandler);
cityMenuEl.addEventListener("click", menuClickHandler);
