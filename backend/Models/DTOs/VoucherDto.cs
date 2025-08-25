
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models.DTOs
{
    public class VoucherDto
    {
        public int Id { get; set; }
        public int SocietyId { get; set; }
        public string SocietyName { get; set; } = string.Empty;
        public string VoucherNo { get; set; } = string.Empty;
        public string VoucherType { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public DateTime VoucherDate { get; set; }
        public string? Reference { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateVoucherDto
    {
        [Required]
        [StringLength(50)]
        public string VoucherNo { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string VoucherType { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Details { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal? Debit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Credit { get; set; }

        [Required]
        public DateTime VoucherDate { get; set; }

        [StringLength(100)]
        public string? Reference { get; set; }
    }
}
