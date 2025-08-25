
using System.ComponentModel.DataAnnotations;

namespace MemberManagementAPI.Models.DTOs
{
    public class SocietyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string RegistrationNo { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PinCode { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? ContactPerson { get; set; }
        public DateTime? EstablishedDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateSocietyDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string RegistrationNo { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(10)]
        public string? PinCode { get; set; }

        [StringLength(15)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? ContactPerson { get; set; }

        public DateTime? EstablishedDate { get; set; }
    }

    public class SocietyChangeRequestDto
    {
        public int Id { get; set; }
        public int SocietyId { get; set; }
        public string SocietyName { get; set; } = string.Empty;
        public string ChangedData { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int RequestedBy { get; set; }
        public string RequestedByUsername { get; set; } = string.Empty;
        public DateTime RequestedDate { get; set; }
        public string? Remarks { get; set; }
    }

    public class ApproveSocietyChangeDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Approved, Rejected

        [StringLength(500)]
        public string? Remarks { get; set; }
    }
}
