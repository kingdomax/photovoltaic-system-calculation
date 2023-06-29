namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class WeatherDTO
    {
        public int Id { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public DateTime Date { get; set; }
        public double Temperature { get; set; }
        public double CloudCover { get; set; }
    }
}
