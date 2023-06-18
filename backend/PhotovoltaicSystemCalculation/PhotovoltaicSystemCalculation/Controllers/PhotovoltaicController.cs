using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PhotovoltaicController : ControllerBase
    {
        private readonly IPhotovoltaicService _photovoltaicService;

        public PhotovoltaicController(IPhotovoltaicService photovoltaicService)
        {
            _photovoltaicService = photovoltaicService;
        }

        [HttpPost("Test")]
        public async Task<IActionResult> Test(ElectricProductionArgs args)
        {
            var testResult = await _photovoltaicService.CaculateElectricProduction(args);
            return Ok(testResult);
        }
    }
}
