/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { keys } from './kore/keys.js';
import {
  dateFormatter,
  saveDailyWidget,
  getDailyWidget,
} from './kore/kore.js';

// when the content loads,
window.onload = () => {
  // Debug button - Forcefully clear local storage.
  document.getElementById('debug-button').addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
  });

  // display time
  const dateComponent = document.getElementById('date');
  const timeComponent = document.getElementById('time');

  dateComponent.textContent = dateFormatter.longDateText;
  timeComponent.textContent = dateFormatter.shortTimeText;
  setInterval(() => {
    dateComponent.textContent = dateFormatter.longDateText;
    timeComponent.textContent = dateFormatter.shortTimeText;
  }, 1000);

  const dailyWidget = getDailyWidget('dailyWidget');

  // set up the database.
  if (dailyWidget.date === undefined || dailyWidget.date !== new Date().toLocaleDateString()) {
    console.log('The date has changed. Fetching new data.');
    const randomArrayOfAerials = ['aerial ocean view', 'aerial nature view', 'aerial landscape view', 'aerial mountain view', 'aerial mountain view', 'aerial mountainview'];
    const randomIndex = Math.floor(Math.random() * randomArrayOfAerials.length);
    const query = randomArrayOfAerials[randomIndex];
    const imageResponse = fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${keys.unsplash.key}`);
    // const quoteResponse = fetch('http://api.quotable.io/search/quotes/?query=love&limit=50&page=1');

    Promise.all([imageResponse/** , quoteResponse */])
      .then((response) => Promise.all(response.map((res) => res.json())))
      .then((data) => {
        const widget = dailyWidget;
        widget.date = new Date().toLocaleDateString();

        // get and display the background image
        widget.background.url = data[0].urls.full;
        widget.background.owner = data[0].user.name;
        document.getElementById('daily-widget').style.backgroundImage = `url(${widget.background.url})`;
        document.getElementById('owner').textContent = widget.background.owner;
        document.getElementById('copyright').textContent = new Date().getFullYear();

        // get and display the quote
        // const quote = data[1].results[Math.floor(Math.random() * data[1].results.length)];
        // widget.quote.text = quote.content;
        // widget.quote.author = quote.author;
        // document.getElementById('quote').textContent = widget.quote.text;
        // document.getElementById('author').textContent = widget.quote.author;

        // save the data
        saveDailyWidget('dailyWidget', widget);
        console.log('Daily widget saved.');
        console.log(dailyWidget);
      })
      .catch((error) => {
        // log error and use the default local data.
        console.log(`${error}`);
        console.log('Using default data.');
        document.getElementById('daily-widget').style.backgroundImage = `url(${dailyWidget.background.url})`;
        document.getElementById('owner').textContent = dailyWidget.background.owner;
        document.getElementById('copyright').textContent = new Date().getFullYear();
        document.getElementById('quote').textContent = dailyWidget.quote.text;
        document.getElementById('author').textContent = dailyWidget.quote.author;
        // throw new Error(error.message);
      })
      .finally(() => {
        console.log('Finally done fetching.');
      });
  } else { // if the date is the same, use the saved widget.
    console.log('The date is the same. Using the saved widget.');
    console.log('Saved data:');
    console.log(dailyWidget);
    const widget = getDailyWidget('dailyWidget');
    document.getElementById('daily-widget').style.backgroundImage = `url(${widget.background.url})`;
    document.getElementById('owner').textContent = widget.background.owner;
    document.getElementById('copyright').textContent = new Date().getFullYear();
    document.getElementById('quote').textContent = widget.quote.text;
    document.getElementById('author').textContent = widget.quote.author;
  }
}; // end of window.onload
