export type NewsItem = {
  title: string;
  description: string;
  link: string;
  image_url?: string;
};

export type forecastsItem = {
  date: string;
  dateLabel: string;
  telop: string;
  detail: {
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