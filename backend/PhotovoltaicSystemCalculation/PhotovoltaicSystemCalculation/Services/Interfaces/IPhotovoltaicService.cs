using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IPhotovoltaicService
    {
        public Task AutomaticGenerateElectricityReport();
        public Task<bool> GenerateElectricityReport(int projectId, int userId);
        public Task<IList<ReportData>> GetElectricityReport(int projectId);
        public Task<IList<ElectricProduction>> CalculateElectricProductionPerProduct(Product product, long startDate);
    }
}
