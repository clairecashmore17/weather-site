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
var j =1;


// Function to get the current weather stats
function fetchWeatherStats(city){

    var weatherUrl = "http://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=" + city;


    fetch(weatherUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){

                currentWeather(data);
                
            })
        }
        else {
            alert("Cannot identify city");
        }
    });

}

var dateToday = new Date();
var apiKey2 = "056ce8fbcebf599ddf3dd6cf847ed696";
//Function to fetch the geo-location
function fetchGeoLocation(city){
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid="+ apiKey2;

    fetch(geoApiUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                
                cityname = data[0].name;
                fetchWeatherStats2(data[0].lat, data[0].lon)
            })
        }
    })
}
// Function to get the current weather stats
function fetchWeatherStats2(lat, lon){

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" + lon + "&appid=" + apiKey2;


    fetch(weatherUrl)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                                
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
            
            // the arrow is used to replace the function words
            weatherList.forEach(el =>{
                el.remove();
            })
            dates.forEach(el =>{
                el.remove();
            })
        j = 1;
        
    }
    
    for(var i = 0; i < 5; i++){
        
        //Create dates for 5 days
        
        var cardEl = document.querySelector("#day-"+i);
        var dayDate = document.createElement("h1");
        dayDate.setAttribute("data-date", i);
        dayDate.classList = "title day-date";
        // debugger
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
        // http://openweathermap.org/img/wn/10d@2x.png
        weatherIconEl.src =  "http://openweathermap.org/img/wn/" +dayArray[i].weather[0].icon + "@2x.png";
        tempEl.textContent = "Temp: " + temp_f.toFixed(2) +"° F";
        windEl.textContent = "Wind: " + dayArray[i].wind_speed+ " MPH";
        humidEl.textContent = "Humidity: " + dayArray[i].humidity + "%";

        //append to the parent UL
        weatherListEl.appendChild(weatherIconEl);
        weatherListEl.appendChild(tempEl);
        weatherListEl.appendChild(windEl);
        weatherListEl.appendChild(humidEl);

        
        //Append to the parent card
        cardEl.appendChild(dayDate);
        cardEl.appendChild(weatherListEl);
    }
    //Lets us know that we have now populated our cards with information
    populated = true;

};

//function to add the Searched City to our menu
function createMenuOption(cityName) {
    
    var selectEl = document.querySelector("#menu-select");
    var menuOption = document.createElement("option");
    menuOption.id = cityName;
    menuOption.textContent = cityName;
    selectEl.appendChild(menuOption);


}


//Function that deals with user search Input
function searchSubmitHandler(event){
   
    event.preventDefault();

    var userCity = cityInputEl.value.trim();
    //Create our search history in our menu
    createMenuOption(userCity);
    
    if(userCity){
        fetchWeatherStats(userCity)
        fetchGeoLocation(userCity);
        
        //Clear out the search bar when finished
        cityInputEl.value ="";
    }
}

//Function to deal with menu choices
function menuClickHandler(event){
    targetEl= event.target;
    fetchWeatherStats(targetEl.id);
    fetchGeoLocation(targetEl.id);
}

//Function to fill out the current weather information
function currentWeather(city){
    //Create a disabled button to represent the color indicator of the uv index
    var uvBoxEl = document.createElement("button");
    uvBoxEl.title = "Disabled button";
    // All the if statements to determine which color we will set it as
    if(city.current.uv <= 2){
        uvBoxEl.classList = "button is-success";
    }
    else if(city.current.uv > 2 && city.current.uv <= 5){
        uvBoxEl.classList = "button is-warning";
    }
    else if(city.current.uv > 5 && city.current.uv <= 7){
        uvBoxEl.classList = "button is-orange";
    }
    else if(city.current.uv > 7 && city.current.uv <= 10){
        uvBoxEl.classList = "button is-danger";
    }
    else if(city.current.uv > 10){
        uvBoxEl.classList = "button is-violet";
    }
    
    //Set our text elements to the current city's info
    cityNameKnown = city.location.name;
    currentPlaceEl.textContent = city.location.name + " (" + city.location.localtime + ")";
    var currentIconEl = document.getElementById("weather-icon").src = "https:" + city.current.condition.icon;
    currentTempEl.textContent = "Temp: " + city.current.temp_f + "° F";
    currentWindEl.textContent = "Wind: " + city.current.wind_mph + " MPH";
    currentHumidEl.textContent = "Humidity: " + city.current.humidity + "%";
    currentUVEl.textContent = "UV Index: ";
    uvBoxEl.textContent = city.current.uv;
    currentUVEl.appendChild(uvBoxEl);
};

//Our event listeners
searchFormEl.addEventListener("submit", searchSubmitHandler);
cityMenuEl.addEventListener("click", menuClickHandler);
