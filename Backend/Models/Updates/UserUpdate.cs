using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Updates
{
    public class UserUpdate
    {
        [StringLength(320)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(16, MinimumLength = 8)]
        public string? Password { get; set; }
    }
}
