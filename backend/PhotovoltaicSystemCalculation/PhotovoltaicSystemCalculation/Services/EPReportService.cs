using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Services
{
    public class EPReportService : IEPReportService
    {
        private readonly IEPReportRepository _epReportRepository;
        public EPReportService(IEPReportRepository epReportRepository) 
        {
            _epReportRepository = epReportRepository;
        }

        public async Task<bool> StoreReportData(IList<ReportData> reportData)
        {
            var reportDto = new List<EPReportDTO>();

            // Flattern object
            foreach (var report in reportData) 
            { 
                for(var i=0; i<report.ElectricProductions.Count; i++)
                {
                    var ep = report.ElectricProductions[i];
                    reportDto.Add(new EPReportDTO
                    {
                        ProjectId = report.Product.ProjectId,
                        ProductId = report.Product.Id,
                        EP = ep.EP,
                        NoOfDay = i+1,
                        Date = ep.Date.ToString("yyyy-MM-dd HH:mm:ss.fff")
                    });
                }
            }

            // store in database
            return await _epReportRepository.AddEPReport(reportDto);
        }
    }
}
