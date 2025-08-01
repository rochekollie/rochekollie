import { koreDb } from './kore/kore.js';

const dailyWidget = document.getElementById('daily-widget');
const day = document.getElementById('day');
const month = document.getElementById('month');
const date = document.getElementById('date');
const city = document.getElementById('city');
const temperature = document.getElementById('temperature');
const weather = document.getElementById('weather');
const time = document.getElementById('time');
const quote = document.getElementById('quote');
const author = document.getElementById('author');

/**
 * Checks if the current date is the same as the date saved in the local storage.
 * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
 */
const isNewDay = (dateNumber) => new Date().getDate() !== parseInt(dateNumber, 10);

window.onload = () => {
  const db = koreDb.read('__01db17__');
  console.log('DB says: ', db);
  // if the date changes, fetch new quote and background image
  if (isNewDay(db.dateNumber)) {
    // const dailyImage = getDailyImage().then((response) => {
    //   return { photographer, image } = response;
    // });
    // const dailyQuote = getDailyQuote().then((response) => {
    //     return { author, content } = response;
    // });

    // Get a random daily
    const TOTAL_IMAGES = 100;
    const randomNumber = Math.floor(Math.random() * TOTAL_IMAGES + 1);
    const backgroundImage = `assets/images/backgrounds/dynamic/${randomNumber}.jpeg`;

    dailyWidget.style.backgroundImage = `url(${backgroundImage})`;

    // Save the widget to the database widgets
    koreDb.write('__01db17__', db);
  } else {
    const db = koreDb.read();
    // Dislay the data from storage
    dailyWidget.src = db.backgroundImage;
  }
};

try {
  // dateComponent.textContent = dailyWidget.longDateText;
  // timeComponent.textContent = dailyWidget.shortTimeText;

  // Set copyright year here
  document.getElementById('copyright').textContent = new Date().getFullYear();
} catch (error) {
  console.log(error);
}

// Update the date and time every second

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

/**
 * Gets a imagefrom the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
const getDailyImage = async () => {
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

// style the filled form input and textarea border color when the input loses focus and the input is not empty
const formInputs = document.querySelectorAll('input, textarea');

formInputs.forEach((input) => {
  input.addEventListener('blur', () => {
    if (input.value !== '') {
      input.classList.add('filled');
    } else {
      input.classList.remove('filled');
    }
  });
});
