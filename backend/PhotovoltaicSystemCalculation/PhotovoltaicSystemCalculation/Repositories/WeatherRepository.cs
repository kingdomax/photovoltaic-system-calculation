using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class WeatherRepository : IWeatherRepository
    {
        private readonly SQLLiteContext _context;
        public WeatherRepository(SQLLiteContext context) => _context = context;

        public async Task<bool> AddWeathers(IList<WeatherDTO> weathers)
        {
            // TODO: add list of WeatherDTO to database

            return false;
        }
    }
}
