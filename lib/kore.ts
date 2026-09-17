import { dailyQuotes } from './quotes';
import { DailyPhoto, DailyWidgetData, UserLocation, WeatherData } from './types';

/**
 * Returns a time-appropriate greeting (Momentum style)
 */
export const getGreeting = (name = 'Roche'): string => {
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
 * Formats a Date object into a readable long date (e.g. "Thursday, September 17")
 */
export const formatDateLong = (date = new Date()): string => {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats time in 24h/Momentum style "HH:MM"
 */
export const formatTimeMomentum = (date = new Date()): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Formats time in standard short 12h format "h:mm A"
 */
export const formatTimeShort = (date = new Date()): string => {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Computes the unique identifier for the 12:00 PM daily cycle.
 * Rollover occurs every day at 12:00:00 (noon).
 */
export const get12HourCycleId = (date = new Date()): string => {
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
 */
export const getMillisecondsUntilNext12Reset = (now = new Date()): number => {
  const nextReset = new Date(now);
  if (now.getHours() >= 12) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  nextReset.setHours(12, 0, 0, 0);
  return Math.max(1000, nextReset.getTime() - now.getTime());
};

/**
 * Gets or creates a persistent unique user ID for this browser.
 */
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') return 'user_server';
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
 */
export const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Selects or fetches a unique random photo for this specific user and 12:00 cycle.
 * Falls back seamlessly to the 100 high-res dynamic wallpapers in /assets/images/backgrounds/dynamic/
 */
export const getUserDailyPhoto = async (userId: string, cycleId: string): Promise<DailyPhoto> => {
  // Deterministic yet distinct selection per user and per 12:00 cycle
  // Available dynamic photos: 1.jpeg to 100.jpeg
  const seed = hashString(`${userId}:${cycleId}:photo`);
  const photoIndex = (seed % 100) + 1;
  return {
    url: `/assets/images/backgrounds/dynamic/${photoIndex}.jpeg`,
    owner: `Roche Collection #${photoIndex}`,
    link: 'https://unsplash.com',
  };
};

/**
 * Selects a daily inspiring quote for this user and cycle
 */
export const getUserDailyQuote = (userId: string, cycleId: string): { text: string; author: string } => {
  const seed = hashString(`${userId}:${cycleId}:quote`);
  const index = seed % dailyQuotes.length;
  const selected = dailyQuotes[index] || dailyQuotes[0];
  return {
    text: selected.quote,
    author: selected.author,
  };
};

/**
 * Saves widget data to local storage
 */
export const saveDailyWidget = (widgetName: string, widget: DailyWidgetData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(widgetName, JSON.stringify(widget));
};

/**
 * Default fallback widget data
 */
export const defaultDailyWidget: DailyWidgetData = {
  cycleId: '',
  userId: '',
  background: {
    url: '/assets/images/backgrounds/default.jpeg',
    owner: 'Roche Kollie',
    link: 'https://unsplash.com',
  },
  quote: {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  updatedAt: '',
};

/**
 * Retrieves daily widget data from local storage
 */
export const getDailyWidget = (widgetName = 'dailyWidget'): DailyWidgetData => {
  if (typeof window === 'undefined') return defaultDailyWidget;
  const widget = localStorage.getItem(widgetName);
  if (widget) {
    try {
      return JSON.parse(widget);
    } catch {
      // ignore
    }
  }
  return { ...defaultDailyWidget };
};

/**
 * Maps WMO weather interpretation codes to readable conditions and icons
 */
export const getWeatherCondition = (code: number, isDay = 1): { condition: string; icon: string } => {
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
 */
export const getFallbackCityFromTimezone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('/')) {
      const parts = tz.split('/');
      return parts[parts.length - 1].replace(/_/g, ' ');
    }
  } catch {
    // ignore
  }
  return 'Local';
};

/**
 * Detects user's geographic coordinates and city name.
 * Uses cached location (1 hr TTL), IP geolocation, or browser timezone fallback.
 */
export const getUserLocation = async (): Promise<UserLocation> => {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('userLocationData');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 3600000) {
          return parsed.data;
        }
      } catch {
        // ignore
      }
    }
  }

  let location: UserLocation = {
    latitude: 39.96,
    longitude: -76.73,
    city: 'York',
    region: 'PA',
  };

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
        if (typeof window !== 'undefined') {
          localStorage.setItem('userLocationData', JSON.stringify({
            timestamp: Date.now(),
            data: location,
          }));
        }
        return location;
      }
    }
  } catch (err) {
    console.warn('Primary IP location fetch error, attempting secondary fallback:', err);
  }

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
        if (typeof window !== 'undefined') {
          localStorage.setItem('userLocationData', JSON.stringify({
            timestamp: Date.now(),
            data: location,
          }));
        }
        return location;
      }
    }
  } catch (err) {
    console.warn('Secondary IP location fetch error:', err);
  }

  location.city = getFallbackCityFromTimezone();
  return location;
};

/**
 * Fetches real-time weather from Open-Meteo API
 */
export const getLiveWeather = async (
  latitude: number,
  longitude: number,
  unit: 'fahrenheit' | 'celsius' = 'fahrenheit'
): Promise<WeatherData> => {
  const cacheKey = `userWeatherData_${latitude}_${longitude}_${unit}`;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 1200000) {
          return parsed.data;
        }
      } catch {
        // ignore
      }
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=${unit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    const current = data.current;

    const weatherInfo = getWeatherCondition(current.weather_code, current.is_day);
    const result: WeatherData = {
      temp: Math.round(current.temperature_2m),
      unit: unit === 'fahrenheit' ? '°F' : '°C',
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: result,
      }));
    }
    return result;
  } catch (error) {
    console.warn('Live weather fetch failed, using fallback:', error);
    return {
      temp: 74,
      unit: unit === 'fahrenheit' ? '°F' : '°C',
      condition: 'Sunny',
      icon: '☀️',
    };
  }
};
