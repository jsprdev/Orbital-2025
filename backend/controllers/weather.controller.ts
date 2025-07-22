import { Request, Response, Router } from 'express';
import { WeatherService } from '../services/weather.service';

const weatherService = new WeatherService();
const router = Router();


router.get('/forecast', async (req: Request, res: Response) => {
  console.log("I AM BEING CALLED")
  try {
    const { location } = req.query;
    if (!location) {
      res.status(400).json({ error:'Location is required' });
      return;
    }
    const data = await weatherService.getWeeklyForecast(location as string);
    
    const forecast = data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      chance_of_rain: day.day.daily_chance_of_rain,
      condition: day.day.condition.text
    }));
    res.json({ location: data.location, forecast });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

export default router;