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

/**
 * Gets a random quote from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getDailyQuote = async () => {
  const characterLimit = 50;
  // const promise = fetch(`https://api.quotable.io/random?maxLength=${characterLimit}`);
  const promise = fetch('https://api.quotable.io/search/quotes/?query=sunny&limit=50&page=1');
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
  if (dailyWidget.date === undefined || dailyWidget.date !== new Date().toLocaleDateString()) {
    getUnsplashImageByQuery('background').then((response) => {
      if (response && response.urls && response.urls.full) {
        dailyWidget.background.url = response.urls.full;
        dailyWidget.background.owner = response.user.name || 'Unsplash.com';
      } else {
        const TOTAL_IMAGES = 100;
        const random = Math.floor(Math.random() * TOTAL_IMAGES + 1);
        dailyWidget.background.url = `assets/images/backgrounds/dynamic/${random}.jpeg`;
        dailyWidget.background.owner = 'Unsplash.com';
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
      document.getElementById('owner').textContent = dailyWidget.background.owner;
      document.getElementById('time').textContent = dateFormatter.shortTimeText;
      document.getElementById('copyright').textContent = new Date().getFullYear();
    });

    // get daily quote
    getDailyQuote().then((response) => {
      if (response) {
        console.log(response);
        //dailyWidget.quote.content = response.content;
        //dailyWidget.quote.author = response.author;
      } else {
        //dailyWidget.quote.content = 'Empower people and enrich lives.';
        //dailyWidget.quote.author = 'Roche Kollie';
      }
    }).catch((error) => {
      throw new Error(error);
    }).finally(() => {
      dailyWidget.date = new Date().toLocaleDateString();
      saveDailyWidget('dailyWidget', dailyWidget);

      dailyWidget = getDailyWidget(); // get a fresh copy of the database
      document.getElementById('quote').textContent = dailyWidget.quote.content;
      document.getElementById('author').textContent = dailyWidget.quote.author;
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
    document.getElementById('owner').textContent = dailyWidget.background.owner;
    document.getElementById('time').textContent = dateFormatter.shortTimeText;
    document.getElementById('copyright').textContent = new Date().getFullYear();
  }

  console.log(getDailyWidget());
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
