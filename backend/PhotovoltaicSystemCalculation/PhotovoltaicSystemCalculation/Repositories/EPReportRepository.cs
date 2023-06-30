using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class EPReportRepository : IEPReportRepository
    {
        private readonly SQLLiteContext _context;
        public EPReportRepository(SQLLiteContext context) => _context = context;

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
    }
}
