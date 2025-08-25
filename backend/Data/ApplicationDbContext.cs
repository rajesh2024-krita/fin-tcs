
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Member entity
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.MemberNo).IsUnique();
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
                
                // Set default values
                entity.Property(e => e.Status).HasDefaultValue("Active");
                entity.Property(e => e.ShareAmount).HasDefaultValue(0);
                entity.Property(e => e.CDAmount).HasDefaultValue(0);
            });
        }
    }
}
