using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
   
        public ProductController(IProductService productService) 
        {
            _productService = productService;
        }
        
        [HttpPost("GetProducts")]
        public async Task<IActionResult> GetProducts(GetProductRequest request)
        {
            try
            {
                var products = await _productService.GetProducts(request.ProjectId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("DeleteProduct")]
        public async Task<IActionResult> DeleteProduct(DeleteProductRequest request)
        {
            try
            {
                var products = await _productService.DeleteProduct(request);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
