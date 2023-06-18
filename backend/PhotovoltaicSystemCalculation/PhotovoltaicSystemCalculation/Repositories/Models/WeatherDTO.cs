namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class WeatherDTO
    {
        public DateTime Date { get; set; }
        public double CloudCover { get; set; }
        public double Temperature { get; set; } // Kelvin
    }
}
