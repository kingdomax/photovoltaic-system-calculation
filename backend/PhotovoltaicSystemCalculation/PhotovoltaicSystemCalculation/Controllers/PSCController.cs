using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ActionFilterAttributes;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PSCController : ControllerBase
    {
        private readonly IPhotovoltaicService _photovoltaicService;
        public PSCController(IPhotovoltaicService photovoltaicService)
        {
            _photovoltaicService = photovoltaicService;
        }

        [HttpPost("GenerateElectricityReport")]
        [UserExtractionFilter]
        public async Task<IActionResult> GenerateElectricityReport(GenerateReportRequest request)
        {            
            try
            {
                var result = await _photovoltaicService.GenerateElectricityReport(request.ProjectId, (int)HttpContext.Items["UserId"]);
                //var result = await _photovoltaicService.GenerateElectricityReport(request.ProjectId, 1);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("GetElectricityReport")]
        public async Task<IActionResult> GetElectricityReport(GetElectricityReportRequest request)
        {
            // return data in the format that lineChart() can use directly or if not can do it in clientside
            return Ok();
        }
    }
}
