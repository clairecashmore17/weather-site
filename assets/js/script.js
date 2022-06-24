// Function to get the current weather stats
var apiKey = "5594d308b30b4677a98190029222406";
var weatherUrl = "http://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=New York&days=5&";

fetch(weatherUrl)
.then(function(response){
    if(response.ok){
        response.json()
        .then(function(data){
            console.log(data);
            console.log(data.current.temp_f)
        })
    }
    else {
        alert("Cannot identify city");
    }
});

