var userInput = document.getElementById('cityName');
var cityNameEl = document.getElementById('dayOfCity');
var foreRowEl = document.getElementById('foreRow')

function renderCurrent(currentRes) {
    // console.log(currentRes);

    var nowIcon = currentRes.weather[0].icon;
    $('#dayOfIcon').attr('src', 'http://openweathermap.org/img/wn/' + nowIcon + '.png')

    var nowTemp = Math.trunc(currentRes.temp) + '°' ;
    $('#dayOfTemp').text('Temperature: ' + nowTemp);

    var nowWind = currentRes.wind_speed + ' MPH';
    $('#dayOfWind').text('Wind Speed: ' + nowWind);

    var nowHumid = currentRes.humidity + '%';
    $('#dayOfHumid').text('Humidity: ' + nowHumid);

    var nowUv = currentRes.uvi;
    $('#dayOfUv').text('UV Index: ' + nowUv);

    if (nowUv <= 3.75) {
        $('#dayOfUv').addClass('bg-success')
    } else if (nowUv <= 7) {
        $('#dayOfUv').addClass('bg-warning')
    } else {
        $('#dayOfUv').addClass('bg-danger')
    }
}

function renderForecast(forecastRes, i) {
    // console.log(forecastRes);

    var foreWrapEl = document.createElement('div');
    foreWrapEl.classList.add('col');

    var foreCardEl = document.createElement('div');
    foreCardEl.classList.add('foreday', 'bdr');

    foreWrapEl.append(foreCardEl);

    var foreDateEl = document.createElement('h5');
    $(foreDateEl).text(moment().add(i, 'd').format('M/D/YY'));

    var foreIconEl = document.createElement('img');
    var foreIcon = forecastRes.weather[0].icon;
    $(foreIconEl).attr('src', 'http://openweathermap.org/img/wn/' + foreIcon + '.png')

    var foreTempEl = document.createElement('p');
    var foreTemp = forecastRes.feels_like.eve + '°' ;
    $(foreTempEl).text('Temp: ' + foreTemp);

    var foreWindEl = document.createElement('p');
    var foreWind = forecastRes.wind_speed + ' MPH';
    $(foreWindEl).text('Wind: ' + foreWind)

    var foreHumidEl = document.createElement('p');
    var foreHumid = forecastRes.humidity + '%';
    $(foreHumidEl).text('Humidity: ' + foreHumid);

    foreCardEl.append(foreDateEl, foreIconEl, foreTempEl, foreWindEl, foreHumidEl);
    foreRowEl.append(foreWrapEl);

}

function getWeather(cityLon, cityLat) {
    var weatherQueryUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    weatherQueryUrl = weatherQueryUrl + '?lat=' + cityLat + '&lon=' + cityLon + '&exclude=minutely,hourly,alerts&units=imperial&appid=836b3a2ed43f3d15d6aeaefa85257ac2'
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
            renderCurrent(weatherRes.current);
            $(foreRowEl).empty();
            for (var i = 1; i < 6; i++) {
                renderForecast(weatherRes.daily[i], i);
            }
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
            // console.log(geoRes);
            cityNameEl.textContent = geoRes[0].name;
            var cityLon = geoRes[0].lon;
            var cityLat = geoRes[0].lat;
            getWeather(cityLon, cityLat);
            addToHist(geoRes[0].name)
            
        })
}

function handleSearchSubmit(event) {
    event.preventDefault();
    var searchCity = userInput.value
    if (!searchCity) {
        alert("Please Enter a City Name");
        return;
    }
    getLocation(searchCity);
}

function handleHistQuery(target) {
    getLocation(target.target.children[0].innerText)
}

function addToHist (name) {

    var histListEl = $('#histList');
    var histArray = Array.from(document.querySelectorAll('.searchHist'));

    var histWrap = document.createElement('div');
    histWrap.classList.add('searchHist');

    var histEl = document.createElement('strong');
    histEl.style.pointerEvents = 'none'
    $(histEl).text(name);

    histWrap.append(histEl);
    
    histListEl.prepend($(histWrap));

    if (histArray.length > 3 ) {
        $(histArray[3]).remove();
    }


}

function init() {

}

init();

$(document).on('click', '.searchHist', handleHistQuery)

$('#searchForm').submit(handleSearchSubmit);

$('#currentDay').text(moment().format('MMMM Do YYYY'));