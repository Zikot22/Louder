﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Ticket
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public Event? Event { get; set; }

        [Required, MaxLength(10)]
        public float Price { get; set; }

        [Required, StringLength(20)]
        public string? TypeName { get; set; }

        [StringLength(100)]
        public string? TypeDescription { get; set; }
    }
}