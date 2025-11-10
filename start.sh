#!/bin/bash
# Start the OpenWeather MCP server using Docker, binding to port 8080

docker build -t openweathermap-mcp-server .

# Pass environment variables from .env if present
if [ -f .env ]; then
	docker run --rm --env-file .env -p 8088:8088 openweathermap-mcp-server
else
	echo "Warning: .env file not found. OWM_API_KEY will not be set in the container."
	docker run --rm -p 8088:8088 openweathermap-mcp-server
fi
