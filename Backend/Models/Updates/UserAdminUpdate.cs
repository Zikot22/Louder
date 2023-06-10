using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Updates
{
    public class UserAdminUpdate
    {
        [StringLength(320)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(16)]
        public string? Password { get; set; }

        public bool AdminPermissions { get; set; }
    }
}
