
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Services
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetMembersAsync(int currentUserId, string? currentUserRole, int? societyId);
        Task<Member?> GetMemberByIdAsync(int id, int currentUserId, string? currentUserRole, int? societyId);
        Task<Member?> GetMemberByNumberAsync(string memberNo, int currentUserId, string? currentUserRole, int? societyId);
        Task<Member> CreateMemberAsync(Member member, int currentUserId, string? currentUserRole);
        Task<Member> UpdateMemberAsync(Member member, int currentUserId, string? currentUserRole, int? societyId);
        Task<bool> DeleteMemberAsync(int id, int currentUserId, string? currentUserRole, int? societyId);
        Task<bool> ValidateMemberAsync(Member member, bool isUpdate = false);
    }
}
