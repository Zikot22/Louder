using Backend.DbConfigurations;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

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

        public async Task<User> GetUser(int Id)
        {
            return await context.Users.FirstAsync(u => u.Id == Id);
        }

        public async Task DeleteUser(int Id) 
        {
            await context.Users.Where(u => u.Id == Id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateUser(int Id, User userUpdate)
        {
            var user = await context.Users.FirstAsync(u => u.Id == Id);

            if (!string.IsNullOrWhiteSpace(userUpdate.Password)) 
            {
                user.Password = userUpdate.Password;
            }
            if (!string.IsNullOrWhiteSpace(userUpdate.Email))
            {
                user.Email = userUpdate.Email;
            }
            if (!string.IsNullOrWhiteSpace(userUpdate.Name))
            {
                user.Name = userUpdate.Name;
            }
            if (!string.IsNullOrWhiteSpace(userUpdate.Avatar))
            {
                user.Avatar = userUpdate.Avatar;
            }

            user.AdminPermissions = userUpdate.AdminPermissions;

            context.SaveChanges();
        }

        public async Task<User> Login(string email, string password) 
        {
            return await context.Users.Where(u => u.Email == email && u.Password == password).FirstOrDefaultAsync();
        }
    }
}
