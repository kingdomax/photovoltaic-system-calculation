using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Helpers;
using PhotovoltaicSystemCalculation.ExternalAPI.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class PhotovoltaicService : IPhotovoltaicService
    {
        private readonly ISolarAPI _solarAPI;
        private readonly IWeatherForecastAPI _weatherForecastAPI;
        private readonly IDictionary<int, int> _sunlightHours;
        private readonly IProductService _productService;
        private readonly IProjectRepository _projectRepository;
        private readonly IEmailService _emailService;
        private readonly IEPReportService _epReportService;
        private readonly IProjectService _projectService;

        public PhotovoltaicService(
            ISolarAPI solarAPI,
            IWeatherForecastAPI weatherForecastAPI,
            IProductService productService,
            IProjectRepository projectRepository,
            IEmailService emailService,
            IEPReportService epReportService,
            IProjectService projectService)
        {
            _solarAPI = solarAPI;
            _weatherForecastAPI = weatherForecastAPI;
            _productService = productService;
            _projectRepository = projectRepository;
            _emailService = emailService;
            _epReportService = epReportService;
            _projectService = projectService;
            _sunlightHours = new Dictionary<int, int>() // Peak Sunlight Hours (Average in Germany)
            {
                { 1, 3 }, // key=month
                { 2, 4 },
                { 3, 5 },
                { 4, 6 },
                { 5, 7 },
                { 6, 7 },
                { 7, 7 },
                { 8, 6 },
                { 9, 5 },
                { 10, 4 },
                { 11, 3 },
                { 12, 2 }
            };
        }

        public async Task<IList<ElectricProduction>> CalculateElectricProductionPerProduct(Product product, long startDate)
        {
            var sunInfo = await _solarAPI.FetchSolarInformation(product.Latitude, product.Longitude, product.Inclination, product.Orientation);
            var weatherInfo = await _weatherForecastAPI.Get30DaysWeatherForecast(product.Latitude, product.Longitude, startDate);
            return Calculate(product, sunInfo, weatherInfo);
        }

        private IList<ElectricProduction> Calculate(Product product, SolarDTO sunInfo, IList<WeatherDTO> weatherList)
        {
            var electricResults = new List<ElectricProduction>();
            
            //Mapping month with Solar Irridance
            foreach (var weather in weatherList)
            {
                int month = weather.Date.Month;
                float sunIrridance = sunInfo.Irradiance[month];

                //Calculate adjustedIrradiance [Adjusted Irradiance (kW/m²) = Solar Irradiance * Efficiency * (1 - Cloud Cover) * Area of solar cell]
                double adjustedIrradiance = sunIrridance * product.Efficiency * (1 - weather.CloudCover) * product.Area;

                //Calculate adjustedPeakPower [Adjusted Peak Power (kW) = Peak Power (kW) * (1 - Temp Coeff * (Temp - 25))]
                double adjustedPeakPower = product.Powerpeak * (1 - 0.005 * (weather.Temperature - 25));

                //Calculate Electricity Production per day
                int sunlightHours = _sunlightHours[month];
                double electricityProduction = adjustedIrradiance * adjustedPeakPower * sunlightHours;

                // convert from kilowatts to watts and round the digit
                double electricityProductionInWatts = Math.Round(electricityProduction * 1000, 2);

                electricResults.Add(new ElectricProduction()
                {
                    EP = electricityProductionInWatts,
                    Date = weather.Date
                });
            }
            return electricResults;
        }

        public async Task<bool> GenerateElectricityReport(int projectId, int userId)
        {
            Console.WriteLine($"[GenerateElectricityReport()] projectId: {projectId}, userId: {userId}");

            // 0. Prepare all product and project information
            var project = new ProjectDTO();
            IList<Product> allProduct = new List<Product>();
            try
            {
                Console.WriteLine($"[GenerateElectricityReport()] Retreiving all product and project information from database..");
                project = await _projectRepository.GetProject(projectId);
                allProduct = await _productService.GetProducts(projectId);
            }
            catch (Exception ex) { throw new Exception($"An error occurred while retreiving all product and project information from database"); }

            // 1. Calculate electricity for all products inside this project
            var startDate = DateTimeHelper.GetCurrentUnixTimestampMinusThreeHours();
            var reportData = new List<ReportData>();
            try
            {
                Console.WriteLine($"[GenerateElectricityReport()] Calculate electricity for all product..");
                foreach (var product in allProduct) 
                {
                    var electricProduction = await CalculateElectricProductionPerProduct(product, startDate);
                    reportData.Add(new ReportData
                    {
                        Product = product,
                        ElectricProductions = electricProduction
                    });
                }
            }
            catch (Exception ex) { throw new Exception($"An error occurred while calculate electricity for all product"); }

            // 2. Store in database
            bool isStoreReportDataInDB = false;
            try
            {
                Console.WriteLine($"[GenerateElectricityReport()] Store electricity report to database...");
                await _epReportService.DeleteReportByProjectId(projectId);
                isStoreReportDataInDB = await _epReportService.StoreReportData(reportData);
            }
            catch (Exception ex) { throw new Exception($"An error occurred while store electricity report to database"); }

            // 3. Send mail
            bool isSendMailSuccess = false;
            try
            {
                Console.WriteLine($"[GenerateElectricityReport()] Sending report data to user email...");
                isSendMailSuccess = await _emailService.SendReport(reportData, userId, project.Name);
            }
            catch (Exception ex) { throw new Exception($"An error occurred while sending report data to user email"); }

            // 4. Mark flag in project.status
            bool isSetProjectToReadOnly = false;
            try
            {
                Console.WriteLine($"[GenerateElectricityReport()] Marking project as read-only...");
                isSetProjectToReadOnly = await _projectService.MarkProjectAsReadOnly(projectId);
            }
            catch (Exception ex) { throw new Exception($"An error occurred while marking project as read-only"); }

            Console.WriteLine($"[GenerateElectricityReport()] isStoreReportDataInDB: {isStoreReportDataInDB}, isSendMailSuccess: {isSendMailSuccess}, isSetProjectToReadOnly: {isSetProjectToReadOnly}");
            return isStoreReportDataInDB && isSendMailSuccess && isSetProjectToReadOnly;
        }

        public async Task AutomaticGenerateElectricityReport()
        {
            // check projec.status and projec.date > 30
            var oldProjects = await _projectService.GetOldProjects();

            foreach (var project in oldProjects)
            {
                await GenerateElectricityReport(project.Id, project.OwnerId);
            }
        }
    }
}
