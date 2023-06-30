using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IWeatherService _weatherService;
        private readonly IPhotovoltaicService _photovoltaicService;

        public TestController(IEmailService enailService, IPhotovoltaicService photovoltaicService, IWeatherService weatherService)
        {
            _emailService = enailService;
            _weatherService = weatherService;
            _photovoltaicService = photovoltaicService;
        }

        [HttpPost("ScrapWeatherInfo")]
        public async Task<IActionResult> ScrapWeatherInfo()
        {
            var result = await _weatherService.ScrapWeatherInfo();
            return Ok(result);
        }

        [HttpPost("CalculateElectricProduction")]
        public async Task<IActionResult> CalculateElectricProduction(Product product, long startDate)
        {
            var result = await _photovoltaicService.CalculateElectricProductionPerProduct(product, startDate);
            return Ok(result);
        }

        [HttpPost("SendReport")]
        public async Task<IActionResult> SendReport(IList<ReportData> reportData, int userId, string projectName)
        {
            var result = await _emailService.SendReport(reportData, userId, projectName);
            return Ok(result);
        }
    }
}
