﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Klinika.Server.Models
{
    public class Specialization
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [MaxLength(100)]
        public string name { get; set; }

        public string createdBy { get; set; }

        public DateTime creationDate { get; set; }

    }
}
