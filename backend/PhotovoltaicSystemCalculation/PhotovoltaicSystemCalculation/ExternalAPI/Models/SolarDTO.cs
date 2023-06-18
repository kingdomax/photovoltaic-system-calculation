namespace PhotovoltaicSystemCalculation.ExternalAPI.Models
{
    public class SolarDTO
    {
        public int Year { get; set; }
        public IDictionary<int, double> Irradiance { get; set; } // key = month, value = year
    }
}
