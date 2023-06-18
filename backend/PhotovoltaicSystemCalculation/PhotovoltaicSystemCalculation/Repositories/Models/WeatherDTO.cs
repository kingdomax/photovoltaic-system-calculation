namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class WeatherDTO
    {
        public DateTime Date { get; set; }
        public float CloudCover { get; set; }
        public float Temperature { get; set; } // Kelvin
    }
}
