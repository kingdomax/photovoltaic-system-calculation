using PhotovoltaicSystemCalculation.ExternalAPI.Models;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;

namespace PhotovoltaicSystemCalculation.ExternalAPI
{
    public class SolarAPI : ISolarAPI
    {
        public async Task<SolarDTO> FetchSolarInformation(int year)
        {
            // TODO: This method willcall solar API to get solar information
            var mockData = new SolarDTO
            {
                Year = 2023,
                Irradiance = new Dictionary<int, double>()
                {
                    { 1, 1d },
                    { 2, 5d },
                    { 3, 10d },
                    { 4, 15d },
                    { 5, 20d },
                    { 6, 1d },
                    { 7, 1d },
                    { 8, 1d },
                    { 9, 1d },
                    { 10, 1d },
                    { 11, 1d },
                    { 12, 1d },
                }
            };

            return mockData;
        }
    }
}
