/* eslint-disable no-console */
const getRandomElement = (array) => {
  // Check if the array is empty
  if (!array || array.length === 0) {
    return undefined; // or throw an error, or return a default value
  }
  const randomIndex = Math.floor(Math.random() * array.length); // Added check for empty array
  return array[randomIndex];
};

const tags = ['famous quotes', 'inspirational', 'motivational', 'wisdom', 'life', 'success', 'patience', 'love', 'happiness', 'success', 'joy', 'fullfillment', 'ambition', 'strength', 'self help'];
const tag = getRandomElement(tags);

const getDailyQuote = async (query) => {
  const promise = fetch(`http://api.quotable.io/search/quotes/?query=${query}&limit=50&page=1`);
  const response = await promise;
  return response.json();
};

getDailyQuote(tag)
  .then((response) => {
    const { results } = response;
    console.log(getRandomElement(results));
  })
  .catch((error) => {
    throw new Error(error);
  })
  .finally(() => {
    console.log('done fetching');
  });
