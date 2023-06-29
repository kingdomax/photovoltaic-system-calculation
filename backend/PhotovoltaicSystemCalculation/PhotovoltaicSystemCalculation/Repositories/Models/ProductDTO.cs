namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Area { get; set; }
        public float Inclination { get; set; }
        public int Orientation { get; set; }
        public float Powerpeak { get; set; }
        public float Efficiency { get; set; }
    }
}