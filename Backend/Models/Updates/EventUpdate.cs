using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Updates
{
    public class EventUpdate
    {
        [StringLength(200)]
        public string? Name { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(60)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Adress { get; set; }

        public DateTime DateTime { get; set; }

        public int Amount { get; set; }
    }
}
