using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class WeatherRepository : IWeatherRepository
    {
        public async Task<IList<WeatherDTO>> GetWeatherForecast(int month, int year)
        {
            // TODO: This method will be receive list of weather data from database 
            var mockData = new List<WeatherDTO>()
            {
                new WeatherDTO { Date = DateTime.Now.AddDays(-1), CloudCover = 0d, Temperature = 270d },
                new WeatherDTO { Date = DateTime.Now, CloudCover = 0.5d, Temperature = 260d },
                new WeatherDTO { Date = DateTime.Now.AddDays(1), CloudCover = 1d, Temperature = 250d },
            };

            return mockData;
        }
    }
}
