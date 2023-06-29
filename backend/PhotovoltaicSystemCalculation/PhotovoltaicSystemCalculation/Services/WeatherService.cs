using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IWeatherForecastAPI _weatherForecastApi;
        private readonly IWeatherRepository _weatherRepository;
        private readonly IProductRepository _productRepository;
        
        public WeatherService(IWeatherForecastAPI weatherForecastApi, IProductRepository productRepository, IWeatherRepository weatherRepository) 
        {
            _productRepository = productRepository;
            _weatherForecastApi = weatherForecastApi;
            _weatherRepository = weatherRepository;
        }


        public async Task<bool> ScrapWeatherInfo()
        {
            // 1) Look at product table for all lat, long possibility
            IList<ProductDTO> products = await _productRepository.GetAllProducts();

            // 2) Send list of lat-lng to Weather API to retrive List<WeatherDto> (loop all products) Then add WeatherDTO to List
            IList<WeatherDTO> allWeathers = new List<WeatherDTO>();
            foreach (var product in products)
            {
                WeatherDTO weatherInfo = await _weatherForecastApi.GetDialyWeatherForCronjob(product.Latitude, product.Longitude);
                allWeathers.Add(weatherInfo);
            }

            // 3) Add List<WeatherDto> to Weather table in database
            bool status = await _weatherRepository.AddWeathers(allWeathers);

            return status;
        }
    }
}
