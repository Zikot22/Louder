using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(320)]
        public string? Email { get; set; }

        [Required, StringLength(100)]
        public string? Name { get; set; }

        [Required, StringLength(16)]
        public string? Password { get; set; }

        public bool AdminPermissions { get; set;}
    }
}
