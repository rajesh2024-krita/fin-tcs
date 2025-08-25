
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Models;

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
        }
    }
}
