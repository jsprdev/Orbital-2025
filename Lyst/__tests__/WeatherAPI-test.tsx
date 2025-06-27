import { getWeatherForecast } from '@/utils/api';


jest.mock('../FirebaseConfig', () => ({
    initializeApp: jest.fn(),
    getAuth: jest.fn(),
  }));

describe('getWeatherForecast', () => {
  it('returns weather data for a location', async () => {
    const mockWeather = { forecast: 'sunny', temp: 30 };
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockWeather) })
    ) as jest.Mock;

    const data = await getWeatherForecast('Singapore');
    expect(data).toEqual(mockWeather);
    expect(global.fetch).toHaveBeenCalled();
  });
});
