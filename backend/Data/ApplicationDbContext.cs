using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Models;
using System.Security.Cryptography;

namespace MemberManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Society> Societies { get; set; }
        public DbSet<SocietyChangeRequest> SocietyChangeRequests { get; set; }
        public DbSet<ChangeApprovalLog> ChangeApprovalLogs { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Demand> Demands { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<LoanReceipt> LoanReceipts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasConversion<string>();
            });

            // Configure Society entity
            modelBuilder.Entity<Society>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Configure Member entity
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasIndex(e => e.MemberNo).IsUnique();
                entity.Property(e => e.ShareAmount).HasPrecision(18, 2);
                entity.Property(e => e.CDAmount).HasPrecision(18, 2);
                entity.Property(e => e.ShareDeduction).HasPrecision(18, 2);
                entity.Property(e => e.Withdrawal).HasPrecision(18, 2);
                entity.Property(e => e.GLoanInstalment).HasPrecision(18, 2);
                entity.Property(e => e.ELoanInstalment).HasPrecision(18, 2);
            });

            // Configure relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Society)
                .WithMany(s => s.Users)
                .HasForeignKey(u => u.SocietyId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Member>()
                .HasOne(m => m.Society)
                .WithMany(s => s.Members)
                .HasForeignKey(m => m.SocietyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Member)
                .WithMany()
                .HasForeignKey(l => l.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Society)
                .WithMany(s => s.Loans)
                .HasForeignKey(l => l.SocietyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LoanReceipt>()
                .HasOne(lr => lr.Loan)
                .WithMany(l => l.LoanReceipts)
                .HasForeignKey(lr => lr.LoanId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed test users
            SeedTestUsers(modelBuilder);
        }

        private void SeedTestUsers(ModelBuilder modelBuilder)
        {
            // Create test society
            modelBuilder.Entity<Society>().HasData(
                new Society
                {
                    Id = 1,
                    Name = "Test Society",
                    RegistrationNo = "REG001",
                    Address = "Test Address",
                    Phone = "1234567890",
                    EstablishedDate = DateTime.Now.AddYears(-5),
                    CreatedDate = DateTime.Now
                }
            );

            // Create test users with plain passwords
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "superadmin",
                    PasswordHash = "password", // Plain text password
                    Role = "SuperAdmin",
                    SocietyId = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    Username = "societyadmin",
                    PasswordHash = "password", // Plain text password
                    Role = "SocietyAdmin",
                    SocietyId = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                },
                new User
                {
                    Id = 3,
                    Username = "accountant1",
                    PasswordHash = "password", // Plain text password
                    Role = "Accountant",
                    SocietyId = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                },
                new User
                {
                    Id = 4,
                    Username = "member1",
                    PasswordHash = "password", // Plain text password
                    Role = "Member",
                    SocietyId = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                }
            );
        }
    }
}