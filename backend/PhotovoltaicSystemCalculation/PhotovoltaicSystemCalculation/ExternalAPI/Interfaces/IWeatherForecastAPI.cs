using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.ExternalAPI.Interfaces
{
    public interface IWeatherForecastAPI
    {
        public Task<IList<WeatherDTO>> Get30DaysWeatherForecast(float latitude, float longitude, long startDate);
        public Task<WeatherDTO> GetDialyWeatherForCronjob(float latitude, float longitude);
    }
}
