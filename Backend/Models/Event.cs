using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Event
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, StringLength(200)]
        public string? Name { get; set; }

        [Required, StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(60)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Adress { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public int Amount { get; set; }

        [Required, StringLength(41)]
        public string? Cover { get; set; }
    }
}
