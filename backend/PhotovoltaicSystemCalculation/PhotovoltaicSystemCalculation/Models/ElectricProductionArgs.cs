namespace PhotovoltaicSystemCalculation.Models
{
    public class ElectricProductionArgs
    {
        //parameters use for Solar API
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int Inclination { get; set; }
        public int Orientation { get; set; }

        //parameters use for Weather API
        public long StartDate { get; set; }

        //parameters use for Electric Production
        public float Efficiency { get; set; }
        public float PeakPower { get; set; }

        public float Area { get; set; }
    }
}
