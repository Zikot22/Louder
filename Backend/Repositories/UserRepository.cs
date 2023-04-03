using Backend.DbConfigurations;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository
    {
        private ApplicationContext context;

        public UserRepository(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsers() 
        {
            return await context.Users.ToListAsync();
        }

        public async Task AddUser(User user)
        {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }

    }
}
