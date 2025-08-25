
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class SocietyChangeRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SocietyId { get; set; }

        [ForeignKey("SocietyId")]
        public virtual Society Society { get; set; } = null!;

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string ChangedData { get; set; } = string.Empty; // JSON format

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        [Required]
        public int RequestedBy { get; set; }

        [ForeignKey("RequestedBy")]
        public virtual User RequestedByUser { get; set; } = null!;

        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Remarks { get; set; }

        public virtual ICollection<ChangeApprovalLog> ApprovalLogs { get; set; } = new List<ChangeApprovalLog>();
    }
}
