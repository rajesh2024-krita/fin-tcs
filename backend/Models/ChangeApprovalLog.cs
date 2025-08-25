
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class ChangeApprovalLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ChangeRequestId { get; set; }

        [ForeignKey("ChangeRequestId")]
        public virtual SocietyChangeRequest ChangeRequest { get; set; } = null!;

        [Required]
        public int ApprovedBy { get; set; }

        [ForeignKey("ApprovedBy")]
        public virtual User ApprovedByUser { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty; // Approved, Rejected

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Remarks { get; set; }
    }
}
