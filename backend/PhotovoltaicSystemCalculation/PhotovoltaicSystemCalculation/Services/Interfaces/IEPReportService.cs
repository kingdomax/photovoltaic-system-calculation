using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IEPReportService
    {
        public Task<bool> StoreReportData(IList<ReportData> report);
    }
}