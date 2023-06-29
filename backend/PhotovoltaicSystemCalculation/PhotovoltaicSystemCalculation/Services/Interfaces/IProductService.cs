using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IProductService
    {
        public Task<IList<Product>> GetProducts(int projectId);
        public Task<IList<Product>> DeleteProduct(DeleteProductRequest request);
    }
}