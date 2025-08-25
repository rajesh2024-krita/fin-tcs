
using MemberManagementAPI.Models;
using MemberManagementAPI.Repositories;

namespace MemberManagementAPI.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;

        public MemberService(IMemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }

        public async Task<IEnumerable<Member>> GetAllMembersAsync()
        {
            return await _memberRepository.GetAllMembersAsync();
        }

        public async Task<Member?> GetMemberByIdAsync(int id)
        {
            return await _memberRepository.GetMemberByIdAsync(id);
        }

        public async Task<Member?> GetMemberByMemberNoAsync(string memberNo)
        {
            return await _memberRepository.GetMemberByMemberNoAsync(memberNo);
        }

        public async Task<Member> CreateMemberAsync(Member member)
        {
            // Validate member before creation
            if (!await ValidateMemberAsync(member))
            {
                throw new ArgumentException("Member validation failed");
            }

            // Check if MemberNo already exists
            if (await _memberRepository.MemberNoExistsAsync(member.MemberNo))
            {
                throw new InvalidOperationException($"Member with MemberNo '{member.MemberNo}' already exists");
            }

            member.CreatedDate = DateTime.UtcNow;
            member.Status ??= "Active";

            return await _memberRepository.CreateMemberAsync(member);
        }

        public async Task<Member?> UpdateMemberAsync(int id, Member member)
        {
            // Check if member exists
            if (!await _memberRepository.MemberExistsAsync(id))
            {
                return null;
            }

            // Validate member before update
            if (!await ValidateMemberAsync(member, isUpdate: true))
            {
                throw new ArgumentException("Member validation failed");
            }

            // Check if MemberNo already exists for another member
            var existingMemberWithSameNo = await _memberRepository.GetMemberByMemberNoAsync(member.MemberNo);
            if (existingMemberWithSameNo != null && existingMemberWithSameNo.Id != id)
            {
                throw new InvalidOperationException($"Another member with MemberNo '{member.MemberNo}' already exists");
            }

            return await _memberRepository.UpdateMemberAsync(id, member);
        }

        public async Task<bool> DeleteMemberAsync(int id)
        {
            return await _memberRepository.DeleteMemberAsync(id);
        }

        public async Task<bool> ValidateMemberAsync(Member member, bool isUpdate = false)
        {
            // Basic validation (additional to data annotations)
            if (string.IsNullOrWhiteSpace(member.MemberNo) ||
                string.IsNullOrWhiteSpace(member.Name) ||
                string.IsNullOrWhiteSpace(member.FHName))
            {
                return false;
            }

            // Validate mobile number format
            if (!string.IsNullOrEmpty(member.Mobile) && member.Mobile.Length != 10)
            {
                return false;
            }

            // Validate date constraints
            if (member.DateOfBirth.HasValue && member.DateOfBirth > DateTime.Now.Date)
            {
                return false;
            }

            if (member.DORetirement.HasValue && member.DOJJob.HasValue && 
                member.DORetirement <= member.DOJJob)
            {
                return false;
            }

            return true;
        }
    }
}
