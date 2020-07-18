var apiKey = "ae73148c56c6f5580bee66b9c7ed810c";

// create functions for following
// - Current conditions

// - 5-Day Forecast

// - Search history

// - UV index

// "api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}"
// var searchQueryURL = "api.openweathermap.org/data/2.5/weather?q=seattle&appid="+ apiKey;

function searchCity(event){
   
    event.preventDefault();
    var cityInput = $("#searchcity").val();
    console.log("city : "+cityInput);
    searchCurrentWeather(cityInput);
    $("#searchcity").val("");
}

function searchCurrentWeather(city){

    var searchQueryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+ apiKey; 

    // Seach Current Weather
    $.ajax({
        
        url: searchQueryURL,
        method: "GET"

    }).then(function(response){
        
        // Log the queryURL
        console.log("Search Query URL : "+searchQueryURL);

       // Convert the temp to fahrenheit
       var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // Convert Kelvin to celsius : 0K − 273.15 = -273.1°C   
        var tempC = (response.main.temp - 273.15);

        var currentDate = new Date().toLocaleDateString();
    
       //http://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37 : uv api url
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;

        var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+latitude+"&lon="+longitude+"&appid="+ apiKey;

        var cityId = response.id;
        console.log("city id : "+cityId);
        
        // "http://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&cnt=5&units=imperial&appid="+apiKey;

        var forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&units=imperial&appid="+apiKey;
          
        $("#city-card").show();
        $("#city-name").text(response.name + " ("+currentDate+") "+imageIcon);
        $("#temperature").text("Temperature : "+tempF.toFixed(2)+" °F/ "+tempC.toFixed(2)+"°C"); //SHIFT OPTION 8 for degree symbol
        $("#humidity").text("Humidity : "+response.main.humidity+" %");
        $("#windspeed").text("Wind Speed : "+response.wind.speed+" MPH");

        var imageIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png")

        getUVIndex(uvQueryURL); 

        showForecast(forecastQueryURL);
        

    });   

}

//function to get UV index
function getUVIndex(uvQueryURL){

    console.log("UV query URL : "+uvQueryURL);
    
    $.ajax({
            
        url: uvQueryURL,
        method: "GET"

    }).then(function(uvResponse){
    
        var uvValue = uvResponse.value;
        
        var uvButton = $("<button>").attr("type","button").text(uvValue);
        // $("#uvindex").append(uvButton);
 
        if(uvValue >= 0 && uvValue <= 3){
            //low : green
            $("#uvindex").text("UV : Low, ").append(uvButton);
            uvButton.addClass("btn bg-success");
        }
        else if(uvValue >= 3 && uvValue <= 6){
            //moderate : yellow
            $("#uvindex").text("UV : Moderate, ").append(uvButton);
            uvButton.addClass("btn yellowBtn");
        } 
        else if(uvValue >= 6 && uvValue <= 8){
            //high : orange
            $("#uvindex").text("UV : High, ").append(uvButton);
            uvButton.addClass("btn orangeBtn");
        }
        else if(uvValue >= 8 && uvValue <= 10){
            //very high : red
            $("#uvindex").text("UV : Very high, ").append(uvButton);
            uvButton.addClass("btn bg-danger");
        }
        else if(uvValue >= 10){
            //extreme : violet
            $("#uvindex").text("UV : Extreme, ").append(uvButton);
            uvButton.addClass("btn violetBtn");
        }
    });
}

function showForecast(forecastQueryURL){

    // api.openweathermap.org/data/2.5/forecast?id={city ID}&cnt=5&units=imperial&appid={your api key}
    var temp, humidity,icon;

    console.log("Forecast query URL : "+forecastQueryURL);
    $("#5DayForecast").show();

    $.ajax({
            
        url: forecastQueryURL,
        method: "GET"

    }).then(function(forecastResponse){

        $("#forecast").empty();

        var list = forecastResponse.list;

        for(var i = 0 ; i < list.length ;i++){
            
            var date = list[i].dt_txt.split(" ")[0];
            var dateArr = date.split("-");
            
            var dateForecast = dateArr[1]+"/"+dateArr[2]+"/"+dateArr[0];
            var time = list[i].dt_txt.split(" ")[1];

            console.log("date : "+dateForecast+" time : "+time);

            if(time === "12:00:00"){

                temp = list[i].main.temp;
                humidity = list[i].main.humidity;
                icon = list[i].weather.icon;

                var card = $("<div>").addClass("card bg-primary text-white");
                var cardBody = $("<div>").addClass("card-body");
                
                var fDate = $("<h5>").addClass("card-text").text(dateForecast);
                
                // var imgIcon = $("<img>").attr("src","http://openweathermap.org/img/wn/" + icon + ".png)"); 
                // imgIcon.addClass("card-text");
                
                var tempP  = $("<p>").addClass("card-text").text("Temp: "+temp+"°F");
                
                var humidityP = $("<p>").addClass("card-text").text("Humidity : "+humidity+" %");

                cardBody.append(fDate,tempP, humidityP);
                card.append(cardBody);

                $("#forecast").append(card);
                

            }
       
        }
    });
}



$(document).ready(function(){

    $("#city-card").hide();
    $("#5DayForecast").hide();
    $("#searchButton").on("click",searchCity);
});