namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IWeatherService
    {
        public Task<bool> ScrapWeatherInfo();
    }
}