'use client';

import React, { useState, useEffect } from 'react';
import {
  formatDateLong,
  formatTimeMomentum,
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
} from '@/lib/kore';
import { DailyWidgetData, WeatherData } from '@/lib/types';

export default function MomentumCover() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('12:00');
  const [date, setDate] = useState('');
  const [greeting, setGreeting] = useState('Good day, Roche.');
  const [widget, setWidget] = useState<DailyWidgetData | null>(null);
  const [unit, setUnit] = useState<'fahrenheit' | 'celsius'>('fahrenheit');
  const [weather, setWeather] = useState<WeatherData>({
    temp: 74,
    unit: '°F',
    condition: 'Sunny',
    icon: '☀️',
  });
  const [locationName, setLocationName] = useState('York, PA');

  // Hydration and clock setup
  useEffect(() => {
    setMounted(true);

    const now = new Date();
    setTime(formatTimeMomentum(now));
    setDate(formatDateLong(now));
    setGreeting(getGreeting('Roche'));

    const storedUnit = (localStorage.getItem('userTempUnit') as 'fahrenheit' | 'celsius') || 'fahrenheit';
    setUnit(storedUnit);

    // Live clock timer
    const clockInterval = setInterval(() => {
      const current = new Date();
      setTime(formatTimeMomentum(current));
      setDate(formatDateLong(current));
      setGreeting(getGreeting('Roche'));
    }, 1000);

    // Initialize daily wallpaper and quote with 12:00 PM cycle
    const userId = getOrCreateUserId();
    const cycleId = get12HourCycleId();
    const cachedWidget = getDailyWidget();

    const loadDailyContent = async (uid: string, cid: string) => {
      try {
        const photo = await getUserDailyPhoto(uid, cid);
        const quote = getUserDailyQuote(uid, cid);
        const newWidget: DailyWidgetData = {
          cycleId: cid,
          userId: uid,
          background: photo,
          quote,
          updatedAt: new Date().toISOString(),
        };
        saveDailyWidget('dailyWidget', newWidget);
        setWidget(newWidget);
      } catch (err) {
        console.warn('Error loading daily content:', err);
      }
    };

    if (!cachedWidget.cycleId || cachedWidget.cycleId !== cycleId || cachedWidget.userId !== userId) {
      loadDailyContent(userId, cycleId);
    } else {
      setWidget(cachedWidget);
    }

    // Schedule 12:00 PM rollover
    const msUntilReset = getMillisecondsUntilNext12Reset();
    const resetTimer = setTimeout(() => {
      const nextCycle = get12HourCycleId();
      loadDailyContent(userId, nextCycle);
    }, msUntilReset);

    // Heartbeat check every 30s
    const heartbeat = setInterval(() => {
      const activeCycle = get12HourCycleId();
      const currentStored = getDailyWidget();
      if (currentStored.cycleId !== activeCycle) {
        loadDailyContent(userId, activeCycle);
      }
    }, 30000);

    // Fetch live weather and location
    const loadWeather = async (targetUnit = storedUnit) => {
      try {
        const loc = await getUserLocation();
        setLocationName(loc.region ? `${loc.city}, ${loc.region}` : loc.city);
        const w = await getLiveWeather(loc.latitude, loc.longitude, targetUnit);
        setWeather(w);
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    };

    loadWeather();
    const weatherInterval = setInterval(() => loadWeather(), 900000);

    return () => {
      clearInterval(clockInterval);
      clearTimeout(resetTimer);
      clearInterval(heartbeat);
      clearInterval(weatherInterval);
    };
  }, []);

  // Toggle temperature unit
  const toggleUnit = async () => {
    const nextUnit = unit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
    setUnit(nextUnit);
    localStorage.setItem('userTempUnit', nextUnit);

    try {
      const loc = await getUserLocation();
      const w = await getLiveWeather(loc.latitude, loc.longitude, nextUnit);
      setWeather(w);
    } catch {
      // ignore
    }
  };

  // Smooth scroll down to main content
  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('main-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgUrl = widget?.background?.url || '/assets/images/backgrounds/default.jpeg';
  const owner = widget?.background?.owner || 'Unsplash';
  const ownerLink = widget?.background?.link || 'https://unsplash.com';
  const quoteText = widget?.quote?.text || 'The only way to do great work is to love what you do.';
  const quoteAuthor = widget?.quote?.author || 'Steve Jobs';

  return (
    <div
      id="daily-widget"
      className="wallpaper-screen"
      role="region"
      aria-label="Momentum Wallpaper Landing Page"
      style={{ backgroundImage: `url("${bgUrl}")` }}
    >
      <div className="wallpaper-overlay" />

      {/* TOP HEADER */}
      <header className="wallpaper-header">
        <div id="date" className="meta-components">
          {mounted ? date : 'Welcome'}
        </div>
        <div
          id="weather"
          className="meta-components live-weather-widget"
          title="Live weather • Click to toggle °F / °C"
          role="button"
          tabIndex={0}
          onClick={toggleUnit}
          onKeyDown={(e) => e.key === 'Enter' && toggleUnit()}
        >
          <span id="weather-icon" className="weather-icon">
            {weather.icon}
          </span>
          <span id="weather-temp" className="weather-temp">
            {mounted ? weather.temp : '--'}
            <sup>&deg;</sup>
          </span>
          <span id="weather-condition" className="weather-condition">
            {weather.condition}
          </span>
          <span className="weather-dot">&bull;</span>
          <span id="weather-location" className="weather-location">
            {mounted ? locationName : 'Detecting...'}
          </span>
        </div>
      </header>

      {/* CENTER MOMENTUM CLOCK, GREETING, QUOTE */}
      <main className="wallpaper-center">
        <div id="time" className="momentum-clock" aria-live="off">
          {mounted ? time : '12:00'}
        </div>
        <div id="greeting" className="momentum-greeting">
          {mounted ? greeting : 'Good day, Roche.'}
        </div>
        <div id="quote-component" className="momentum-quote-box">
          <p id="quote" className="quote-text">
            {quoteText}
          </p>
          <p className="quote-author-line">
            — <span id="author">{quoteAuthor}</span>
          </p>
        </div>
      </main>

      {/* FOOTER & DOWN ARROW */}
      <footer className="wallpaper-footer">
        <div className="meta-components footer-left">
          <p>
            &copy; {new Date().getFullYear()} <span id="hearts">&hearts;</span>{' '}
            <a href="https://x.com/rochekollie" target="_blank" rel="noopener noreferrer">
              Roche Kollie
            </a>
          </p>
        </div>

        <div id="scroll-down-container" className="scroll-prompt-container">
          <a
            href="#main-content"
            id="scroll-down-link"
            aria-label="Scroll down to main content"
            onClick={handleScrollDown}
          >
            <span className="scroll-down-label">Explore Portfolio</span>
            <div className="scroll-down-arrow-circle">
              <svg id="scroll-down-icon" xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28" fill="#ffffff">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
              </svg>
            </div>
          </a>
        </div>

        <div className="meta-components footer-right">
          <p>
            Photo by{' '}
            <a id="owner" href={ownerLink} target="_blank" rel="noopener noreferrer">
              {owner}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
