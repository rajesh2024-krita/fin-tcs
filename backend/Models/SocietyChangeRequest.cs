
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
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberManagementAPI.Models
{
    public class SocietyChangeRequest
    {
        [Key]
        public int Id { get; set; }

        public int SocietyId { get; set; }

        [ForeignKey("SocietyId")]
        public virtual Society Society { get; set; } = null!;

        public int RequestedByUserId { get; set; }

        [ForeignKey("RequestedByUserId")]
        public virtual User RequestedByUser { get; set; } = null!;

        [StringLength(50)]
        public string ChangeType { get; set; } = string.Empty; // Update, Delete, etc.

        [StringLength(1000)]
        public string ChangeDetails { get; set; } = string.Empty; // JSON string of changes

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        public int? ApprovedByUserId { get; set; }

        [ForeignKey("ApprovedByUserId")]
        public virtual User? ApprovedByUser { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(500)]
        public string? ApprovalComments { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    }
}
