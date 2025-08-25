
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models.DTOs
{
    public class DemandDto
    {
        public int Id { get; set; }
        public int SocietyId { get; set; }
        public string SocietyName { get; set; } = string.Empty;
        public string DemandNo { get; set; } = string.Empty;
        public string DemandType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }

    public class CreateDemandDto
    {
        [Required]
        [StringLength(50)]
        public string DemandNo { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DemandType { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }
    }
}
