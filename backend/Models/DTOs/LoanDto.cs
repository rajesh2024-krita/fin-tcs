
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models.DTOs
{
    public class LoanDto
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; } = string.Empty;
        public string MemberNo { get; set; } = string.Empty;
        public int SocietyId { get; set; }
        public string SocietyName { get; set; } = string.Empty;
        public string LoanNo { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal InterestRate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? LoanType { get; set; }
        public string? Purpose { get; set; }
        public string? Guarantor { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateLoanDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        [StringLength(50)]
        public string LoanNo { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal InterestRate { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(100)]
        public string? LoanType { get; set; }

        [StringLength(500)]
        public string? Purpose { get; set; }

        [StringLength(100)]
        public string? Guarantor { get; set; }
    }
}
