
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
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class ChangeApprovalLog
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string EntityType { get; set; } = string.Empty; // Society, Member, etc.

        public int EntityId { get; set; }

        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // Create, Update, Delete

        [StringLength(1000)]
        public string OldValues { get; set; } = string.Empty; // JSON string

        [StringLength(1000)]
        public string NewValues { get; set; } = string.Empty; // JSON string

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public DateTime ActionDate { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Comments { get; set; }
    }
}
