
using MemberManagementAPI.Models.DTOs;

namespace MemberManagementAPI.Services
{
    public interface ISocietyService
    {
        Task<IEnumerable<SocietyDto>> GetAllSocietiesAsync();
        Task<SocietyDto?> GetSocietyByIdAsync(int id);
        Task<SocietyDto> CreateSocietyAsync(CreateSocietyDto createSocietyDto);
        Task<SocietyDto?> UpdateSocietyAsync(int id, CreateSocietyDto updateSocietyDto);
        Task<bool> DeleteSocietyAsync(int id);
        Task<SocietyChangeRequestDto> RequestSocietyChangeAsync(int societyId, CreateSocietyDto updatedData, int requestedBy);
        Task<IEnumerable<SocietyChangeRequestDto>> GetPendingChangeRequestsAsync();
        Task<bool> ApproveChangeRequestAsync(int changeRequestId, ApproveSocietyChangeDto approvalDto, int approvedBy);
    }
}
