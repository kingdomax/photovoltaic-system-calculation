using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly SQLLiteContext _context;
        public ProductRepository(SQLLiteContext context) => _context = context;

        public async Task<IList<ProductDTO>> GetAllProducts()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<IList<ProductDTO>> GetProducts(int projectId)
        {
            return await _context.Products.Where(p => p.ProjectId == projectId).ToListAsync();
        }

        public async Task AddProduct(ProductDTO productDTO)
        {
            await _context.Products.AddAsync(productDTO);
            await _context.SaveChangesAsync();
        }

        public async Task EditProduct(ProductDTO productDTO)
        {
            var existingProduct = await _context.Products.FindAsync(productDTO.Id);
            if (existingProduct != null)
            {
                _context.Entry(existingProduct).CurrentValues.SetValues(productDTO);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception($"Product with ID {productDTO.Id} not found.");
            }
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
