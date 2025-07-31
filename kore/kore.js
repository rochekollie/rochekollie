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

export const koreDb = {
  /**
   * Saves given data to the local storage.
   * @param key  - the key to save the data to.
   * @param data - the data to save.
  */
  write(db) {
    localStorage.setItem(db, JSON.stringify(db));
  },

  /**
   * Retrieves data from the local storage.
   * @param key - the key to retrieve the data from.
   * @returns {object} - the data retrieved from the local storage.
  */
  read(db) {
    if (!localStorage.getItem(db)) {
      const widget = {
        day: dateFormatter.day,
        month: dateFormatter.month,
        date: dateFormatter.date,
        year: dateFormatter.year,
        backgroundImage: db.backgroundImage,
        photographer: db.backgroundImage,
        quote: db.backgroundImage,
        author: db.backgroundImage,
        preference:
            {
              theme: db.preference.theme,
              font: db.preference.font,
            },
      };
      localStorage.setItem(db, JSON.stringify(widget));
    }
    return JSON.parse(localStorage.getItem(db));
  },
};

/**
 * Generate a random hex color
 * @returns {string} - hex color
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
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
