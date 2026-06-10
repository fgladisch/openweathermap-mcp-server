export type ForecastResponse = {
  city: { name: string };
  list: ForecastEntry[];
};

export type ForecastEntry = {
  dt_txt: string;
  weather?: Array<{ main: string; description: string }>;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    feels_like: number;
    humidity: number;
  };
};
