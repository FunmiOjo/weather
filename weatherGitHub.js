"use strict";

function removeSpaces(str) {
    return str.split(" ").join("");
}

function makeScaleVisible() {
	var scaleElements = document.querySelectorAll(".scale");
	var i;
	for (i = 0; i < scaleElements.length; i++) {
		scaleElements[i].style.visibility = "visible";
	}
}

//weather and location objects and methods
var weatherData = {
	//most of this will be populated via AJAX request
	weatherAPIResponse: null,
	
	temperature: {
		kelvin: null,
		
		fahrenheit: null,
		
		celsius: null,
	},
	
	conditions: null,
	
	//need to revisit error handling here
	requestWeather: function(locationQuery) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.status >= 400) {
				document.getElementById("cityDisplay").textContent = 
				"Sorry! There was a problem retrieving your weather information. " +
				"Please try again or contact me at..."
			}
			
			if (request.readyState == 4 && request.status == 200) {
				weatherData.weatherAPIResponse = JSON.parse(request.response);
				weatherData.setConsolidatedInfo();
				weatherData.postConsolidatedInfo();	
			}
		};
		request.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + 
		locationQuery + "&APPID=");
		request.send(null);
	},
	
	setTemperature: function() {
		weatherData.temperature.kelvin = weatherData.weatherAPIResponse.main.temp;
		weatherData.temperature.fahrenheit = Math.round(weatherData.temperature.kelvin *
		(9 / 5) - 459.67);
		weatherData.temperature.celsius = Math.round(weatherData.temperature.kelvin -
		273.15);
	},
	
	setConditions: function() {
		weatherData.conditions = weatherData.weatherAPIResponse.weather[0].id;
	},
	
	postTemperature: function(displayText="") {
		makeScaleVisible();
		if (displayText) {
			document.getElementById("display").textContent = displayText;
		}
		else {
			if (weatherData.temperature.fahrenheit) {
				displayText = weatherData.temperature.fahrenheit;
			}
			else {
				displayText = "No weather information found"
			}
			document.getElementById("display").textContent = weatherData.temperature.fahrenheit;
		}	
	},
	
	postConditionsImage: function() {
		var imageName;
		var alt;
		if (weatherData.conditions >= 200 && weatherData.conditions <= 531) {
			imageName = "http://res.cloudinary.com/djsd8ajub/image/upload/v1458406747/rain_ls7bw0.png";
			alt = "rain"
		}

		if (weatherData.conditions >= 600 && weatherData.conditions <= 622) {
			imageName = "http://res.cloudinary.com/djsd8ajub/image/upload/v1458406747/snow_c5oswt.png";
			alt = "snow";
		}

		if (weatherData.conditions >= 800 && weatherData.conditions <= 803)  {
			imageName = "http://res.cloudinary.com/djsd8ajub/image/upload/v1458406747/sun_qhdgyh.png";
			alt = "sun";
		}
		
		if (weatherData.conditions === 804) {
			imageName = "http://res.cloudinary.com/djsd8ajub/image/upload/v1458406747/clouds_aguvja.png";
			alt = "clouds";
		}
		
		if (weatherData.conditions >= 701 && weatherData.conditions <= 781) {
			imageName = "http://res.cloudinary.com/djsd8ajub/image/upload/v1458406747/lowVisibility_cr6zii.png";
			alt = "low visibility";
		}
		
		document.getElementById("imageDisplay").setAttribute("src", imageName);
	},
	
	setConsolidatedInfo: function() {
		weatherData.setTemperature();
		weatherData.setConditions();
		place.setCity(weatherData.weatherAPIResponse.name);
	},
	
	postConsolidatedInfo: function() {
		place.postCity();
		weatherData.postTemperature();
		weatherData.postConditionsImage();
	}
}; 


var place = {
	latitude: 0,
	
	longitude: 0,
	
	name: "",
	
	setCity: function(newCity) {
		place.name = newCity;
	},
	
	getCityQuery: function(term) {
		return "q=" + term;
	},
	
	getCity: function() {
		return place.name;
	},
	
	postCity: function() {
		document.getElementById("cityDisplay").textContent = place.name;
	},
	
	setCoordinates: function(position) {
		place.latitude = position.coords.latitude;
		place.longitude = position.coords.longitude;	
	},
	
	getCoordinates: function() {
		return {
			latitude: place.latitude,
			longitude: place.longitude
		};
	},
	
	getCoordinateQuery: function() {
		return "lat=" + place.latitude.toString() + "&lon=" +
		place.longitude.toString();
	}
};

//event listeners
function search() {
	var searchTerm = document.getElementById("location").value;
		
		if (searchTerm.indexOf(" ") !== -1) {
			searchTerm = removeSpaces(searchTerm);
		}
		weatherData.requestWeather(place.getCityQuery(searchTerm));
}

function listenForSearch() {
	document.getElementById("submitLocation").addEventListener("click", search, false);
	window.addEventListener("keypress", function(event) {
		if (event.keyIdentifier === "Enter") {
			search();
		}
	}, false);
}

function listenForScaleChangeRequest() {
	document.getElementById("inlineDisplay").addEventListener("click", 
	function(e) {
		e.target.style.color = "black";
		if (weatherData.temperature.kelvin) {
			if (e.target.id === "cel") {
				document.getElementById("fahr").style.color = "gray";
				weatherData.postTemperature(weatherData.temperature.celsius);
			}
			if (e.target.id === "fahr") {
				document.getElementById("cel").style.color = "gray";
				weatherData.postTemperature(weatherData.temperature.fahrenheit);
			}
		}
	}, false);
}

//main
window.onload = function() {
	navigator.geolocation.getCurrentPosition(function (browserData) {
	place.setCoordinates(browserData);
	weatherData.requestWeather(place.getCoordinateQuery());
	});
	listenForSearch();
	listenForScaleChangeRequest();
};




