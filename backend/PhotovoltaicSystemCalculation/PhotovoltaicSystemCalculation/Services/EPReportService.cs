using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class EPReportService : IEPReportService
    {
        private readonly IProductService _productService;
        private readonly IEPReportRepository _epReportRepository;
        
        public EPReportService(IProductService productService, IEPReportRepository epReportRepository) 
        {
            _productService = productService;
            _epReportRepository = epReportRepository;
        }

        public async Task<IList<ReportData>> GetElectricityReport(int projectId)
        {
            try
            {
                var products = await _productService.GetProducts(projectId);
                var reports = await _epReportRepository.GetReportByProjectId(projectId);

                var reportData = products.Select(p => new ReportData
                {
                    Product = p,
                    ElectricProductions = reports.Where(r => r.ProductId == p.Id)
                                                 .OrderBy(r => r.NoOfDay)
                                                 .Select(r => new ElectricProduction
                                                 {
                                                     EP = r.EP,
                                                     Date = DateTime.Parse(r.Date)
                                                 }).ToList()
                }).ToList();

                return reportData;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the electricity report: {ex.Message}");
            }
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

        public async Task<bool> DeleteReportByProjectId(int projectId)
        {
            try
            {
                return await _epReportRepository.DeleteReportByProjectId(projectId);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting report data by project id: {ex.Message}");
            }
        }
    }
}
