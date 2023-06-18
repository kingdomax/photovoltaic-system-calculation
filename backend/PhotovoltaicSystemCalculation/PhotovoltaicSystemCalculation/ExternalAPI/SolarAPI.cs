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
                Irradiance = new Dictionary<int, float>()
                {
                    { 1, 1f },
                    { 2, 5f },
                    { 3, 10f },
                    { 4, 15f },
                    { 5, 20f },
                    { 6, 1f },
                    { 7, 1f },
                    { 8, 1f },
                    { 9, 1f },
                    { 10, 1f },
                    { 11, 1f },
                    { 12, 1f },
                }
            };

            return mockData;
        }
    }
}
