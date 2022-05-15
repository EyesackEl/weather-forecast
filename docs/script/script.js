var userInput = document.getElementById('cityInput');
var cityNameEl = document.getElementById('dayOfCity');
var foreRowEl = document.getElementById('foreRow')

//Renders the day-of weather data for selected citys
function renderCurrent(currentRes) {

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

    $('#dayOfUv').removeClass();
    if (nowUv <= 3.75) {
        $('#dayOfUv').addClass('bg-success')
    } else if (nowUv <= 7) {
        $('#dayOfUv').addClass('bg-warning')
    } else {
        $('#dayOfUv').addClass('bg-danger')
    }
}

// Renders each of the 5 day forecast cards
function renderForecast(forecastRes, i) {

    var foreWrapEl = document.createElement('div');
    foreWrapEl.classList.add('col');

    var foreCardEl = document.createElement('div');
    foreCardEl.classList.add('foreday', 'forecast-bdr', 'px-2');

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

//Called whenever a different city's weather is rendered, also handles local storage formatting
function renderSearchHist (name) {

    var histListEl = $('#histList');
    
    var histWrap = document.createElement('div');
    histWrap.classList.add('searchHist');

    var histEl = document.createElement('strong');
    histEl.style.pointerEvents = 'none'
    $(histEl).text(name);

    histWrap.append(histEl);
    
    histListEl.prepend($(histWrap));

    var histElArray = Array.from(document.querySelectorAll('.searchHist'));
    //Keeps search history to 5 results or less
    if (histElArray.length >= 6 ) {
        $(histElArray[5]).remove();
        console.log('too long')
    }

    //Setting the local storage to an array so I can reuse code from aboves
    var histElArrayTxt = []

    //Pulls array values only from what is actively rendered
    for (i = 0; i < histElArray.length; i++) {
        histElArrayTxt.push((histElArray[i]).innerText)
    }

    localStorage.setItem('searchHistory', JSON.stringify(histElArrayTxt));
}

//Called only when page loads initially to handle displaying locally stored search history
function renderStoredSearchHist(storedHist) {
    var histListEl = $('#histList');
    
    var histWrap = document.createElement('div');
    histWrap.classList.add('searchHist');

    var histEl = document.createElement('strong');
    histEl.style.pointerEvents = 'none'
    $(histEl).text(storedHist);

    histWrap.append(histEl);
    
    histListEl.append($(histWrap));

    var histElArray = Array.from(document.querySelectorAll('.searchHist'));
    if (histElArray.length >= 6 ) {
        $(histElArray[5]).remove();
    }

}

// Uses the previously fetched longitude and latitude to fetch current and forecasted weather
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
            // Clears the previous forecast cards before rendering a new forecast
            $(foreRowEl).empty();
            for (var i = 1; i < 6; i++) {
                renderForecast(weatherRes.daily[i], i);
            }
        })
}

// Fetches longitude and latitude of user inputted city
function getLocation(searchCity) {
    var geoQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct'
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
            var cityName = geoRes[0].name;
            cityNameEl.textContent = cityName;
            getWeather(geoRes[0].lon, geoRes[0].lat);
            renderSearchHist(cityName);
        })
}

// Called when a user enters a new city and submits the form
function handleSearchSubmit(event) {
    event.preventDefault();
    var searchCity = userInput.value;
    userInput.value = "";
    if (!searchCity) {
        alert("Please Enter a City Name");
        return;
    }
    getLocation(searchCity);
}

// Called when user clicks on a 
function handleHistQuery(target) {
    getLocation(target.target.children[0].innerText)
}

// Runs when page is loaded to render locally saved search history if there is any
function init() {
    if (!localStorage.getItem('searchHistory')) {
        var storedHist = [];
    } else {
        var storedHist = JSON.parse(localStorage.getItem('searchHistory'));
    }

    for (i = 0; i < storedHist.length; i++) {
        renderStoredSearchHist(storedHist[i]);
    }
}

init();

$(document).on('click', '.searchHist', handleHistQuery)

$('#searchForm').submit(handleSearchSubmit);

$('#currentDay').text(moment().format('MMMM Do YYYY'));