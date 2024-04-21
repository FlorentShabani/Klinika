﻿using Klinika.Server.Models.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Klinika.Server.Models.User
{
    public class PrimaryCareDoctor
    {
        [Key]
        public string id { get; set; }

        [Required]
        public int specializationId { get; set; }

        [ForeignKey(nameof(specializationId))]
        [JsonIgnore]
        public virtual Specialization Specialization { get; set; }

        [ForeignKey(nameof(id))]
        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }
    }
}
