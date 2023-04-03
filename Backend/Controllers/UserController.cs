using Backend.DbConfigurations;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private UserRepository rep;

        public UserController(UserRepository rep)
        {
            this.rep = rep;
        }

        [HttpGet(Name = "Get")]
        public async Task<IEnumerable<User>> GetUser()
        {
            return await rep.GetAllUsers();
        }
        
        [HttpPut(Name = "Create")]
        public async Task CreateUser(User user)
        {
            await rep.AddUser(user);
        }
    }
}
