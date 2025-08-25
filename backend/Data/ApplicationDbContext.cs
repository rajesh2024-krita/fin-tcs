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

            // Configure relationships
            modelBuilder.Entity<Member>()
                .HasIndex(m => m.MemberNo)
                .IsUnique();

            modelBuilder.Entity<Society>()
                .HasIndex(s => s.RegistrationNo)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Loan>()
                .HasIndex(l => l.LoanNo)
                .IsUnique();

            modelBuilder.Entity<Demand>()
                .HasIndex(d => d.DemandNo)
                .IsUnique();

            modelBuilder.Entity<Voucher>()
                .HasIndex(v => v.VoucherNo)
                .IsUnique();

            modelBuilder.Entity<LoanReceipt>()
                .HasIndex(lr => lr.ReceiptNo)
                .IsUnique();

            // Configure cascade delete behavior
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

            // Create test users with hashed passwords
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "superadmin",
                    PasswordHash = HashPassword("password"),
                    Role = "SuperAdmin",
                    IsActive = true,
                    CreatedDate = DateTime.Now
                },
                new User
                {
                    Id = 2,
                    Username = "societyadmin",
                    PasswordHash = HashPassword("password"),
                    Role = "SocietyAdmin",
                    SocietyId = 1,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                },
                new User
                {
                    Id = 3,
                    Username = "accountant1",
                    PasswordHash = HashPassword("password"),
                    Role = "Accountant",
                    SocietyId = 1,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                },
                new User
                {
                    Id = 4,
                    Username = "member1",
                    PasswordHash = HashPassword("password"),
                    Role = "Member",
                    SocietyId = 1,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                }
            );
        }

        private string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var hashBytes = new byte[48];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }
    }
}