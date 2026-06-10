import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { WeatherTool } from "./weather.tool";

const forecastResponse = {
  city: { name: "Berlin" },
  list: [
    {
      dt_txt: "2026-06-10 12:00:00",
      weather: [{ main: "Clouds", description: "broken clouds" }],
      main: {
        temp: 21,
        temp_max: 23,
        temp_min: 19,
        feels_like: 20,
        humidity: 65,
      },
    },
  ],
};

describe("WeatherTool", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("fetches OpenWeatherMap forecast with native fetch", async () => {
    const fetchMock = jest.fn<
      ReturnType<typeof fetch>,
      Parameters<typeof fetch>
    >(() =>
      Promise.resolve(
        new Response(JSON.stringify(forecastResponse), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    globalThis.fetch = fetchMock;

    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherTool,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === "OWM_API_KEY" ? "test-api-key" : undefined,
            ),
          },
        },
      ],
    }).compile();

    const tool = moduleRef.get(WeatherTool);
    const result = await tool.getWeatherForecast(
      { city: "Berlin" },
      {} as never,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestedInput] = fetchMock.mock.calls[0];
    const requestedUrl = new URL(
      typeof requestedInput === "string"
        ? requestedInput
        : requestedInput instanceof URL
          ? requestedInput.href
          : requestedInput.url,
    );
    expect(requestedUrl.href).toBe(
      "https://api.openweathermap.org/data/2.5/forecast?q=Berlin&appid=test-api-key&units=metric",
    );
    expect(result).toMatch(/Weather Forecast for Berlin:/);
    expect(result).toMatch(/Conditions: Clouds broken clouds/);
    expect(result).toMatch(/Temp: 21/);
  });
});
