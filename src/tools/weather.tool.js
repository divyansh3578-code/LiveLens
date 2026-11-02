async function getWeather(city) {
  const locations = {
    nagpur: { latitude: 21.1458, longitude: 79.0882 },
    pune: { latitude: 18.5204, longitude: 73.8567 },
    mumbai: { latitude: 19.076, longitude: 72.8777 },
    delhi: { latitude: 28.6139, longitude: 77.209 }
  };

  const location = locations[city.toLowerCase()];

  if (!location) {
    throw new Error("Unsupported city");
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
    timezone: "auto"
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal: AbortSignal.timeout(8000) }
  );

  if (!response.ok) {
    throw new Error("Weather provider request failed");
  }

  const data = await response.json();

  return {
    city,
    current: data.current,
    timezone: data.timezone,
    fetchedAt: new Date().toISOString()
  };
}

module.exports = { getWeather };