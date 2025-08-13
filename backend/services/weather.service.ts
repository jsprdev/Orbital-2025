import axios from 'axios';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY; 

export class WeatherService {
  async getWeeklyForecast(location: string) {
    const url = `http://api.weatherapi.com/v1/forecast.json`;
    const params = {
      key: WEATHER_API_KEY,
      q: location,
      days: 7,
    };
    const response = await axios.get(url, { params });
    return response.data;
  }
}