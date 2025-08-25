
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Repositories
{
    public interface IMemberRepository
    {
        Task<IEnumerable<Member>> GetAllMembersAsync();
        Task<Member?> GetMemberByIdAsync(int id);
        Task<Member?> GetMemberByMemberNoAsync(string memberNo);
        Task<Member> CreateMemberAsync(Member member);
        Task<Member?> UpdateMemberAsync(int id, Member member);
        Task<bool> DeleteMemberAsync(int id);
        Task<bool> MemberExistsAsync(int id);
        Task<bool> MemberNoExistsAsync(string memberNo);
    }
}
