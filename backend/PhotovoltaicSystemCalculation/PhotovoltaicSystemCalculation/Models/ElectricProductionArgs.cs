namespace PhotovoltaicSystemCalculation.Models
{
    public class ElectricProductionArgs
    {
        // parameters use for Solar API
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int Inclination { get; set; }
        public int Orientation { get; set; }

        // parameters use for Weather API
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}
