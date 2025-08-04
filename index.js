import { keys } from './kore/keys.js';
import { saveDailyWidget, getDailyWidget, dateFormatter } from './kore/kore.js';

/**
 * Gets a image from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getUnsplashImageByQuery = async (query) => {
  const promise = fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${keys.unsplash.key}`);
  const response = await promise;
  return response.json();
};

// When the content loads,
window.onload = () => {
  // display time
  setInterval(() => {
    document.getElementById('time').textContent = dateFormatter.shortTimeText;
  }, 1000);

  // set up the database.
  let dailyWidget = getDailyWidget();
  // Next, comapre the most recent date in the database with the current date:
  if (dailyWidget.date === undefined || dailyWidget.date !== new Date().toLocaleDateString()) {
    getUnsplashImageByQuery('background').then((response) => {
      if (response && response.urls && response.urls.full) {
        dailyWidget.background.url = response.urls.full;
        dailyWidget.background.photographer = response.user.name || 'Unsplash.com';
      } else {
        const TOTAL_IMAGES = 100;
        const random = Math.floor(Math.random() * TOTAL_IMAGES + 1);
        dailyWidget.background.url = `assets/images/backgrounds/dynamic/${random}.jpeg`;
        dailyWidget.background.photographer = 'Unsplash.com';
      }
    }).catch((error) => {
      throw new Error(error);
    }).finally(() => {
      dailyWidget.date = new Date().toLocaleDateString();
      saveDailyWidget('dailyWidget', dailyWidget);

      dailyWidget = getDailyWidget(); // get a fresh copy of the database
      // loads require data on the page
      document.getElementById('daily-widget').style.backgroundImage = `url(${dailyWidget.background.url})`;
      document.getElementById('day').textContent = dateFormatter.day;
      document.getElementById('month').textContent = dateFormatter.month;
      document.getElementById('date').textContent = dateFormatter.date;
      document.getElementById('city').textContent = dailyWidget.city;
      document.getElementById('temperature').textContent = dailyWidget.temperature;
      document.getElementById('weather').textContent = dailyWidget.weather;
      document.getElementById('photographer').textContent = dailyWidget.background.photographer;
      document.getElementById('time').textContent = dateFormatter.shortTimeText;
      document.getElementById('copyright').textContent = new Date().getFullYear();
    });
  } else {
    // loads the data from the database
    dailyWidget = getDailyWidget(); // get a fresh copy of the database
    // loads require data on the page
    document.getElementById('daily-widget').style.backgroundImage = `url(${dailyWidget.background.url})`;
    document.getElementById('day').textContent = dateFormatter.day;
    document.getElementById('month').textContent = dateFormatter.month;
    document.getElementById('date').textContent = dateFormatter.date;
    document.getElementById('city').textContent = dailyWidget.city;
    document.getElementById('temperature').textContent = dailyWidget.temperature;
    document.getElementById('weather').textContent = dailyWidget.weather;
    document.getElementById('photographer').textContent = dailyWidget.background.photographer;
    document.getElementById('time').textContent = dateFormatter.shortTimeText;
    document.getElementById('copyright').textContent = new Date().getFullYear();
  }

  console.log(getDailyWidget());
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
