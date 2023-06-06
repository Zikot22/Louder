using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Purchase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        public User? User { get; set; }

        [Required]
        public int TicketId { get; set; }

        public Ticket? Ticket { get; set; }

        public int Count { get; set; }
    }
}
