using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IPhotovoltaicService _photovoltaicService;

        public TestController(IPhotovoltaicService photovoltaicService)
        {
            _photovoltaicService = photovoltaicService;
        }

        [HttpPost("CaculateElectricProduction")]
        public async Task<IActionResult> CaculateElectricProduction(ElectricProductionArgs args)
        {
            var testResult = await _photovoltaicService.CaculateElectricProduction(args);
            return Ok(testResult); // todo: need to return correct status instead of omit error
        }
    }
}
