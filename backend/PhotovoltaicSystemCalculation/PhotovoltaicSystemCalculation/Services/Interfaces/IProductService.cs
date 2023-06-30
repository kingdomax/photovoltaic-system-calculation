using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IProductService
    {
        public Task AddProduct(Product product);
        public Task EditProduct(Product product);
        public Task<IList<Product>> GetProducts(int projectId);
        public Task<IList<Product>> DeleteProduct(DeleteProductRequest request);
    }
}