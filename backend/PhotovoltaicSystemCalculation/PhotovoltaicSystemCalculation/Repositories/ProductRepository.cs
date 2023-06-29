using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly SQLLiteContext _context;
        public ProductRepository(SQLLiteContext context) => _context = context;

        public async Task<IList<ProductDTO>> GetProducts(int projectId)
        {
            return await _context.Products.Where(p => p.ProjectId == projectId).ToListAsync();
        }

        public async Task<bool> DeleteProducts(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
