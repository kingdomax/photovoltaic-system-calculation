using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IEPReportService
    {
        public Task<IList<ReportData>> GetElectricityReport(int projectId);
        public Task<bool> DeleteReportByProjectId(int projectId);
        public Task<bool> StoreReportData(IList<ReportData> report);
    }
}