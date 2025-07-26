import { dailyWidget} from './modules/dailyWidget.js';

const dateComponent = document.getElementById('date-component');
const timeComponent = document.getElementById('time-component');


// preload the date and time
window.onload = function () {

  //if the date changes, update the page
if (isNewDay()) {
  const TOTAL_IMAGES = 100;
  const randomNumber = Math.floor(Math.random() * TOTAL_IMAGES + 1);
  const backgroundImage = `assets/images/backgrounds/dynamic/${randomNumber}.jpeg`;

  // load the background image
  imageElement.src = backgroundImage;
  saveLocalStorage('dateNumber', dailyWidget.dateNumber);
  saveLocalStorage('backgroundImage', backgroundImage);

  getDailyQuote().then((response) => {
    const { author, content } = response;
    quoteElement.textContent = content;
    quoteAuthor.textContent = author;
    saveLocalStorage('quote', content);
    saveLocalStorage('author', author);
  });
} else {
  const backgroundImage = getLocalStorage('backgroundImage');
  const quote = getLocalStorage('quote');
  const author = getLocalStorage('author');
  imageElement.src = backgroundImage;
  quoteElement.textContent =  quote;
  quoteAuthor.textContent = author;
}


  try {
    dateComponent.textContent = dailyWidget.longDateText;
    timeComponent.textContent = dailyWidget.shortTimeText;

    // Set copyright year here
    document.getElementById('copyright').textContent = new Date().getFullYear();

  } catch (error) {
    console.log(error);
  }

  
};

// Update the date and time every second
setInterval(() => {
  try {
    // Update the date object within the dailyWidget
    dailyWidget._date = new Date(); 
    dateComponent.textContent = dailyWidget.shortDateText;
    timeComponent.textContent = dailyWidget.shortTimeText;
  } catch (error) {
    console.log(error);
  }
}, 1000);


/**
 * Saves given data to the local storage.
 * @param key  - the key to save the data to.
 * @param data - the data to save.
 */
const saveLocalStorage = (key, data) => localStorage.setItem(key, data);

/**
 * Retrieves data from the local storage.
 * @param key - the key to retrieve the data from.
 * @returns {object} - the data retrieved from the local storage.
 */
const getLocalStorage = key => localStorage.getItem(key);

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
 * Checks if the current date is the same as the date saved in the local storage.
 * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
 */
const isNewDay = () => dailyWidget.dateNumber !== parseInt(getLocalStorage('dateNumber'), 10);


const imageElement = document.getElementById('daily-background');
const quoteElement = document.getElementById('quote-component');
const quoteAuthor = document.getElementById('author-component');



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