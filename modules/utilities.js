export const getDate = (locales) => {
  const d = new Date();
  return {
    seconds: d.getSeconds(),
    minutes: d.getMinutes(),
    hour: d.getHours(),
    shortDay: d.toLocaleString('default', {weekday: 'short'}),
    longDay: d.toLocaleString('default', {weekday: 'long'}),
    dateNumber: d.getDate(),
    monthNumber: d.getMonth() + 1,
    shortMonth: d.toLocaleString('default', {month: 'short'}),
    LongMonth: d.toLocaleString('default', {month: 'long'}),
    shortYear: parseInt(d.toLocaleString('default', {year: '2-digit'})),
    longYear: d.getFullYear(),
    meridian: d.getHours() >= 12 ? 'PM' : 'AM',
    timeText: d.toLocaleTimeString(locales),
    dateText: d.toLocaleDateString(locales),
    shortDateText: d.toLocaleDateString(locales, {weekday: 'short', month: 'short', day: 'numeric'}),
    longDateText: d.toLocaleDateString(locales, {weekday: 'long', month: 'long', day: 'numeric'}),
    shortTimeText: d.toLocaleTimeString(locales, {hour: 'numeric', minute: 'numeric'}),
    longTimeText: d.toLocaleTimeString(locales, {hour: 'numeric', minute: 'numeric', second: 'numeric'}),
  };
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
}

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
}