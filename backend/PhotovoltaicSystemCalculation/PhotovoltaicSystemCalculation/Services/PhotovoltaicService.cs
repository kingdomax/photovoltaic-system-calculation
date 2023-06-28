using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.ExternalAPI.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class PhotovoltaicService : IPhotovoltaicService
    {
        private readonly ISolarAPI _solarAPI;
        private readonly IWeatherRepository _weatherRepository;

        public PhotovoltaicService(ISolarAPI solarAPI, IWeatherRepository weatherRepository)
        {
            _solarAPI = solarAPI;
            _weatherRepository = weatherRepository;
        }

        public async Task<float> CaculateElectricProduction(ElectricProductionArgs args)
        {
            var sunInfo = await _solarAPI.FetchSolarInformation(args.Latitude, args.Longitude, args.Inclination, args.Orientation); // call solar API to get sun information for the entire year
            var weatherInfo = await _weatherRepository.GetWeatherForecast(args.Latitude, args.Longitude, args.StartDate, args.EndDate); // call weather API to get weather for specific date

            return CaculateElectricProductionPerDay(args, sunInfo, weatherInfo);
        }

        private float CaculateElectricProductionPerDay(ElectricProductionArgs args, SolarDTO sunInfo, IList<WeatherDTO> weatherList)
        {
            // TODO: Implement electric production calculation
            return 9999.1234f;
        }
    }
}
