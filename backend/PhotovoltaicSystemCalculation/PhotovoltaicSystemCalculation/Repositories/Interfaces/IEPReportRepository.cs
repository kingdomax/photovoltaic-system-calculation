using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IEPReportRepository
    {
        public Task<bool> AddEPReport(IList<EPReportDTO> reports);
    }
}
