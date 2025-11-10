import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context, Tool } from "@rekog/mcp-nest";
import axios from "axios";
import z from "zod";

const FORECAST_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/forecast";

@Injectable()
export class WeatherTool {
  constructor(private readonly configService: ConfigService) {}

  @Tool({
    name: "get-weather-forecast",
    description:
      "Get a 5-day weather forecast for a city using OpenWeatherMap API. Returns a daily summary (description and temperature) for each of the next 5 days.",
    parameters: z.object({
      city: z.string().describe("City name to get 5-day forecast for"),
    }),
  })
  async get5DayForecast({ city }: { city: string }, _context: Context) {
    const apiKey = this.configService.get<string>("OWM_API_KEY");

    if (!apiKey) {
      throw new Error("OWM_API_KEY is not set.");
    }

    const response = await axios.get(FORECAST_API_ENDPOINT, {
      params: {
        q: city,
        appid: apiKey,
        units: "metric",
      },
    });

    const cityInfo = response.data.city;
    const forecastList = response.data.list;

    // Only take up to 5 days (40 entries, 8 per day)
    const maxEntries = 40;

    const entries = forecastList.slice(0, maxEntries);

    let template = `Weather Forecast for ${cityInfo.name}:\n`;
    for (const entry of entries) {
      template += "Date & Time: " + entry.dt_txt + "\n";
      template += "Conditions: ";
      if (Array.isArray(entry.weather)) {
        template += entry.weather
          .map((w: any) => w.main + " " + w.description)
          .join(" ");
      }
      template += "\n";
      template += "Temp: " + entry.main.temp + "\n";
      template += "Temp High: " + entry.main.temp_max + "\n";
      template += "Temp Low: " + entry.main.temp_min + "\n";
      template += "Temp feels like: " + entry.main.feels_like + "\n";
      template += "Humidity: " + entry.main.humidity + "%\n\n";
    }

    return template.trim();
  }
}
