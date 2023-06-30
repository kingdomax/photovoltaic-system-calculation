namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class EPReportDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int ProductId { get; set; }
        public string Date { get; set; }
        public int NoOfDay { get; set; }
        public double EP { get; set; }
    }
}