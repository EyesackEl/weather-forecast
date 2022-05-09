var userInput = document.getElementById('cityName');
var cityNameEl = document.getElementById('dayOfCity');
// var iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';

function renderWeather(weatherRes) {
    console.log(weatherRes);

    var nowTemp = Math.trunc(weatherRes.current.temp) + '°' ;
    $('#dayOfTemp').text('Temperature: ' + nowTemp);

    var nowWind = weatherRes.current.wind_speed + ' MPH';
    $('#dayOfWind').text('Wind Speed: ' + nowWind);

    var nowHumid = weatherRes.current.humidity + '%';
    $('#dayOfHumid').text('Humidity: ' + nowHumid);

    var nowUv = weatherRes.current.uvi;
    $('#dayOfUv').text('UV Index: ' + nowUv);
}

function getWeather(userLon, userLat) {
    var weatherQueryUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    weatherQueryUrl = weatherQueryUrl + '?lat=' + userLat + '&lon=' + userLon + '&exclude=minutely,hourly,alerts&units=imperial&appid=836b3a2ed43f3d15d6aeaefa85257ac2'
    fetch(weatherQueryUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
                return;
            }
        })
        .then(function (weatherRes) {
            renderWeather(weatherRes);
        })
}

function getLocation(searchCity) {
    var geoQueryUrl = 'http://api.openweathermap.org/geo/1.0/direct'
    var geoQueryUrl = geoQueryUrl + '?q=' + searchCity + '&appid=836b3a2ed43f3d15d6aeaefa85257ac2';
    fetch(geoQueryUrl)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
                return;
            }
        })
        .then(function (geoRes) {
            console.log(geoRes);
            console.log(geoRes[0].name, moment().format('MMMM Do YYYY'))
            $("#dayOfCity").text(geoRes[0].name, moment().format('MMMM Do YYYY'));
            cityNameEl.textContent = geoRes[0].name;
            var userLon = geoRes[0].lon;
            var userLat = geoRes[0].lat;
            getWeather(userLon, userLat);
        })
}

function handleSearchSubmit(event) {
    event.preventDefault();
    var searchCity = userInput.value.replaceAll(" ", "");
    if (!searchCity) {
        alert("Please Enter a City Name");
        return;
    }
    getLocation(searchCity);
}
$('#searchForm').submit(handleSearchSubmit);
