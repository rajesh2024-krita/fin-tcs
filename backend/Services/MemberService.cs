
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

        public async Task<IEnumerable<Member>> GetMembersAsync(int currentUserId, string? currentUserRole, int? societyId)
        {
            var allMembers = await _memberRepository.GetAllMembersAsync();
            
            // Filter based on user role and society
            if (currentUserRole == "SocietyAdmin" && societyId.HasValue)
            {
                return allMembers.Where(m => m.SocietyId == societyId.Value);
            }
            
            // SuperAdmin can see all members
            return allMembers;
        }

        public async Task<Member?> GetMemberByIdAsync(int id, int currentUserId, string? currentUserRole, int? societyId)
        {
            var member = await _memberRepository.GetMemberByIdAsync(id);
            
            if (member == null)
                return null;
                
            // Check authorization
            if (currentUserRole == "SocietyAdmin" && societyId.HasValue && member.SocietyId != societyId.Value)
            {
                throw new UnauthorizedAccessException("You can only access members from your society.");
            }
            
            return member;
        }

        public async Task<Member?> GetMemberByNumberAsync(string memberNo, int currentUserId, string? currentUserRole, int? societyId)
        {
            var member = await _memberRepository.GetMemberByMemberNoAsync(memberNo);
            
            if (member == null)
                return null;
                
            // Check authorization
            if (currentUserRole == "SocietyAdmin" && societyId.HasValue && member.SocietyId != societyId.Value)
            {
                throw new UnauthorizedAccessException("You can only access members from your society.");
            }
            
            return member;
        }

        public async Task<Member> CreateMemberAsync(Member member, int currentUserId, string? currentUserRole)
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

            // For SocietyAdmin, ensure they can only create members for their society
            if (currentUserRole == "SocietyAdmin" && member.SocietyId == 0)
            {
                throw new UnauthorizedAccessException("SocietyAdmin must specify a valid SocietyId");
            }

            member.CreatedDate = DateTime.UtcNow;
            member.Status ??= "Active";

            return await _memberRepository.CreateMemberAsync(member);
        }

        public async Task<Member> UpdateMemberAsync(Member member, int currentUserId, string? currentUserRole, int? societyId)
        {
            // Check if member exists
            var existingMember = await _memberRepository.GetMemberByIdAsync(member.Id);
            if (existingMember == null)
            {
                throw new InvalidOperationException("Member not found");
            }

            // Check authorization for SocietyAdmin
            if (currentUserRole == "SocietyAdmin" && societyId.HasValue && existingMember.SocietyId != societyId.Value)
            {
                throw new UnauthorizedAccessException("You can only update members from your society.");
            }

            // Validate member before update
            if (!await ValidateMemberAsync(member, isUpdate: true))
            {
                throw new ArgumentException("Member validation failed");
            }

            // Check if MemberNo already exists for another member
            var existingMemberWithSameNo = await _memberRepository.GetMemberByMemberNoAsync(member.MemberNo);
            if (existingMemberWithSameNo != null && existingMemberWithSameNo.Id != member.Id)
            {
                throw new InvalidOperationException($"Another member with MemberNo '{member.MemberNo}' already exists");
            }

            var updatedMember = await _memberRepository.UpdateMemberAsync(member.Id, member);
            if (updatedMember == null)
            {
                throw new InvalidOperationException("Failed to update member");
            }

            return updatedMember;
        }

        public async Task<bool> DeleteMemberAsync(int id, int currentUserId, string? currentUserRole, int? societyId)
        {
            var existingMember = await _memberRepository.GetMemberByIdAsync(id);
            if (existingMember == null)
            {
                throw new InvalidOperationException("Member not found");
            }

            // Check authorization for SocietyAdmin
            if (currentUserRole == "SocietyAdmin" && societyId.HasValue && existingMember.SocietyId != societyId.Value)
            {
                throw new UnauthorizedAccessException("You can only delete members from your society.");
            }

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

            return await Task.FromResult(true);
        }
    }
}
