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

export type KansokuID = {
  [kenName: string]: {
    [cityName: string]: string;
  };
};

export type Event = {
  date: string;        // yyyy-mm-dd
  title: string;
  startTime?: string; // "10:00"
  endTime?: string;   // "11:00"
  range?: {
    start: string;    // yyyy-mm-dd
    end: string;      // yyyy-mm-dd
  };
};

export type CalendarApiEvent = {
  summary?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
};


export type Holidays = Record<string, string>;

export type FollowMedia = {
  name: string;
  domain: string;
  image: string;
};

export type UserSettings = {
  observationLocation: string[];
  followMedia: FollowMedia[];
  showWeather: boolean;
  showCalendar: boolean;
  showNews: boolean;
};
