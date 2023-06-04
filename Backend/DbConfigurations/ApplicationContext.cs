using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.DbConfigurations
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        private readonly IConfiguration Configuration;

        public ApplicationContext(IConfiguration configuration)
        {
            Configuration = configuration;
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var a = Configuration.GetConnectionString("Louder");
            optionsBuilder.UseMySql(a,
                new MySqlServerVersion(new Version(8, 0, 32)));
        }
    }
}
