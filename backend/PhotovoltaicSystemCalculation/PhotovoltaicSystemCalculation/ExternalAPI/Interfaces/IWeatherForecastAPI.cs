using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.ExternalAPI.Interfaces
{
    public interface IWeatherForecastAPI
    {
        public Task<IList<WeatherDTO>> GetWeatherForecast(float latitude, float longitude, long startDate);
        public Task<WeatherDTO> GetAverageWeatherForecastPerDay(float latitude, float longitude, long date);
    }
}
