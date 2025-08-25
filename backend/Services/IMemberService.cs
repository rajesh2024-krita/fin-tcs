
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Services
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetAllMembersAsync();
        Task<Member?> GetMemberByIdAsync(int id);
        Task<Member?> GetMemberByMemberNoAsync(string memberNo);
        Task<Member> CreateMemberAsync(Member member);
        Task<Member?> UpdateMemberAsync(int id, Member member);
        Task<bool> DeleteMemberAsync(int id);
        Task<bool> ValidateMemberAsync(Member member, bool isUpdate = false);
    }
}
