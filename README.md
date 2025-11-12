# OpenWeatherMap MCP Server

This project provides a simple Model Context Protocol (MCP) server for retrieving current weather data from the OpenWeatherMap API. It is built with NestJS and exposes a tool for use in MCP-compatible agent frameworks.

## Features

- Exposes a `get-weather-forecast` tool to fetch current weather for a given city
- Integrates with OpenWeatherMap API (requires API key)
- Designed for use in MCP agent orchestration systems

## Prerequisites

- Node.js (v18+ recommended)
- Docker (optional, for containerized deployment)

## Installation

```bash
npm install
```

## Environment Variables

This project uses a `.env` file to configure the OpenWeatherMap API key. Copy `.env.example` to `.env` and fill in your API key:

```bash
cp .env.example .env
# Then edit .env and set your OWM_API_KEY
```

**.env file:**

```
OWM_API_KEY=your_openweathermap_api_key_here
```

## NPM Scripts

- `npm run start` — Start the server (production mode)
- `npm run start:dev` — Start the server in watch mode (auto-reloads on changes)
- `npm run build` — Compile TypeScript to JavaScript (output in `dist/`)

## Usage

### Local Development

1. Ensure your `.env` file is set up as described above.
2. Start the server:
   ```bash
   npm run start:dev
   ```
   The server will listen on port 8088 by default.

### Docker

You can build and run the server in a Docker container using the provided `start.sh` script:

```bash
./start.sh
```

- This script builds the Docker image and runs the container, binding port 8088 on your host to port 8088 in the container.
- If a `.env` file is present, it will be used to pass the `OWM_API_KEY` into the container automatically.

## Tool: get-weather-forecast

- **Name:** `get-weather-forecast`
- **Description:** Get current weather for a city using OpenWeatherMap API (for 5 days).
- **Parameters:**
  - `city` (string): City name to get weather for

## License

MIT
