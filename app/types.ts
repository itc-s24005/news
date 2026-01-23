export type NewsItem = {
  title: string;
  description: string;
  link: string;
  image_url?: string;
  source_name: string;
  source_icon?: string
};

export type forecastsItem = {
  date: string;
  dateLabel: string;
  telop: string;
  detail: {
    weather: string;
    wind: string;
  };
  temperature: {
    min: {
      celsius: string;
    },
    max: {
      celsius: string;
    }
  };
  image: {
    url: string;
    alt: string;
  };
};

export type CalendarEvent = {
  date: string; // YYYY-MM-DD
  title: string;
};

export type GoogleCalendarEvent = {
  summary?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
};


export type Holidays = Record<string, string>;

export type KansokuID = {
  [kenName: string]: {
    [cityName: string]: string;
  };
};