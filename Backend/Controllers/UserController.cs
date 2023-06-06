using Backend.Models;
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
    public class UserController : ControllerBase
    {
        private readonly UserRepository rep;
        private readonly IConfiguration config;

        public UserController(UserRepository rep, IConfiguration config)
        {
            this.rep = rep;
            this.config = config;
        }

        [HttpPost("avatar")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<ActionResult> UpdateUserAvatar(IFormFile avatar)
        {
            var user = GetCurrentUser();
            if (user == null)
            {
                return Unauthorized();
            }
            if (avatar != null && avatar.Length > 0)
            {
                var fileName = "wwwroot/images/avatars/" + user.Id.ToString() + ".jpg";
                using (var fileStream = new FileStream(fileName, FileMode.Create))
                {
                    await avatar.CopyToAsync(fileStream);
                }
                return NoContent();
            }

            return BadRequest("Invalid avatar file.");
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var result = await rep.GetAllUsers();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<User>> GetUser([FromRoute] int id)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            if (currentUser.Id != id || !currentUser.AdminPermissions)
            {
                return Forbid();
            }
            var result = await rep.GetUser(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> DeleteUser([FromRoute] int id)
        {
            await rep.DeleteUser(id);
            return NoContent();
        }

        [HttpPut]
        [ProducesResponseType(204)]
        public async Task<ActionResult> CreateUser(User user)
        {
            await rep.AddUser(user);
            return NoContent();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(204)]
        public async Task<ActionResult> UpdateUser([FromRoute] int id, User user)
        {
            await rep.UpdateUser(id, user);
            return NoContent();
        }

        [HttpPost("login")]
        [IgnoreAntiforgeryToken]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> Login(UserLogin loginData)
        {
            var user = await rep.Login(loginData.Email, loginData.Password);
            if (user != null)
            {
                var token = JsonSerializer.Serialize(GenerateToken(user));
                SetJwtCookie(token);
                return Ok(token);
            }
            return NotFound("user not found");
        }

        [HttpPut("register")]
        [ProducesResponseType(200)]
        public async Task<ActionResult> RegisterUser(User user)
        {
            user.AdminPermissions = false;
            await rep.AddUser(user);
            var token = JsonSerializer.Serialize(GenerateToken(user));
            SetJwtCookie(token);
            return Ok(token);
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

        private User GetCurrentUser()
        {
            var authorization = Request.Headers[HeaderNames.Authorization];

            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var jwtToken = headerValue.Parameter;
                if (string.IsNullOrEmpty(jwtToken))
                {
                    return null;
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"])),
                    ValidateIssuer = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = config["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                };

                try
                {
                    var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out _);
                    int.TryParse(principal.FindFirst("Id")?.Value, out var id);
                    var adminPermissions = principal.FindFirst("Role")?.Value == "Admin";

                    if (id > 0)
                    {
                        return new User
                        {
                            Id = id,
                            AdminPermissions = adminPermissions,
                            Name = principal.FindFirst("Name")?.Value
                        };
                    }
                }
                catch (Exception)
                {
                    // Token validation failed
                }
            }

            return null;
        }
    }
}
