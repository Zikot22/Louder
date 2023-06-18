using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Updates
{
    public class TicketUpdate
    {
        public Event? Event { get; set; }

        public int EventId { get; set; }

        public float Price { get; set; }

        [StringLength(20)]
        public string? TypeName { get; set; }

        [StringLength(100)]
        public string? TypeDescription { get; set; }

        [StringLength(24)]
        public string? TemplateId { get; set; }
    }
}
