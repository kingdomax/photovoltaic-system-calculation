using PhotovoltaicSystemCalculation.ExternalAPI.Models;

namespace PhotovoltaicSystemCalculation.ExternalAPI.Interfaces
{
    public interface ISolarAPI
    {
        public Task<SolarDTO> FetchSolarInformation(float latitude, float longitude, int inclination, int orientation);
    }
}