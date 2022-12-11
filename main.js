/* jshint esversion: 8 */
(function () {
  "use strict";

  const today = {
    date() {
      return new Date();
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    year() {
      return this.date().getFullYear();
    },
    month() {
      return this.months[this.date().getMonth()];
    },
    day() {
      return this.weekdays[this.date().getDay()];
    },
    dateNumber() {
      return this.date().getDate();
    },
    time() {
      let meridian = "";
      let hours = this.date().getHours();
      let minutes = this.date().getMinutes();

      if (hours > 12) {
        meridian = "PM";
      } else if (hours < 10) {
        meridian = "AM";
        hours = "0" + hours;
      } else if (hours === 12) {
        meridian = "PM";
      } else {
        meridian = "AM";
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return hours + ":" + minutes + " " + meridian;
    }
  };

  /**
   * Display an HTML text content within a specified HTML parent container element.
   * @param view the HTML parent container
   * @param data the text content to display
   * */
  const updateView = (view, data) => {
    const imageFormat = /jpg|jpeg|png|gif|svg|webm/;
    try {
      if (imageFormat.test(data)) {
        view.style.backgroundImage = `url('${data}')`;
      } else {
        view.innerHTML = data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Saves given data to the local storage.
   * @param key  - the key to save the data to.
   * @param data - the data to save.
   */
  const saveData = (key, data) => localStorage.setItem(key, data);

  /**
   * Retrieves data from the local storage.
   * @param key - the key to retrieve the data from.
   * @returns {string} - the data retrieved from the local storage.
   */
  const retrieveData = (key) => localStorage.getItem(key);

  /**
   * Runs a given function at the interval of a given time in milliseconds.
   * @param interval - The interval in milliseconds to run the given callback function.
   * @param func - The callback function to run at every interval.
   */
  const setTimeInterval = (interval, func) => {
    setInterval(() => {
      func();
    }, interval);
  };

  setTimeInterval(1000, () => {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    updateView(dateElement, `${today.day()} ${today.month()} ${today.dateNumber()}`);
    updateView(timeElement, today.time());
  });

  /**
   * Gets a random quote from the API and returns the data in a JSON format
   *
   */
  const getDailyQuote = () => {
    fetch('https://api.quotable.io/random?maxLength=50')
      .then(response => {
        return response.json();
      }).then(data => {
      updateView(quoteElement, data.content);
      saveData('quote', data.content);
      updateView(quoteAuthor, data.author);
      saveData('author', data.author);
    });
  }

  /**
   * Checks if the current date is the same as the date saved in the local storage.
   * @returns {boolean} - true if the current date is the same as the date saved in the local storage.
   */
  const dateIsToday = () => {
    const currentDate = today.dateNumber();
    const savedDate = retrieveData("dateNumber");
    return currentDate === parseInt(savedDate, 10);
  }

  const randomNumber = Math.floor(Math.random() * 100);
  const image = `assets/images/backgrounds/${randomNumber}.jpeg`;
  const body = document.querySelector("body");

  const quoteElement = document.getElementById('quote');
  const quoteAuthor = document.getElementById('author');

  // if the date changes, update the page
  if (!dateIsToday()) {
    updateView(body, image);
    saveData("dateNumber", today.dateNumber());
    saveData("backgroundImage", image);
    getDailyQuote();
  } else {
    const image = retrieveData("backgroundImage");
    const quote = retrieveData("quote");
    const author = retrieveData("author");
    updateView(body, image);
    updateView(quoteElement, quote);
    updateView(quoteAuthor, author);
  }

}());
