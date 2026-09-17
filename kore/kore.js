/* eslint-disable no-console */
import { keys } from './keys.js';
import { dailyQuotes } from './quotes.js';

/**
 * Formats dates and times for the application
 */
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
    return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  },

  get momentumTimeText() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  get longTimeText() {
    return new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', second: 'numeric' });
  },
};

/**
 * Returns a time-appropriate greeting (Momentum style)
 * @param {string} name
 * @returns {string}
 */
export const getGreeting = (name = 'Roche') => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return `Good morning, ${name}.`;
  }
  if (hour >= 12 && hour < 18) {
    return `Good afternoon, ${name}.`;
  }
  return `Good evening, ${name}.`;
};

/**
 * Computes the unique identifier for the 12:00 PM daily cycle.
 * The cycle rolls over every day at 12:00:00 (noon).
 * @param {Date} [date=new Date()]
 * @returns {string} Cycle identifier e.g. "2026-09-16_12:00"
 */
export const get12HourCycleId = (date = new Date()) => {
  const cycleDate = new Date(date);
  if (cycleDate.getHours() < 12) {
    cycleDate.setDate(cycleDate.getDate() - 1);
  }
  const y = cycleDate.getFullYear();
  const m = String(cycleDate.getMonth() + 1).padStart(2, '0');
  const d = String(cycleDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}_12:00`;
};

/**
 * Computes milliseconds until the next 12:00:00 reset.
 * @param {Date} [now=new Date()]
 * @returns {number}
 */
export const getMillisecondsUntilNext12Reset = (now = new Date()) => {
  const nextReset = new Date(now);
  if (now.getHours() >= 12) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  nextReset.setHours(12, 0, 0, 0);
  return Math.max(1000, nextReset.getTime() - now.getTime());
};

/**
 * Gets or creates a persistent unique user ID for this browser.
 * @returns {string}
 */
export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('dailyWidgetUserId');
  if (!userId) {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    userId = `user_${Date.now().toString(36)}_${randomSeed}`;
    localStorage.setItem('dailyWidgetUserId', userId);
  }
  return userId;
};

/**
 * Consistent numeric hash of a string
 * @param {string} str
 * @returns {number}
 */
export const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const imageQueries = [
  'aerial ocean waves minimal',
  'aerial calm sea surface',
  'aerial tropical turquoise water',
  'aerial mountain range with clouds',
  'aerial snow covered mountains minimal',
  'aerial rolling hills and valleys',
  'aerial misty forest minimal',
  'aerial autumn forest top view',
  'aerial desert sand dunes minimal',
  'aerial sunset sky gradient',
  'aerial view above the clouds',
  'nature landscape scenic wallpaper',
];

export const getRandomElement = (array) => {
  if (!array || array.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Selects or fetches a unique random photo for this specific user and 12:00 cycle.
 * Falls back seamlessly to the 100 high-res dynamic wallpapers in assets/images/backgrounds/dynamic/
 * @param {string} userId
 * @param {string} cycleId
 * @returns {Promise<{ url: string, owner: string, link: string }>}
 */
export const getUserDailyPhoto = async (userId, cycleId) => {
  // If an Unsplash API key is configured, try live fetch
  if (keys?.unsplash?.key && keys.unsplash.key.trim().length > 0) {
    try {
      const query = getRandomElement(imageQueries);
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${keys.unsplash.key}`);
      if (res.ok) {
        const data = await res.json();
        return {
          url: data.urls?.regular || data.urls?.full,
          owner: data.user?.name || 'Unsplash Photographer',
          link: data.user?.links?.html || 'https://unsplash.com',
        };
      }
    } catch (err) {
      console.warn('Unsplash API fetch failed, using local dynamic wallpapers library:', err);
    }
  }

  // Deterministic yet distinct selection per user and per 12:00 cycle
  // Available local dynamic photos: 1.jpeg to 100.jpeg
  const seed = hashString(`${userId}:${cycleId}:photo`);
  const photoIndex = (seed % 100) + 1;
  return {
    url: `./assets/images/backgrounds/dynamic/${photoIndex}.jpeg`,
    owner: `Roche Collection #${photoIndex}`,
    link: 'https://unsplash.com',
  };
};

/**
 * Selects a daily inspiring quote for this user and cycle
 * @param {string} userId
 * @param {string} cycleId
 * @returns {{ text: string, author: string }}
 */
export const getUserDailyQuote = (userId, cycleId) => {
  const seed = hashString(`${userId}:${cycleId}:quote`);
  const index = seed % dailyQuotes.length;
  const selected = dailyQuotes[index] || dailyQuotes[0];
  return {
    text: selected.quote,
    author: selected.author,
  };
};

/**
 * Saves widget data to local storage.
 * @param {string} widgetName
 * @param {object} widget
 */
export const saveDailyWidget = (widgetName, widget) => {
  localStorage.setItem(widgetName, JSON.stringify(widget));
};

/**
 * Default fallback widget data
 */
export const defaultDailyWidget = {
  cycleId: '',
  background: {
    url: './assets/images/backgrounds/default.jpeg',
    owner: 'Roche Kollie',
    link: 'https://unsplash.com',
  },
  quote: {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
};

/**
 * Retrieves the daily widget data from local storage.
 * @param {string} [widgetName='dailyWidget']
 * @returns {object}
 */
export const getDailyWidget = (widgetName = 'dailyWidget') => {
  const widget = localStorage.getItem(widgetName);
  if (widget) {
    try {
      return JSON.parse(widget);
    } catch (e) {
      console.error('Error parsing stored widget:', e);
    }
  }
  return { ...defaultDailyWidget };
};

/**
 * Set active link in navigation bar
 * @param {NodeList|Array} links
 */
export const setActiveLink = (links) => {
  links.forEach((link) => {
    link.classList.remove('active');
  });
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
};

/**
 * Maps WMO weather interpretation codes to readable conditions and icons
 * @param {number} code
 * @param {number} isDay (1 = day, 0 = night)
 * @returns {{ condition: string, icon: string }}
 */
export const getWeatherCondition = (code, isDay = 1) => {
  switch (code) {
    case 0:
      return { condition: 'Clear', icon: isDay ? '☀️' : '🌙' };
    case 1:
      return { condition: 'Mainly Clear', icon: isDay ? '🌤️' : '🌙' };
    case 2:
      return { condition: 'Partly Cloudy', icon: isDay ? '⛅' : '☁️' };
    case 3:
      return { condition: 'Overcast', icon: '☁️' };
    case 45:
    case 48:
      return { condition: 'Foggy', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Drizzle', icon: '🌦️' };
    case 56:
    case 57:
      return { condition: 'Freezing Drizzle', icon: '🌨️' };
    case 61:
    case 63:
    case 65:
      return { condition: 'Rain', icon: '🌧️' };
    case 66:
    case 67:
      return { condition: 'Freezing Rain', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snow', icon: '🌨️' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', icon: '🌦️' };
    case 85:
    case 86:
      return { condition: 'Snow Showers', icon: '🌨️' };
    case 95:
      return { condition: 'Thunderstorm', icon: '⛈️' };
    case 96:
    case 99:
      return { condition: 'Hail & Storms', icon: '⛈️' };
    default:
      return { condition: 'Fair', icon: isDay ? '☀️' : '🌙' };
  }
};

/**
 * Extracts a human-readable city from browser timezone
 * @returns {string}
 */
export const getFallbackCityFromTimezone = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('/')) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      return city;
    }
  } catch (e) {
    // ignore
  }
  return 'Local';
};

/**
 * Detects user's geographic coordinates and city name.
 * Uses cached location (1 hr TTL), IP geolocation, or browser timezone fallback.
 * @returns {Promise<{ latitude: number, longitude: number, city: string, region: string }>}
 */
export const getUserLocation = async () => {
  const cached = localStorage.getItem('userLocationData');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.data;
      }
    } catch (e) {
      // ignore
    }
  }

  let location = {
    latitude: 39.96,
    longitude: -76.73,
    city: 'York',
    region: 'PA',
  };

  // 1. Attempt IP Geolocation (seamless, no prompt required)
  try {
    const ipRes = await fetch('https://ipwho.is/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.success && ipData.latitude && ipData.longitude) {
        location = {
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          city: ipData.city || 'Local',
          region: ipData.region_code || ipData.region || '',
        };
        localStorage.setItem('userLocationData', JSON.stringify({
          timestamp: Date.now(),
          data: location,
        }));
        return location;
      }
    }
  } catch (err) {
    console.warn('Primary IP location fetch error, attempting secondary fallback:', err);
  }

  // 2. Secondary IP Geolocation fallback
  try {
    const ipRes2 = await fetch('https://ipapi.co/json/');
    if (ipRes2.ok) {
      const ipData2 = await ipRes2.json();
      if (ipData2.latitude && ipData2.longitude) {
        location = {
          latitude: ipData2.latitude,
          longitude: ipData2.longitude,
          city: ipData2.city || 'Local',
          region: ipData2.region_code || ipData2.region || '',
        };
        localStorage.setItem('userLocationData', JSON.stringify({
          timestamp: Date.now(),
          data: location,
        }));
        return location;
      }
    }
  } catch (err) {
    console.warn('Secondary IP location fetch error:', err);
  }

  // 3. Fallback to timezone derived city
  const fallbackCity = getFallbackCityFromTimezone();
  location.city = fallbackCity;
  return location;
};

/**
 * Fetches real-time weather from Open-Meteo API
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [unit='fahrenheit']
 * @returns {Promise<{ temp: number, unit: string, condition: string, icon: string }>}
 */
export const getLiveWeather = async (latitude, longitude, unit = 'fahrenheit') => {
  const cacheKey = `userWeatherData_${latitude}_${longitude}_${unit}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 1200000) {
        return parsed.data;
      }
    } catch (e) {
      // ignore
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=${unit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    const current = data.current;

    const weatherInfo = getWeatherCondition(current.weather_code, current.is_day);
    const result = {
      temp: Math.round(current.temperature_2m),
      unit: unit === 'fahrenheit' ? '°F' : '°C',
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
    };

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: result,
    }));
    return result;
  } catch (error) {
    console.warn('Live weather fetch failed, using fallback:', error);
    return {
      temp: 74,
      unit: '°F',
      condition: 'Sunny',
      icon: '☀️',
    };
  }
};
