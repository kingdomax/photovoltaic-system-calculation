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
            try
            {
                _context.Weathers.AddRange(weathers);
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while creating a new project in the database: {ex.Message}");
            }
        }
    }
}
