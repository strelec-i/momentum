const time = document.querySelector('.time-am');
const dayMonth = document.querySelector('.day-of-month');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const focus = document.querySelector('.focus');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.wind-speed');
const mainHumidity = document.querySelector('.main-humidity');
const weatherDescription = document.querySelector('.description');
const city = document.querySelector('.city');
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');
const buttonQuote = document.querySelector('.other-quote');

const daysWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const imagesUrl = getImagesUrl(9);

let buttonNext = document.querySelector('.next-image');
let currentHour;
let currentNumberBg = new Date().getHours();

function getImagesUrl(countImages = 6) {
  let timesOfDay = ['night', 'morning', 'day', 'evening'];
  let imagesUrl = timesOfDay.map( item => {
    let array = [];
    for (let i = 1; i <= countImages; i++) {
      array.push(`assets/images/${item}/${i > 9 ? '': '0'}${i}.jpg`);
    }
    return shuffle(array).slice(0, 6);
  });

  return [].concat(...imagesUrl);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function showTime(date) { 
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;  
}

function addZero(n) { return (parseInt(n, 10) < 10 ? '0' : '') + n; }

function setBackground(src) {
  const img = document.createElement('img'); 

  img.src = src;
  img.onload = () => {      
    document.body.style.backgroundImage = `url(${src})`;
  };   
}

function setGreet(date) {   
  let month = date.getMonth();
  let day = date.getDay();
  let number = date.getDate();
  let hour = date.getHours();
  
  currentHour = hour;    
  dayMonth.innerHTML = `${daysWeek[day]}<span>, </span>${number}<span> </span>${months[month]}`;  

  if (hour >= 6 && hour < 12) {
    greeting.textContent = 'Good Morning, ';
  } else if (hour >= 12 && hour < 18) {
    greeting.textContent = 'Good Day, ';
  } else if (hour >= 18 && hour < 24 ) {
    greeting.textContent = 'Good Evening, ';
  } else {
    greeting.textContent = 'Good Night, ';
  }
}

function updateInfo() {
  let today = new Date(); 
  let hour = today.getHours() === 24 ? 0 : today.getHours();

  showTime(today);

  if (currentHour !== today.getHours()) {
    setGreet(today);
    setBackground(imagesUrl[hour]);
  }

  setTimeout(updateInfo, 1000);
}

function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

function setName(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else if (e.target.innerText.trim() === '') {
    name.textContent = localStorage.getItem('name') === null
      ? '[Enter Name]'
      : localStorage.getItem('name');
  } else {
    localStorage.setItem('name', e.target.innerText);
  }
}

function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

function setFocus(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('focus', e.target.innerText);
      focus.blur();
    }
  } else if (e.target.innerText.trim() === '') {
    focus.textContent = localStorage.getItem('focus') === null
      ? '[Enter Focus]'
      : localStorage.getItem('focus');
  } else {
    localStorage.setItem('focus', e.target.innerText);
  }
}

function changeBackground() {
  currentNumberBg = currentNumberBg + 1 < 24
    ? currentNumberBg + 1
    : 0;
  setBackground(imagesUrl[currentNumberBg]);
  buttonNext.disabled = true;
  setTimeout(function() { buttonNext.disabled = false }, 1000);
}

function getCity() {
  if (localStorage.getItem('city') === null) {
    city.textContent = 'Minsk';
  } else {
    city.textContent = localStorage.getItem('city');
  }
}

function setCity(e) {
  if (e.code === 'Enter' || e.type === 'blur') {
    if (e.target.innerText.trim() === '') {
      city.textContent = localStorage.getItem('city') === null
        ? 'Minsk'
        : localStorage.getItem('city');
      city.blur();
    } else {
      localStorage.setItem('city', e.target.innerText);
      getWeather();
      city.blur();
    }
  }
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=4ce08b24d7a583344bff7ce65535559d&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok) {
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    windSpeed.textContent = `Wind speed ${data.wind.speed}m/s`;
    mainHumidity.textContent = `Main humidity ${data.main.humidity}%`;
    weatherDescription.textContent = data.weather[0].description;
  } else {
    weatherIcon.className = 'weather-icon owf';
    city.textContent = 'City not found';
    temperature.textContent = '?';
    windSpeed.textContent = '?';
    mainHumidity.textContent = '?';
    weatherDescription.textContent = '?';
  }
}

async function getQuote() {  
  const url = 'https://type.fit/api/quotes';
  const res = await fetch(url);
  const data = await res.json(); 
  let random = getRandomInt(0, data.length);

  blockquote.textContent = data[random].text;
  figcaption.textContent = data[random].author;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

name.addEventListener('click', () => name.textContent = '');
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('click', () => focus.textContent = '');
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
city.addEventListener('click', () => city.textContent = '');
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
buttonNext.addEventListener('click', changeBackground);
buttonQuote.addEventListener('click', getQuote);
document.addEventListener('DOMContentLoaded', getWeather);
document.addEventListener('DOMContentLoaded', getQuote);

updateInfo();
getName();
getFocus();
getCity();
