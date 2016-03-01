//write function to remove spaces from input string
//think about how to build celsius/fahr functionality
"use strict"

document.getElementById("submitLocation").addEventListener("click", function(e) {
	let city = document.getElementById("location").value;
	
	if (city.indexOf(" ") !== -1) {
	    city = removeSpaces(city);
	}
	console.log(city);
	
	requestWeatherData(city);
	}, false);





function getLatitudeAndLongitude (position) {
	let latitude = position.coords.latitude.toString();
	let longitude = position.coords.longitude.toString();
	return [latitude, longitude];
}


function Temperature(value) {
	this.value = value;
	this.fahr = Math.round(this.kelvinToFahr());
	this.cel = Math.round(this.kelvinToCel());
	this.kel = Math.round(value);
}


Temperature.prototype.kelvinToFahr = function() {
	return this.value * (9 / 5) - 459.67;
};


Temperature.prototype.kelvinToCel = function() {
	return this.value - 273.15;
};


Temperature.prototype.postTemperature = function(scaleLetter) {
	let displayTemp = this.fahr;
	let displayScale = "F&deg;";
	
	if (scaleLetter === "c") {
		displayTemp = this.cel;
		displayScale = "C&deg;";
	}
	if (scaleLetter === "k") {
		displayTemp = this.kel;
		displayScale = "";
	}
	if (scaleLetter === "f") {
		displayTemp = this.fahr;
		displayScale = "F&deg;";
	}
	
	document.getElementById("display").innerHTML = displayTemp;
	
};


function removeSpaces(str) {
    return str.split(" ").join("");
}


function requestWeatherData(locationData) {
	console.log(locationData);
	let keyUrl = "&APPID=ee32a4f58d7e4f2ac180490b23d764ac";
	let locationUrl;
	
	if (typeof(locationData) === typeof([])) {
		locationUrl = "lat=" + locationData[0] + "&lon=" + locationData[1];
	}
	if (typeof(locationData) === typeof("")) {
		locationUrl = "q=" + locationData;		
	}
	
	let request = new XMLHttpRequest();

	//success function
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			console.log("success");
			let weatherData = JSON.parse(request.response);
			let cityTemp = new Temperature(weatherData.main.temp);
			let cityName = weatherData.name;
			let conditions = weatherData.weather[0].description;
			cityTemp.postTemperature();
			document.getElementById("cityDisplay").innerHTML = cityName;
			document.getElementById("conditionDisplay").innerHTML = conditions;
			

		}
	};
	
	request.open("GET", "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?" + 
	locationUrl + keyUrl);
	request.send(null);
}

document.getElementById("inlineDisplay").addEventListener("click", 
function(e) {
    if (document.getElementById("display") !== "--") {
        if (e.target.id === "cel") {
            cityTemp.postTemperature(c);
        }
        if (e.target.id === "fahr") {
            cityTemp.postTemperature(f);
        }
    }
}, false);

function success(position) {
	let locationData = getLatitudeAndLongitude(position);
	requestWeatherData(locationData);
}

console.log(cityTemp);


//window.onload = navigator.geolocation.getCurrentPosition(success);











