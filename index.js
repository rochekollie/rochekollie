/* eslint-disable no-console */
import {
  dateFormatter,
  getGreeting,
  get12HourCycleId,
  getMillisecondsUntilNext12Reset,
  getOrCreateUserId,
  getUserDailyPhoto,
  getUserDailyQuote,
  getDailyWidget,
  saveDailyWidget,
  getUserLocation,
  getLiveWeather,
} from './kore/kore.js';

let currentTempUnit = localStorage.getItem('userTempUnit') || 'fahrenheit';
let cachedUserLocation = null;

/**
 * Updates the digital clock, greeting, and local time indicators across the app
 */
function updateClockAndGreeting() {
  const dateComponent = document.getElementById('date');
  const timeComponent = document.getElementById('time');
  const greetingComponent = document.getElementById('greeting');
  const navLocalTimeEl = document.getElementById('nav-local-time');

  if (dateComponent) {
    dateComponent.textContent = dateFormatter.longDateText;
  }
  if (timeComponent) {
    timeComponent.textContent = dateFormatter.momentumTimeText;
  }
  if (greetingComponent) {
    greetingComponent.textContent = getGreeting('Roche');
  }
  if (navLocalTimeEl) {
    navLocalTimeEl.textContent = new Date().toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}

/**
 * Applies wallpaper and quote data to the DOM
 * @param {object} widget
 */
function renderWidgetData(widget) {
  const widgetEl = document.getElementById('daily-widget');
  const ownerEl = document.getElementById('owner');
  const quoteEl = document.getElementById('quote');
  const authorEl = document.getElementById('author');
  const copyrightEl = document.getElementById('copyright');
  const footerYearEl = document.getElementById('footer-year');

  const currentYear = new Date().getFullYear();
  if (copyrightEl) copyrightEl.textContent = currentYear;
  if (footerYearEl) footerYearEl.textContent = currentYear;

  if (widget?.background?.url && widgetEl) {
    widgetEl.style.backgroundImage = `url("${widget.background.url}")`;
  }
  if (widget?.background?.owner && ownerEl) {
    ownerEl.textContent = widget.background.owner;
    if (widget.background.link) {
      ownerEl.href = widget.background.link;
    }
  }
  if (widget?.quote?.text && quoteEl) {
    quoteEl.textContent = widget.quote.text;
  }
  if (widget?.quote?.author && authorEl) {
    authorEl.textContent = widget.quote.author;
  }
}

/**
 * Fetches and displays live weather and user location across all weather widgets
 * @param {boolean} [forceRefresh=false]
 */
async function updateLiveWeatherAndLocation(forceRefresh = false) {
  try {
    if (!cachedUserLocation || forceRefresh) {
      cachedUserLocation = await getUserLocation();
    }

    const weather = await getLiveWeather(
      cachedUserLocation.latitude,
      cachedUserLocation.longitude,
      currentTempUnit,
    );

    const locationDisplay = cachedUserLocation.region
      ? `${cachedUserLocation.city}, ${cachedUserLocation.region}`
      : cachedUserLocation.city;

    // 1. Cover Page Weather Component
    const weatherIconEl = document.getElementById('weather-icon');
    const weatherTempEl = document.getElementById('weather-temp');
    const weatherConditionEl = document.getElementById('weather-condition');
    const weatherLocationEl = document.getElementById('weather-location');

    if (weatherIconEl) weatherIconEl.textContent = weather.icon;
    if (weatherTempEl) weatherTempEl.innerHTML = `${weather.temp}<sup>&deg;</sup>`;
    if (weatherConditionEl) weatherConditionEl.textContent = weather.condition;
    if (weatherLocationEl) weatherLocationEl.textContent = locationDisplay;

    // 2. Main Navigation Live Pill
    const navWeatherIcon = document.getElementById('nav-weather-icon');
    const navWeatherTemp = document.getElementById('nav-weather-temp');
    const navWeatherCity = document.getElementById('nav-weather-city');

    if (navWeatherIcon) navWeatherIcon.textContent = weather.icon;
    if (navWeatherTemp) navWeatherTemp.innerHTML = `${weather.temp}&deg;`;
    if (navWeatherCity) navWeatherCity.textContent = cachedUserLocation.city;

    // 3. Developer Showcase Card Location
    const devCardCity = document.getElementById('dev-card-city');
    if (devCardCity) {
      devCardCity.textContent = locationDisplay;
    }
  } catch (err) {
    console.warn('Failed to update live weather and location:', err);
  }
}

/**
 * Allows user to toggle between Fahrenheit and Celsius by clicking weather widgets
 */
function setupWeatherInteractivity() {
  const widgets = [
    document.getElementById('weather'),
    document.getElementById('nav-live-widget'),
  ];

  widgets.forEach((widget) => {
    if (widget) {
      widget.style.cursor = 'pointer';
      widget.addEventListener('click', async () => {
        currentTempUnit = currentTempUnit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
        localStorage.setItem('userTempUnit', currentTempUnit);
        await updateLiveWeatherAndLocation(true);
      });
    }
  });
}

/**
 * Refreshes daily wallpaper and quote for the current 12:00 PM cycle
 * @param {string} userId
 * @param {string} cycleId
 */
async function refreshDailyContent(userId, cycleId) {
  console.log(`Executing daily reset for user [${userId}] on cycle [${cycleId}]`);

  try {
    const photo = await getUserDailyPhoto(userId, cycleId);
    const quote = getUserDailyQuote(userId, cycleId);

    const widget = {
      cycleId,
      userId,
      background: photo,
      quote,
      updatedAt: new Date().toISOString(),
    };

    saveDailyWidget('dailyWidget', widget);
    renderWidgetData(widget);
    console.log('Daily widget reset complete and saved.');
  } catch (error) {
    console.error('Failed to refresh daily content:', error);
  }
}

/**
 * Schedules the automated background reset for the next 12:00 PM rollover
 * @param {string} userId
 */
function schedule12HourReset(userId) {
  const msUntilReset = getMillisecondsUntilNext12Reset();
  const nextResetDate = new Date(Date.now() + msUntilReset);
  console.log(`Next daily 12:00 reset scheduled in ${Math.round(msUntilReset / 1000 / 60)} minutes (at ${nextResetDate.toLocaleTimeString()})`);

  setTimeout(() => {
    const newCycleId = get12HourCycleId();
    refreshDailyContent(userId, newCycleId);
    schedule12HourReset(userId);
  }, msUntilReset);
}

/**
 * Initializes navigation event handlers (down arrow snap, wallpaper return, smooth scrolling)
 */
function initNavigation() {
  // Down Arrow: Snaps smoothly to main content
  const scrollDownLink = document.getElementById('scroll-down-link');
  if (scrollDownLink) {
    scrollDownLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Return to Wallpaper button
  const backToWallpaperBtn = document.getElementById('back-to-wallpaper-btn');
  if (backToWallpaperBtn) {
    backToWallpaperBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const dailyWidget = document.getElementById('daily-widget');
      if (dailyWidget) {
        dailyWidget.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Active link highlighter on scroll within main content
  const navLinks = document.querySelectorAll('.main-menu .nav-link');
  const sections = document.querySelectorAll('.content-section');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }
}

// When document is ready
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Start live clock & greeting
  updateClockAndGreeting();
  setInterval(updateClockAndGreeting, 1000);

  // 2. Identify user and current 12:00 PM cycle
  const userId = getOrCreateUserId();
  const currentCycleId = get12HourCycleId();
  const savedWidget = getDailyWidget('dailyWidget');

  // 3. Check if we need to reset the daily background and quote
  if (!savedWidget.cycleId || savedWidget.cycleId !== currentCycleId || savedWidget.userId !== userId) {
    console.log('Daily cycle has changed or new user detected. Resetting background & quote.');
    await refreshDailyContent(userId, currentCycleId);
  } else {
    console.log(`Using cached daily widget for cycle: ${currentCycleId}`);
    renderWidgetData(savedWidget);
  }

  // 4. Load live user location and real-time weather
  await updateLiveWeatherAndLocation();
  setupWeatherInteractivity();
  // Refresh live weather every 15 minutes
  setInterval(() => updateLiveWeatherAndLocation(true), 900000);

  // 5. Schedule automatic reset when clock strikes 12:00 PM
  schedule12HourReset(userId);

  // Periodic cycle check (every 30 seconds) to handle device wake from sleep
  setInterval(() => {
    const activeCycle = get12HourCycleId();
    const stored = getDailyWidget('dailyWidget');
    if (stored.cycleId !== activeCycle) {
      console.log('Detected 12:00 cycle rollover after timer check. Refreshing wallpaper...');
      refreshDailyContent(userId, activeCycle);
    }
  }, 30000);

  // 6. Initialize navigation and smooth snap interactions
  initNavigation();
});
