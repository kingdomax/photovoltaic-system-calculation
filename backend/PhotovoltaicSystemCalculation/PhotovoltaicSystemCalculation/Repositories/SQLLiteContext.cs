using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class SQLLiteContext : DbContext
    {
        public DbSet<UserDto> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=psc.db");
        }
    }
}
