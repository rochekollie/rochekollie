/**
 * Fetches data from the given url and returns it as a JSON object or text
 * @param url - the url to fetch data from
 * @param application - the application type of the data to fetch
 * @returns {Promise<any|string>} - the data fetched from the url
 */
export const fetchData = async (url, application) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.status.toString());
  if (application === 'json') {
    return response.json();
  } if (application === 'text') {
    return response.text();
  }
};

export const dateFormatter = {
  get date() {
    return new Date().getDate();
  },

  get day() {
    return new Date().toLocaleString(undefined, { weekday: 'long' });
  },

  get month() {
    return new Date().toLocaleString(undefined, { month: 'long' });
  },

  get year() {
    return new Date().getFullYear();
  },

  get meridian() {
    return new Date().getHours() >= 12 ? 'PM' : 'AM';
  },

  get time() {
    return new Date().toLocaleTimeString();
  },

  get monthNumber() {
    return new Date().getMonth() + 1;
  },

  get dateText() {
    return new Date().toLocaleDateString();
  },

  get shortDay() {
    return new Date().toLocaleString(undefined, { weekday: 'short' });
  },

  get shortMonth() {
    return new Date().toLocaleString(undefined, { month: 'short' });
  },

  get shortYear() {
    return parseInt(new Date().toLocaleString(undefined, { year: '2-digit' }), 10);
  },

  get shortDateText() {
    return new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  },

  get longDateText() {
    return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  },

  get shortTimeText() {
    return new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
  },

  get longTimeText() {
    return new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' });
  },
};

/**
   * Saves given data to the local storage.
   * @param widgetName  - the key to save the data to.
   * @param widget - the data to save.
  */
export const saveDailyWidget = (widgetName, widget) => {
  localStorage.setItem(widgetName, JSON.stringify(widget));
};

/**
 * Returns the daily widget data from the local storage.
 * If the data does not exist, it is created with default values.
 * @returns {object} - the data retrieved from the local storage.
 */
export const dailyWidget = {
  date: '',
  background: {
    url: '',
    owner: '',
  },
  quote: {
    content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    author: 'Winston Churchill',
    keywords: [],
  },
  theme: {
    options: ['auto', 'light', 'dark'],
    appearance: '',
  },
};

/**
 * Returns the daily widget data from the local storage.
 * If the data does not exist, it is created with default values.
 * @returns {object} - the data retrieved from the local storage.
 */
export const getDailyWidget = () => {
  const widget = localStorage.getItem('dailyWidget');
  if (widget) {
    return JSON.parse(widget);
  }
  return dailyWidget;
};

/**
 * Gets a image from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
export const getDailyImage = async (query) => {
  try {
    const promise = fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${keys.unsplash.key}`);
    const response = await promise;

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      // You can also check response.statusText for more details
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('An error occurred while fetching the image:', error);
    throw error; // Re-throw the error or handle it appropriately
  }
};

/**
 * Gets a random quote from the API and returns the data in a JSON format.
 * @returns {Promise<Response>} - the data in a JSON format.
 */
export const getDailyQuote = async () => {
  const promise = fetch('http://api.quotable.io/search/quotes/?query=love&limit=50&page=1');
  const response = await promise;
  return response.json();
};

export const getRandomElement = (array) => {
  // Check if the array is empty
  if (!array || array.length === 0) {
    return undefined; // or throw an error, or return a default value
  }
  const randomIndex = Math.floor(Math.random() * array.length); // Added check for empty array
  return array[randomIndex];
};

/**
 * Set active link in navigation bar
 * @param {*} links - array of links
 * @returns {void} - void
 */
export const setActiveLink = (links) => {
  // Remove the active class from all links
  links.forEach((link) => {
    link.classList.remove('active');
  });

  // Add the active class to the clicked link
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
};

/**
 * Generate a random hex color
 * @returns {string} - hex color
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i + 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Generate a random hex color
 * @param {*} hexColor  - hex color
 * @returns  - text color
 */
export const getContrastYIQ = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

export const mergeSort = (a, b) => {
  const result = [];
  let i = 0; // index of a
  let j = 0; // index of b
  while (i < a.length && j < b.length) { // while both arrays have elements
    if (a[i] < b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    result.push(a[i]);
    i++;
  }
  while (j < b.length) {
    result.push(b[j]);
    j++;
  }
  return result;
};

// const toggleBrand = document.getElementById('developer-name-wrapper');
//
// window.addEventListener('DOMContentLoaded', () => {
//   // get the scroll position
//   const landingPage = document.querySelector('#landing-page').scrollHeight;
//   const scrollDownButton = document.querySelector('#scroll-down-button');
//
//   scrollDownButton.addEventListener('click', () => {
//     window.scrollTo({
//       top: landingPage,
//       left: 0,
//       behavior: 'smooth',
//     });
//   });
//
// });
// const scrollPositionY = window.scrollY;
// if (scrollPositionY > 0) {
//   toggleBrand.style.display = 'none';
// }

//   console.log('The current scroll position is ' + scrollPositionY);
// });
