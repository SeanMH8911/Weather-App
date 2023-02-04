const API_KEY = "c6435a9252a0b2f7bedbee360a9df901";
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const todayContainer = document.getElementById("today");
let todayContent = document.createElement("div");
const forecast = document.getElementById("forecast");
const historyContainer = document.getElementById("history");
const data = localStorage.getItem("city-data");
let cityData = data ? JSON.parse(data) : [];
const errorMsgCont = document.querySelector(".error-msg");
const clearHistory = document.getElementById("clear-history");
todayContent.setAttribute("class", "todayContent");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  todayContainer.innerHTML = "";
  forecast.innerHTML = "";
  clearItem();
  let city = searchInput.value.trim();
  if (city) {
    getCity(city);
    searchInput.value = "";
    storeCity(city);
  } else {
    errorMsg();
  }
});

async function getCity(city) {
  let res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );
  if (res.status === 200) {
    errorMsgCont.classList.add("hide");
    let data = await res.json();
    let lon = data[0].lon;
    let lat = data[0].lat;
    getData(lat, lon);

    cityHistory();
  } else {
    errorMsg();
  }
}
function errorMsg() {
  errorMsgCont.classList.remove("hide");
}

async function getData(lat, lon) {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  let data = await res.json();
  createTodayContent(data);
  createForecast(data);
}

function createTodayContent(data) {
  todayContent.innerHTML += `
  <div class="d-flex align-items-center ">
    <h2>${data.city.name} (${data.city.country})</h2>
    <img 
        src=${getImageUrl(data.list[0].weather[0].icon)}
        alt="${data.list[0].weather[0].description}"></img>
  </div>
    <h4 class="mb-4">${dayjs().format("dddd D MMM YYYY")}</h4>
    <p>Temperature: ${Math.floor(data.list[0].main.temp)}&degc</p>
    <p>Humidity: ${data.list[0].main.humidity}%</p>
    <p>Wind Speed: ${Math.floor(data.list[0].wind.speed)} KPH</p>
  `;
  todayContainer.appendChild(todayContent);
}
function createForecast(data) {
  let today = dayjs().format("D");
  for (var i = 0; i < data.list.length; i++) {
    let day = data.list[i];
    let futureDay = dayjs(day.dt_txt).format("D");
    let dayTime = dayjs(day.dt_txt).format("HH:mm");
    let fixedTime = "12:00";
    if (futureDay > today) {
      if (futureDay == +today + 1) {
        if (dayTime === fixedTime) {
          createForecastData(day);
        }
      }
      if (futureDay == +today + 2) {
        if (dayTime === fixedTime) {
          createForecastData(day);
        }
      }
      if (futureDay == +today + 3) {
        if (dayTime === fixedTime) {
          createForecastData(day);
        }
      }
      if (futureDay == +today + 4) {
        if (dayTime === fixedTime) {
          createForecastData(day);
        }
      }
      if (futureDay == +today + 5) {
        if (dayTime === fixedTime) {
          createForecastData(day);
        }
      }
    }
  }
  // });
}

function clearItem() {
  todayContent.innerHTML = "";
}
function getImageUrl(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
}

function storeCity(city) {
  let newCity = {
    name: city,
  };
  cityData.push(newCity);
  localStorage.setItem("city-data", JSON.stringify(cityData));
}

function cityHistory() {
  let cityHistory = JSON.parse(localStorage.getItem("city-data")) || [];
  if (cityHistory.length > 0) {
    clearHistory.classList.remove("hide");
    historyContainer.innerHTML = "";
    forecast.innerHTML = "";
    historyContainer.innerHTML += cityHistory
      .map(
        (cityName) =>
          `<button id="cityBtn" data-id="${
            cityName.name
          }" class="btn btn-secondary mt-2 mb-2">${upperCase(
            cityName.name
          )}</button>`
      )
      .join("");

    for (let i = 0; i < cityBtn.length; i++) {
      let eachBtn = cityBtn[i];
      let dataId = eachBtn.dataset.id;
      eachBtn.addEventListener("click", () => {
        clearItem();
        getCity(dataId);
      });
    }
  }
}
cityHistory();

function upperCase(city) {
  let firstChar = city.charAt(0).toUpperCase();
  let remWord = city.slice(1);
  return firstChar + remWord;
}

function createForecastData(day) {
  forecast.innerHTML += `
  <div class="col-lg-2 forecastCard">
    <div class="d-flex flex-column align-items-center ">
    <img
        src=${getImageUrl(day.weather[0].icon)}
        alt="${day.weather[0].description}"></img> 
    <h5 class="mb-4">${dayjs(day.dt_txt).format("ddd D MMM")}</h5>
    <p>Temperature: ${Math.floor(day.main.temp)}&degc</p>
    <p>Humidity: ${day.main.humidity}%</p>
    </div>
  </div>
  `;
}

clearHistory.addEventListener("click", () => {
  window.localStorage.clear("city-data");
  cityData = [];
  historyContainer.innerHTML = "";
  clearHistory.classList.add("hide");
});
console.log(cityData);
