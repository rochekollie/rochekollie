import { keys } from './kore/keys.js';
import { saveDatabase, getDatabase, dateFormatter } from './kore/kore.js';

/**
 * Checks if the current date is the same as the date saved in the local storage.
 * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
 */
const isNewDay = (date) => date !== new Date().toLocaleDateString();

/**
 * Gets a imagefrom the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getUnsplashImageByQuery = async (query) => {
  const promise = fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${keys.unsplash.key}`);
  const response = await promise;
  return response.json();
};

// When the content loads,
window.onload = () => {
  // set up the database.
  let database = getDatabase('koreDb');
  // Next, comapre the most recent date in the database with the current date:
  if (database.date === undefined || isNewDay(database.date)) {
    // If the most recent date in database is today is older than today,
    // get a new background image usign Unsplash API for today
    getUnsplashImageByQuery('background').then((response) => {
      console.log(response);
      if (response && response.urls && response.urls.full) {
        // if the the request is successful, save the image in the database
        database.background.url = response.urls.full;
        database.background.photographer = response.user.name;
      } else {
        // if the request fails, save a local image in the database
        const TOTAL_IMAGES = 100;
        const random = Math.floor(Math.random() * TOTAL_IMAGES + 1);
        database.backgroundImage = `assets/images/backgrounds/dynamic/${random}.jpeg`;
      }
    }).catch((error) => {
      throw new Error(error);
    }).finally(() => {
      // finally update the database and save the records
      database.date = new Date().toLocaleDateString();
      saveDatabase('koreDb', database);

      database = getDatabase('koreDb'); // get a fresh copy of the database
      // loads require data on the page
      document.getElementById('daily-widget').style.backgroundImage = `url(${database.background.url})`;
      document.getElementById('day').textContent = dateFormatter.day;
      document.getElementById('month').textContent = dateFormatter.month;
      document.getElementById('date').textContent = dateFormatter.date;
      document.getElementById('city').textContent = database.city;
      document.getElementById('temperature').textContent = database.temperature;
      document.getElementById('weather').textContent = database.weather;
      document.getElementById('photographer').textContent = database.background.photographer;
      document.getElementById('copyright').textContent = new Date().getFullYear();

      console.log(database)
    });
  } else {
    // loads the data from the database
    database = getDatabase('koreDb');
  }
};

/**
 * Gets a random quote from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getDailyQuote = async () => {
  const characterLimit = 50;
  const promise = fetch(`https://api.quotable.io/random?maxLength=${characterLimit}`);
  const response = await promise;
  return await response.json();
};

const logo = document.getElementById('logo');
// logo.addEventListener('mouseleave', () => {
//   logo.classList.add('reverse-spin');
// });

// stay the nav link active when the link is clicked
const navLinks = document.querySelectorAll('nav ul li a');

// navLinks.forEach((link) => {
//   link.addEventListener('click', () => {
//     navLinks.forEach((link) => {
//       link.classList.remove('active');
//     });
//     link.classList.add('active');
//   });
// });

// style the form text fields controls as the state changes
const textControls = document.querySelectorAll('input, textarea');
textControls.forEach((control) => {
  control.addEventListener('blur', () => {
    if (control.value !== '') {
      control.classList.add('filled');
    } else {
      control.classList.remove('filled');
    }
  });
});
