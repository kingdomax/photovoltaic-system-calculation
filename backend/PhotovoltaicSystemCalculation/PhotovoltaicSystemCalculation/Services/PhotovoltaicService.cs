using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.ExternalAPI.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class PhotovoltaicService : IPhotovoltaicService
    {
        private readonly ISolarAPI _solarAPI;
        private readonly IWeatherForecastAPI _weatherForecastAPI;
        private readonly IDictionary<int, int> _sunlightHours;

        public PhotovoltaicService(ISolarAPI solarAPI, IWeatherForecastAPI weatherForecastAPI)
        {
            _solarAPI = solarAPI;
            _weatherForecastAPI = weatherForecastAPI;
            _sunlightHours = new Dictionary<int, int>() // Peak Sunlight Hours (Average in Germany)
            {
                { 1, 3 }, // key=month
                { 2, 4 },
                { 3, 5 },
                { 4, 6 },
                { 5, 7 },
                { 6, 7 },
                { 7, 7 },
                { 8, 6 },
                { 9, 5 },
                { 10, 4 },
                { 11, 3 },
                { 12, 2 }
            };
        }

        public async Task<IList<ElectricProduction>> CaculateElectricProduction(ElectricProductionArgs args)
        {
            var sunInfo = await _solarAPI.FetchSolarInformation(args.Latitude, args.Longitude, args.Inclination, args.Orientation);
            var weatherInfo = await _weatherForecastAPI.Get30DaysWeatherForecast(args.Latitude, args.Longitude, args.StartDate);
            return CalculateElectricProductionPerProduct(args, sunInfo, weatherInfo);
        }

        private IList<ElectricProduction> CalculateElectricProductionPerProduct(ElectricProductionArgs args, SolarDTO sunInfo, IList<WeatherDTO> weatherList)
        {
            var electricResults = new List<ElectricProduction>();
            
            //Mapping month with Solar Irridance
            foreach (var weather in weatherList)
            {
                int month = weather.DateTime.Month;
                float sunIrridance = sunInfo.Irradiance[month];

                //Calculate adjustedIrradiance [Adjusted Irradiance (kW/m²) = Solar Irradiance * Efficiency * (1 - Cloud Cover) * Area of solar cell]
                float adjustedIrradiance = sunIrridance * args.Efficiency * (1f - weather.CloudCover) * args.Area;

                //Calculate adjustedPeakPower [Adjusted Peak Power (kW) = Peak Power (kW) * (1 - Temp Coeff * (Temp - 25))]
                float adjustedPeakPower = args.PeakPower * (1f - 0.005f * (weather.Temperature - 25f));

                //Calculate Electricity Production per day
                int sunlightHours = _sunlightHours[month];
                float electricityProduction = adjustedIrradiance * adjustedPeakPower * sunlightHours;

                // convert from kilowatts to watts and round the digit
                double electricityProductionInWatts = Math.Round(electricityProduction * 1000, 2);

                electricResults.Add(new ElectricProduction()
                {
                    EP = electricityProductionInWatts,
                    Date = weather.DateTime
                });
            }
            return electricResults;
        }
    }
}
