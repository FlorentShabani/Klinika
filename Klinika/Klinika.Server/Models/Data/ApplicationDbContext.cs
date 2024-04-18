﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Linq;
using System.Threading.Tasks;

namespace Klinika.Server.Models.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Specialization> Specializations { get; set; }

        public DbSet<HelpCenter> HelpCenters { get; set; }

        public DbSet<HelpCenterCategory> HelpCenterCategorys { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            builder.ApplyConfiguration(new ApplicationUserEntityConfiguration());

            builder.Entity<Specialization>()
                .HasKey(x => x.id);

            builder.Entity<HelpCenterCategory>()
                .HasKey(x => x.id);

            builder.Entity<HelpCenter>()
                .HasKey(x => x.id);

        }
        public class ApplicationUserEntityConfiguration : IEntityTypeConfiguration<ApplicationUser>
        {
            public void Configure(EntityTypeBuilder<ApplicationUser> builder)
            {
                builder.Property(u => u.firstName).HasMaxLength(50);
                builder.Property(u => u.lastName).HasMaxLength(50);
                builder.Property(u => u.gender).HasMaxLength(50);
            }
        }
    }
}
