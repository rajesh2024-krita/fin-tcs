
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class LoanReceipt
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LoanId { get; set; }

        [ForeignKey("LoanId")]
        public virtual Loan Loan { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string ReceiptNo { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PrincipalAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? InterestAmount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [StringLength(100)]
        public string? PaymentMode { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}
