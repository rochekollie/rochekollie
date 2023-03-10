import {render} from './modules/render.js';

//'use strict';

const getDate = (locales, spelling, flag) => {
  const d = new Date();
  let isLongSpelling = false;
  if (spelling === 'long') {
    isLongSpelling = true;
  }
  return {
    seconds: d.getSeconds(),
    minutes: d.getMinutes(),
    hour: d.getHours(),
    dayNameLong: d.toLocaleString('default', {weekday: 'long'}),
    dayNameShort: d.toLocaleString('default', {weekday: 'short'}),
    dateNumber: d.getDate(),
    monthNameLong: d.toLocaleString('default', {month: 'long'}),
    monthNameShort: d.toLocaleString('default', {month: 'short'}),
    year: d.getFullYear(),
    meridian: d.getHours() >= 12 ? 'PM' : 'AM',
    timeText: d.toLocaleTimeString(`${locales}`, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    dateText: d.toLocaleDateString(`${locales}`, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

/**
 * Saves given data to the local storage.
 * @param key  - the key to save the data to.
 * @param data - the data to save.
 */
const setItem = (key, data) => localStorage.setItem(key, data);

/**
 * Retrieves data from the local storage.
 * @param key - the key to retrieve the data from.
 * @returns {object} - the data retrieved from the local storage.
 */
const getItem = (key) => localStorage.getItem(key);

/**
 * Runs a given function at the interval of a given time in milliseconds.
 * @param interval - The interval in to run the given callback function.
 * @param callback - The callback function to run at every interval.
 */
const setTimeInterval = (callback, interval) => {
  setInterval(() => {
    callback();
  }, interval);
};

// get the user location and set the language to the user location
const clientLocationLanguage = navigator.language || 'en-US';

setTimeInterval(() => {
  const date = document.getElementById('date');
  const time = document.getElementById('time');
  try {
    date.textContent = getDate(clientLocationLanguage).dateText;
    time.textContent = getDate(clientLocationLanguage).timeText;
  } catch (error) {
    console.log(error);
  }
}, 1000);

/**
 * Gets a random quote from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getDailyQuote = () => {
  const characterLimit = 50;
  fetch(`https://api.quotable.io/random?maxLength=${characterLimit}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        render(quoteElement, data.content);
        setItem('quote', data.content);
        render(quoteAuthor, data.author);
        setItem('author', data.author);
      });
};

/**
 * Checks if the current date is the same as the date saved in the local storage.
 * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
 */
const dateIsToday = () => {
  const currentDate = getDate('en-US', 'long').dateNumber;
  const savedDate = getItem('dateNumber');
  return currentDate === parseInt(savedDate, 10);
};

const TOTAL_IMAGES = 100;

const randomNumber = Math.floor(Math.random() * TOTAL_IMAGES + 1);
const image = `assets/images/backgrounds/${randomNumber}.jpeg`;
const landingPage = document.querySelector('#landing-page');

const quoteElement = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');

// // if the date changes, update the page
// if (!dateIsToday()) {
//   render(landingPage, image);
//   setItem('dateNumber', getDate().dateNumber);
//   setItem('backgroundImage', image);
//   getDailyQuote();
// } else {
//   const image = getItem('backgroundImage');
//   const quote = getItem('quote');
//   const author = getItem('author');
//   render(landingPage, image);
//   render(quoteElement, quote);
//   render(quoteAuthor, author);
// }
