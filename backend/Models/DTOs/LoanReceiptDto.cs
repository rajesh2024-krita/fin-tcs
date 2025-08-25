
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models.DTOs
{
    public class LoanReceiptDto
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public string LoanNo { get; set; } = string.Empty;
        public string MemberName { get; set; } = string.Empty;
        public string ReceiptNo { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
        public decimal? PrincipalAmount { get; set; }
        public decimal? InterestAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? PaymentMode { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateLoanReceiptDto
    {
        [Required]
        public int LoanId { get; set; }

        [Required]
        [StringLength(50)]
        public string ReceiptNo { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal AmountPaid { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? PrincipalAmount { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? InterestAmount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [StringLength(100)]
        public string? PaymentMode { get; set; }

        [StringLength(500)]
        public string? Remarks { get; set; }
    }
}
