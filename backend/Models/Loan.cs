
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Loan
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [ForeignKey("MemberId")]
        public virtual Member Member { get; set; } = null!;

        [Required]
        public int SocietyId { get; set; }

        [ForeignKey("SocietyId")]
        public virtual Society Society { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string LoanNo { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Closed, Defaulted

        [StringLength(100)]
        public string? LoanType { get; set; }

        [StringLength(500)]
        public string? Purpose { get; set; }

        [StringLength(100)]
        public string? Guarantor { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }

        public virtual ICollection<LoanReceipt> LoanReceipts { get; set; } = new List<LoanReceipt>();
    }
}
