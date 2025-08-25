
using Microsoft.EntityFrameworkCore;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;

namespace MemberManagementAPI.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public MemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Member>> GetAllMembersAsync()
        {
            return await _context.Members
                .OrderBy(m => m.MemberNo)
                .ToListAsync();
        }

        public async Task<Member?> GetMemberByIdAsync(int id)
        {
            return await _context.Members
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Member?> GetMemberByMemberNoAsync(string memberNo)
        {
            return await _context.Members
                .FirstOrDefaultAsync(m => m.MemberNo == memberNo);
        }

        public async Task<Member> CreateMemberAsync(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task<Member?> UpdateMemberAsync(int id, Member member)
        {
            var existingMember = await _context.Members.FindAsync(id);
            if (existingMember == null)
                return null;

            // Update properties
            existingMember.MemberNo = member.MemberNo;
            existingMember.Name = member.Name;
            existingMember.FHName = member.FHName;
            existingMember.DateOfBirth = member.DateOfBirth;
            existingMember.Mobile = member.Mobile;
            existingMember.Email = member.Email;
            existingMember.Designation = member.Designation;
            existingMember.DOJJob = member.DOJJob;
            existingMember.DORetirement = member.DORetirement;
            existingMember.Branch = member.Branch;
            existingMember.DOJSociety = member.DOJSociety;
            existingMember.OfficeAddress = member.OfficeAddress;
            existingMember.ResidenceAddress = member.ResidenceAddress;
            existingMember.City = member.City;
            existingMember.PhoneOffice = member.PhoneOffice;
            existingMember.PhoneResidence = member.PhoneResidence;
            existingMember.Nominee = member.Nominee;
            existingMember.NomineeRelation = member.NomineeRelation;
            existingMember.ShareAmount = member.ShareAmount;
            existingMember.CDAmount = member.CDAmount;
            existingMember.BankName = member.BankName;
            existingMember.PayableAt = member.PayableAt;
            existingMember.AccountNo = member.AccountNo;
            existingMember.Status = member.Status;
            existingMember.Date = member.Date;
            existingMember.PhotoPath = member.PhotoPath;
            existingMember.SignaturePath = member.SignaturePath;
            existingMember.ShareDeduction = member.ShareDeduction;
            existingMember.Withdrawal = member.Withdrawal;
            existingMember.GLoanInstalment = member.GLoanInstalment;
            existingMember.ELoanInstalment = member.ELoanInstalment;
            existingMember.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingMember;
        }

        public async Task<bool> DeleteMemberAsync(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
                return false;

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MemberExistsAsync(int id)
        {
            return await _context.Members.AnyAsync(m => m.Id == id);
        }

        public async Task<bool> MemberNoExistsAsync(string memberNo)
        {
            return await _context.Members.AnyAsync(m => m.MemberNo == memberNo);
        }
    }
}
