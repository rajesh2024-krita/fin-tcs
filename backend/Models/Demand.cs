
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class Demand
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SocietyId { get; set; }

        [ForeignKey("SocietyId")]
        public virtual Society Society { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string DemandNo { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DemandType { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Paid, Overdue

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}
