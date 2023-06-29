using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class SQLLiteContext : DbContext
    {
        public DbSet<UserDTO> Users { get; set; }
        public DbSet<ProjectDTO> Projects { get; set; }
        public DbSet<ProductDTO> Products { get; set; }
        public DbSet<WeatherDTO> Weathers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=psc.db");
        }
    }
}
