namespace PhotovoltaicSystemCalculation.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Area { get; set; }
        public float Inclination { get; set; }
        public int Orientation { get; set; }
        public float Powerpeak { get; set; }
        public int ProjectId { get; set; }
    }
}
