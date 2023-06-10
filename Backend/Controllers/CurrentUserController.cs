using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrentUserController : ControllerBase
    {
        protected readonly IConfiguration config;

        public CurrentUserController(IConfiguration config)
        {
            this.config = config;
        }

        protected User GetCurrentUser()
        {
            var authorization = Request.Headers[HeaderNames.Authorization];

            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
            {
                var jwtToken = headerValue.Parameter;
                if (string.IsNullOrEmpty(jwtToken))
                {
                    throw new NullReferenceException("Токен авторизации не может отсутствовать");
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
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
                    throw new SecurityTokenValidationException("Токен авторизации не прошёл проверку");
                }
            }

            return null!;
        }
    }
}
