
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Voucher
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SocietyId { get; set; }

        [ForeignKey("SocietyId")]
        public virtual Society Society { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string VoucherNo { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string VoucherType { get; set; } = string.Empty; // Receipt, Payment, Journal

        [Required]
        [StringLength(500)]
        public string Details { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Debit { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Credit { get; set; }

        [Required]
        public DateTime VoucherDate { get; set; }

        [StringLength(100)]
        public string? Reference { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}
