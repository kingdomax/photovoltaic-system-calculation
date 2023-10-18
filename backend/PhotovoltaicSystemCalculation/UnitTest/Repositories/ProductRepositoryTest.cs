using Moq;
using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Repositories;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace UnitTest.Repositories
{
    // It is pain in the ass to test SQLLiteContext and DbSet.
    // Need to find the better way, skip it for now !
    public class ProductRepositoryTest
    {
        public class ProductRepositoryTests
        {
            private readonly Mock<SQLLiteContext> _mockDbContext;
            private readonly ProductRepository _productRepository;

            public ProductRepositoryTests()
            {
                _mockDbContext = new Mock<SQLLiteContext>();
                _productRepository = new ProductRepository(_mockDbContext.Object);
            }

            //[Fact]
            public async Task GetAllProducts_ReturnsAllProducts()
            {
                // Arrange
                var data = new List<ProductDTO>
                {
                    new ProductDTO { Id = 1, Name = "Product1" },
                    new ProductDTO { Id = 2, Name = "Product2" },
                    new ProductDTO { Id = 3, Name = "Product3" }
                }.AsQueryable();
                var mockDbSet = new Mock<DbSet<ProductDTO>>();
                mockDbSet.As<IQueryable<ProductDTO>>().Setup(m => m.Provider).Returns(data.Provider);
                mockDbSet.As<IQueryable<ProductDTO>>().Setup(m => m.Expression).Returns(data.Expression);
                mockDbSet.As<IQueryable<ProductDTO>>().Setup(m => m.ElementType).Returns(data.ElementType);
                mockDbSet.As<IQueryable<ProductDTO>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());

                var mockDbContext = new Mock<SQLLiteContext>();
                mockDbContext.Setup(c => c.Products).Returns(mockDbSet.Object);
                var repository = new ProductRepository(mockDbContext.Object);

                // Act
                var products = await repository.GetAllProducts();

                // Assert
                Assert.Equal(3, products.Count);
                Assert.Equal("Product1", products[0].Name);
                Assert.Equal("Product2", products[1].Name);
                Assert.Equal("Product3", products[2].Name);
            }

            //[Fact]
            public async Task AddProduct_CallsAddAndSaveChanges()
            {
                // Arrange
                var product = new ProductDTO();

                // Act
                await _productRepository.AddProduct(product);

                // Assert
                _mockDbContext.Verify(m => m.AddAsync(product, default), Times.Once);
                _mockDbContext.Verify(m => m.SaveChangesAsync(default), Times.Once);
            }
        }
    }
}
