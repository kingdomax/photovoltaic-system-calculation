using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class EPReportRepository : IEPReportRepository
    {
        private readonly SQLLiteContext _context;
        public EPReportRepository(SQLLiteContext context) => _context = context;

        public async Task<IList<EPReportDTO>> GetReportByProjectId(int projectId)
        {
            try
            {
                return await _context.ElectricProducedReport.Where(r => r.ProjectId == projectId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving report data by project id: {ex.Message}");
            }
        }

        public async Task<bool> AddEPReport(IList<EPReportDTO> reports)
        {
            try
            {
                _context.ElectricProducedReport.AddRange(reports);
                var result = await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while add report data to database {ex.Message}");
            }
        }

        public async Task<bool> DeleteReportByProjectId(int projectId)
        {
            try
            {
                var reportsToDelete = _context.ElectricProducedReport.Where(r => r.ProjectId == projectId);
                _context.ElectricProducedReport.RemoveRange(reportsToDelete);
                var result = await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting report data by project id {ex.Message}");
            }
        }
    }
}
