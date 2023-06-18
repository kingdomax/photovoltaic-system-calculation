using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IWeatherRepository
    {
        public Task<IList<WeatherDTO>> GetWeatherForecast(int month, int year);
    }
}
