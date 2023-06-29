namespace PhotovoltaicSystemCalculation.Models
{
    public class ReportData
    {
        public Product Product { get; set; }
        public IList<ElectricProduction> ElectricProductions { get; set; } // 30days
    }
}
