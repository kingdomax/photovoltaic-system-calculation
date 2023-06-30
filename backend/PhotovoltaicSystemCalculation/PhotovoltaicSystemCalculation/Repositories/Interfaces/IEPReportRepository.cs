using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IEPReportRepository
    {
        public Task<IList<EPReportDTO>> GetReportByProjectId(int projectId);
        public Task<bool> AddEPReport(IList<EPReportDTO> reports);
        public Task<bool> DeleteReportByProjectId(int projectId);
    }
}
