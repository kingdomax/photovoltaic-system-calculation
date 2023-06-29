using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        
        public ProductService(IProductRepository productRepository) 
        {
            _productRepository = productRepository;
        }

        public async Task<IList<Product>> GetProducts(int projectId)
        {
            var productDTOs = await _productRepository.GetProducts(projectId);
            return productDTOs.Select(p => new Product
            {
                Id = p.Id,
                Name = p.Name,
                Latitude = p.Latitude,
                Longitude = p.Latitude,
                Area = p.Area,
                Inclination = p.Inclination,
                Orientation = p.Orientation,
                Powerpeak = p.Powerpeak
            }).ToList();
        }

        public async Task<IList<Product>> DeleteProduct(DeleteProductRequest request)
        {
            var result = await _productRepository.DeleteProducts(request.ProductId);
            return await GetProducts(request.ProjectId);
        }
    }
}
