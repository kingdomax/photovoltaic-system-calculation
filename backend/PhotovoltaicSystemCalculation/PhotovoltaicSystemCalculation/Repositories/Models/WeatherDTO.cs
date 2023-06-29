namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class WeatherDTO
    {
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public DateTime DateTime { get; set; }
        public float Temperature { get; set; }
        public float CloudCover { get; set; }
    }
}
