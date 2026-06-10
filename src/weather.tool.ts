import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context, Tool } from "@rekog/mcp-nest";
import z from "zod";
import { ForecastResponse } from "./models/forecast.model";

const FORECAST_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/forecast";
// Only take up to 5 days (40 entries, 8 per day)
const FORECAST_MAX_ENTRIES = 40;

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
  async getWeatherForecast({ city }: { city: string }, _context: Context) {
    const apiKey = this.configService.get<string>("OWM_API_KEY");

    if (!apiKey) {
      throw new Error("OWM_API_KEY is not set.");
    }

    const params = new URLSearchParams({
      q: city,
      appid: apiKey,
      units: "metric",
    });
    const response = await fetch(
      `${FORECAST_API_ENDPOINT}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
        `OpenWeatherMap API request failed with status ${response.status}.`,
      );
    }

    const forecast = (await response.json()) as ForecastResponse;
    const cityInfo = forecast.city;
    const forecastList = forecast.list;

    const entries = forecastList.slice(0, FORECAST_MAX_ENTRIES);

    let template = `Weather Forecast for ${cityInfo.name}:\n`;
    for (const entry of entries) {
      template += "Date & Time: " + entry.dt_txt + "\n";
      template += "Conditions: ";
      if (Array.isArray(entry.weather)) {
        template += entry.weather
          .map((item) => `${item.main} ${item.description}`)
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
