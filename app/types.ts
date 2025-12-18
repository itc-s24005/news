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
  };
};

export type CalendarEvent = {
  id: string;
  summary?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
};

export type Holidays = Record<string, string>;