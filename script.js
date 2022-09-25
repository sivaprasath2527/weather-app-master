$(document).ready(function getLocation() {
    $(".menu-icon-list").hide();
    $("#menu-cross-icon").hide();
    if (navigator.geolocation) {
            
        navigator.geolocation.getCurrentPosition(setApi);
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
});

// function to convert unix date and time format to 24 hr local tme
function unixToTime(unix_timestamp){
    var localTime = moment.unix(unix_timestamp);
    localTime = localTime.format("hh:mm:ss A");
    return localTime;
}

function averaging(arr) {
    var sum = 0;
    arr.forEach(function(num) { sum += num });
    var averagedArr = Math.round(sum / arr.length);
    return averagedArr;
}
function weatherUnit_desc(weather_unit, period){
    
    let weather_widget_div
    let weather_desc_div
    if(period == true){
        weather_desc_div = $("#weather-desc");
        weather_widget_div = $("#img-weather-widget");
    }else{
        weather_desc_div = $("#weather-desc-hiddenDiv");
        weather_widget_div = $("#img-weather-widget-hiddenDiv");
    }
    // describe the weather condition like clear sky
    var weather_desc = [
        'Clear sky', 'Mainly clear, partly cloudy, and overcast',
        'Fog and depositing rime fog', 'Drizzle: Light, moderate, and dense intensity',
        'Freezing Drizzle: Light and dense intensity',
        'Rain: Slight, moderate and heavy intensity',
        'Freezing Rain: Light and heavy intensity',
        'Snow fall: Slight, moderate, and heavy intensity',
        'Snow grains',
        'Rain showers: Slight, moderate, and violent',
        'Snow showers slight and heavy',
        'Thunderstorm: Slight or moderate',
        'hunderstorm with slight and heavy hail'
    ];
    // img file that store corresponding weather widget for weather desce
    var weather_widget = {

        0: "resources/clearday.svg",
        1: "resources/cloudy.svg",
        2: "resources/cloudysnowing.svg",
        3: "resources/foggy.svg",
        4: "resources/partlycloud.svg",
        5: "resources/raining.svg",
        6: "resources/severesnow.svg",
        7: "resources/thunderstome.svg"
    };
    if(weather_unit == 0){
        if( period == true){
            $("#weather-desc").html(weather_desc[0]);
            $("#img-weather-widget").attr("src", weather_widget[0]);
        }else{
            $("#weather-desc-hiddenDiv").html(weather_desc[0]);
            $("#img-weather-widget-hiddenDiv").attr("src", weather_widget[0]);
        }
        
    }else if(weather_unit > 0 && weather_unit <= 3){
        weather_desc_div.html(weather_desc[1]);
        weather_widget_div.attr("src", weather_widget[4]);
    }else if(weather_unit <= 48 && weather_unit > 3){
        weather_desc_div.html(weather_desc[2]);
        weather_widget_div.attr("src", weather_widget[3]);
                
    }else if(weather_unit<= 55 && weather_unit > 50){
        weather_desc_div.html(weather_desc[3]); 
        weather_widget_div.attr("src", weather_widget[3]);                               
    }else if(weather_unit <= 57 && weather_unit > 55){
        weather_desc_div.html(weather_desc[4]); 
        weather_widget_div.attr("src", weather_widget[3]);               
    }else if(weather_unit <= 65 && weather_unit > 60){
        weather_desc_div.html(weather_desc[5]);    
        weather_widget_div.attr("src", weather_widget[5]);            
    }else if(weather_unit <= 67 && weather_unit >65){
        weather_desc_div.html(weather_desc[6]);    
        weather_widget_div.attr("src", weather_widget[5]);            
    }else if(weather_unit <= 75 && weather_unit > 70){
        weather_desc_div.html(weather_desc[7]);       
        weather_widget_div.attr("src", weather_widget[2]);         
    }else if(weather_unit == 77 && weather_unit > 75){
        weather_desc_div.html(weather_desc[8]);            
        weather_widget_div.attr("src", weather_widget[6]);    
    }else if(weather_unit <= 82 && weather_unit > 79){
        weather_desc_div.html(weather_desc[9]);      
        weather_widget_div.attr("src", weather_widget[5]);          
    }else if(weather_unit <= 86 && weather_unit > 84){
        weather_desc_div.html(weather_desc[10]);  
        weather_widget_div.attr("src", weather_widget[2]);                      
    }else if(weather_unit == 95 && weather_unit > 86){
    
        weather_desc_div.html(weather_desc[11]);                
        weather_widget_div.attr("src", weather_widget[7]);
    }else if(weather_unit <= 95 && weather_unit > 95){
        weather_desc_div.html(weather_desc[12]);              
        weather_widget_div.attr("src", weather_widget[7]);  
    };
}

// to convert wind direction  degree into text direction
function getCardinalDirection(angle) {
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(angle / 45) % 8];
}

function setApi(position){
   
    
    const weatherApi_url = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,windspeed_10m_max,windgusts_10m_max&current_weather=true&timeformat=unixtime&timezone=Asia%2FBangkok`;
    async function getweatherData(url){
        const response = await fetch(url);
        var data = await response.json();
        console.log(data);
        const weatherData = data;
        let elementsOfWeatherDats = [];
        for(let i = 0; i<= Object.keys(weatherData).length; i++){
            let keysValue = Object.keys(weatherData)[i]
            elementsOfWeatherDats.push(keysValue);
        }
        if(elementsOfWeatherDats.includes("daily")){
            $(".hidden-div").hide();
            $(".div-wrapper").show();
            var sunrise = weatherData.daily.sunrise[weatherData.daily.sunrise.length -1 ];
            $("#sunriseTime").html(unixToTime(sunrise));
            let sunset = weatherData.daily.sunset[weatherData.daily.sunset.length -1];
            $("#sunsetTime").html(unixToTime(sunset));
            let temp_2m_max = weatherData.daily.temperature_2m_max;
            $("#max-temp").html(averaging(temp_2m_max) + " °C");
            let temp_2m_min = weatherData.daily.temperature_2m_min;
            $("#min-temp").html(averaging(temp_2m_min) + " °C");
            let weather_code = weatherData.current_weather.weathercode;
            let isDaily = true;
            weatherUnit_desc(weather_code, isDaily);
        }else{
            $(".hidden-div").show();
            $(".div-wrapper").hide()
            isDaily = false;
            let weather_code = weatherData.current_weather.weathercode;
            weatherUnit_desc(weather_code, isDaily);
            let currentTime = weatherData.current_weather.time;
            $("#current-time").html(unixToTime(currentTime));
            let currentTemp = weatherData.current_weather.temperature;
            $("#current-temp").html(currentTemp);
            let windDirection = weatherData.current_weather.winddirection;
            $("#wind-direction").html(getCardinalDirection(windDirection));
            let windSpeed = weatherData.current_weather.windspeed;
            $("#wind-speed").html(windSpeed);

        }
        
    };
    function locStringToInt(str){
        const geoArr = [];
        if(str.indexOf(' ') >= 0){
            geoArr.push(parseFloat( str.substring(0, str.indexOf(' ')) ));
            geoArr.push(parseFloat( str.substring(str.indexOf(' '), str.length) ));
        }
        return geoArr;
    };
    getweatherData(weatherApi_url);
    $(".searchSide-btn").on("click", () => {
        const input_city = $("#input-search").val();
        const location_api = `https://geocode-maps.yandex.ru/1.x/?apikey=dd896e0e-8618-423f-b4bd-5272499bac0a&format=json&geocode=${input_city}`
        async function getLocationData(url){
            const response = await fetch(url);
            var loc_data = await response.json();
            console.log(loc_data);
            // let searched_latitude = loc_data.data[0].latitude;
            // let searched_longitude = loc_data.data[0].longitude;
            let searched_lat_long = loc_data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
            let geocodeArr = locStringToInt(searched_lat_long);
            console.log(typeof(searched_lat_long ))
            console.log(searched_lat_long)
            console.log(locStringToInt(searched_lat_long))
            // const searched_url = `https://api.open-meteo.com/v1/forecast?latitude=${searched_latitude}&longitude=${searched_longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,cloudcover_low,cloudcover_high&current_weather=true&timeformat=unixtime&timezone=Asia%2FBangkok`;
            const searched_url = `https://api.open-meteo.com/v1/forecast?latitude=${geocodeArr[1]}&longitude=${geocodeArr[0]}&hourly=temperature_2m,relativehumidity_2m,weathercode,cloudcover_low,cloudcover_high&current_weather=true&timeformat=unixtime&timezone=Asia%2FBangkok`;
            let searched_weatherData =    getweatherData(searched_url);
            searchDisappear(searched_weatherData);
        };
        // const location_api = `http://api.positionstack.com/v1/forward?access_key=3e2cfd5a7e75d33753c3f9423e1cecc8&query=${input_city}`;
        
        getLocationData(location_api);
        
    });
    
}
function menuIcon(isMenuLines){
    console.log(isMenuLines);
    let menuIcon = $(".menu-icon-list");
    if(isMenuLines){
        menuIcon.show();
        $("#menu-cross-icon").show();
        $("#menu-lines-icon").hide();
    }else{
        menuIcon.hide();
        $("#menu-cross-icon").hide();
        $("#menu-lines-icon").show();
    }

}


