using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.DbConfigurations
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        private readonly IConfiguration Configuration;

        public ApplicationContext(IConfiguration configuration)
        {
            Configuration = configuration;
            //Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(Configuration.GetConnectionString("Louder"),
                new MySqlServerVersion(new Version(8, 0, 32)));
        }
    }
}
