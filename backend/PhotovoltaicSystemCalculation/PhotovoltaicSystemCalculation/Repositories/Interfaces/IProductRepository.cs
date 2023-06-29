using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IProductRepository
    {
        public Task<IList<ProductDTO>> GetAllProducts();
        public Task<IList<ProductDTO>> GetProducts(int projectId);
        public Task<bool> DeleteProducts(int productId);
    }
}