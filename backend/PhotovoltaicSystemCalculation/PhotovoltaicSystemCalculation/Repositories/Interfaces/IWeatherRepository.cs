using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IWeatherRepository
    {
        public Task<bool> AddWeathers(IList<WeatherDTO> weathers);
    }
}