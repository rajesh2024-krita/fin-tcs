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
                    Code = "SOC001",
                    RegistrationNo = "REG001",
                    Address = "Test Address",
                    City = "Test City",
                    State = "Test State",
                    PinCode = "123456",
                    Phone = "1234567890",
                    Email = "testsociety@example.com",
                    EstablishedDate = DateTime.UtcNow.AddYears(-5),
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                }
            );

            // Create test users with proper properties
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Super",
                    LastName = "Admin",
                    Email = "superadmin@example.com",
                    Mobile = "9876543210",
                    PasswordHash = "$2a$11$K2QkCzLg1c.LZvZ8hVq8P.KXhzQGX7HzA8K2QkCzLg1c.LZvZ8hV", // "password" hashed
                    Role = "SuperAdmin",
                    SocietyId = 1,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    FirstName = "Society",
                    LastName = "Admin",
                    Email = "societyadmin@example.com",
                    Mobile = "9876543211",
                    PasswordHash = "$2a$11$K2QkCzLg1c.LZvZ8hVq8P.KXhzQGX7HzA8K2QkCzLg1c.LZvZ8hV", // "password" hashed
                    Role = "SocietyAdmin",
                    SocietyId = 1,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 3,
                    FirstName = "Test",
                    LastName = "Accountant",
                    Email = "accountant@example.com",
                    Mobile = "9876543212",
                    PasswordHash = "$2a$11$K2QkCzLg1c.LZvZ8hVq8P.KXhzQGX7HzA8K2QkCzLg1c.LZvZ8hV", // "password" hashed
                    Role = "Accountant",
                    SocietyId = 1,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 4,
                    FirstName = "Test",
                    LastName = "Member",
                    Email = "member@example.com",
                    Mobile = "9876543213",
                    PasswordHash = "$2a$11$K2QkCzLg1c.LZvZ8hVq8P.KXhzQGX7HzA8K2QkCzLg1c.LZvZ8hV", // "password" hashed
                    Role = "Member",
                    SocietyId = 1,
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                }
            );
        }
    }
}