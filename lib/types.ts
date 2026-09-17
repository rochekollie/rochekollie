export interface WeatherData {
  temp: number;
  unit: '°F' | '°C';
  condition: string;
  icon: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface DailyPhoto {
  url: string;
  owner: string;
  link: string;
}

export interface DailyWidgetData {
  cycleId: string;
  userId: string;
  background: DailyPhoto;
  quote: {
    text: string;
    author: string;
  };
  updatedAt: string;
}
