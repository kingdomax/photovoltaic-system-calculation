using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IWeatherRepository
    {
        public Task<IList<WeatherDTO>> GetWeatherForecast(float latitude, float longitude, string startDate, string endDate);
    }
}
