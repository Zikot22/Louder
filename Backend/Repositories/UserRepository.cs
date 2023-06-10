using Backend.DbConfigurations;
using Backend.Models;
using Backend.Models.Updates;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

namespace Backend.Repositories
{
    public class UserRepository
    {
        private ApplicationContext context;

        public UserRepository(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync(string searchPattern) 
        {
            IQueryable<User> query = context.Users;
            if (!string.IsNullOrWhiteSpace(searchPattern))
            {
                query = query.Where(e =>
                    EF.Functions.Like(e.Id.ToString(), $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Name!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Email!, $"%{searchPattern}%") ||
                    EF.Functions.Like(e.Password!, $"%{searchPattern}%"));
            }
            return await query.ToListAsync();
        }

        public async Task AddUserAsync(User user)
        {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }

        public async Task<User> GetUserAsync(int id)
        {
            return await context.Users.FirstAsync(u => u.Id == id);
        }

        public async Task DeleteUserAsync(int id) 
        {
            await context.Users.Where(u => u.Id == id).ExecuteDeleteAsync();
            await context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(int id, UserUpdate userUpdate)
        {
            var user = await context.Users.FirstAsync(u => u.Id == id);

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

            await context.SaveChangesAsync();
        }

        public async Task UpdateUserAdminAsync(int id, UserAdminUpdate userUpdate)
        {
            var user = await context.Users.FirstAsync(u => u.Id == id);

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

            user.AdminPermissions = userUpdate.AdminPermissions;

            await context.SaveChangesAsync();
        }

        public async Task<User> LoginAsync(string email, string password) 
        {
            var user = await context.Users.Where(u => u.Email == email && u.Password == password).FirstOrDefaultAsync();
            return user!;
        }

        public async Task<bool> IsEmailExist(string email) 
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false;
            return true;
        }

        public async Task<string> GetUsernameAsync(int id)
        {
            var user = await context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
            return user!.Name!;
        }
    }
}
