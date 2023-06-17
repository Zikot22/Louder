using Backend.Models;
using Backend.Models.Updates;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : CurrentUserController
    {
        private readonly UserRepository rep;

        public UserController(IConfiguration config, UserRepository rep) : base(config)
        {
            this.rep = rep;
        }

        [HttpPost("{id}/avatar")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateUserAvatar([FromRoute] int id, IFormFile avatar)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (currentUser.Id != id && !currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var user = await rep.GetUserAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            if (avatar != null && avatar.Length > 0)
            {
                var fileName = "wwwroot/images/avatars/" + id.ToString() + ".jpg";
                using (var fileStream = new FileStream(fileName, FileMode.Create))
                {
                    await avatar.CopyToAsync(fileStream);
                }
                return NoContent();
            }

            return BadRequest(new { error = "Невалидное изображение" });
        }

        [HttpGet]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (!currentUser.AdminPermissions) 
            {
                return Forbid();
            }
            var searchPattern = Request.Query.FirstOrDefault(p => p.Key == "searchPattern").Value.ToString().Trim();
            var result = await rep.GetAllUsersAsync(searchPattern);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteUser([FromRoute] int id)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (!currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var user = await rep.GetUserAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            await rep.DeleteUserAsync(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult> CreateUser(User user)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (!currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var emailExist = await rep.IsEmailExist(user.Email!);
            if (emailExist) return BadRequest(new { error = "Пользователь с таким адресом электронной почты уже существует" });
            await rep.AddUserAsync(user);
            return NoContent();
        }

        [HttpPost("admin/{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateUserAdmin([FromRoute] int id, UserAdminUpdate userUpdate)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (!currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var emailExist = await rep.IsEmailExist(userUpdate.Email!);
            if (emailExist) return BadRequest(new { error = "Пользователь с таким адресом электронной почты уже существует" });
            var user = await rep.GetUserAsync(id);
            if(user == null) 
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            await rep.UpdateUserAdminAsync(id, userUpdate);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> UpdateUser([FromRoute] int id, UserUpdate userUpdate)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (currentUser.Id != id && !currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var emailExist = await rep.IsEmailExist(userUpdate.Email!);
            if (emailExist) return BadRequest(new { error = "Пользователь с таким адресом электронной почты уже существует" });
            var user = await rep.GetUserAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            await rep.UpdateUserAsync(id, userUpdate);
            return NoContent();
        }

        [HttpPost("login")]
        [IgnoreAntiforgeryToken]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Login(UserLogin loginData)
        {
            var user = await rep.LoginAsync(loginData.Email!, loginData.Password!);
            if (user != null)
            {
                var token = JsonSerializer.Serialize(GenerateToken(user));
                SetJwtCookie(token);
                return Ok(token);
            }
            return NotFound(new { error = "Пользователь не найден" });
        }

        [HttpPut("register")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult> RegisterUser(User user)
        {
            user.AdminPermissions = false;
            var emailExist = await rep.IsEmailExist(user.Email!);
            if (emailExist) return BadRequest(new { error = "Пользователь с таким адресом электронной почты уже существует" });
            await rep.AddUserAsync(user);
            var token = JsonSerializer.Serialize(GenerateToken(user));
            SetJwtCookie(token);
            return Ok(token);
        }

        [HttpGet("{id}/username")]
        [IgnoreAntiforgeryToken]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<string>> GetUsername([FromRoute] int id)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (currentUser.Id != id && !currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var user = await rep.GetUserAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "Пользователь не найден" });
            }
            var username = await rep.GetUsernameAsync(id);
            return Ok(new { name = username });
        }

        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var role = "User";
            if (user.AdminPermissions) role = "Admin";

            var claims = new[]
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Role", role),
                new Claim("Name", user.Name!),
            };
            var token = new JwtSecurityToken(config["Jwt:Issuer"],
                config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(14),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetJwtCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(14),
                HttpOnly = true
            };

            Response.Cookies.Append("jwtToken", token, cookieOptions);
        }
    }
}
