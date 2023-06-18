namespace PhotovoltaicSystemCalculation.Models
{
    public class ElectricProductionArgs
    {
        // 6 use parameters
        public int ParameterA { get; set; }
        public int ParameterB { get; set; }
        public int ParameterC { get; set; }

        // something else for electric production calculation
        public int Day { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
    }
}
