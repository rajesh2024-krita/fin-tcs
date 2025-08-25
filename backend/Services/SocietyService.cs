
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using MemberManagementAPI.Data;
using MemberManagementAPI.Models;
using MemberManagementAPI.Models.DTOs;

namespace MemberManagementAPI.Services
{
    public class SocietyService : ISocietyService
    {
        private readonly ApplicationDbContext _context;

        public SocietyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SocietyDto>> GetAllSocietiesAsync()
        {
            return await _context.Societies
                .Select(s => MapToSocietyDto(s))
                .ToListAsync();
        }

        public async Task<SocietyDto?> GetSocietyByIdAsync(int id)
        {
            var society = await _context.Societies.FindAsync(id);
            return society != null ? MapToSocietyDto(society) : null;
        }

        public async Task<SocietyDto> CreateSocietyAsync(CreateSocietyDto createSocietyDto)
        {
            var existingSociety = await _context.Societies
                .FirstOrDefaultAsync(s => s.RegistrationNo == createSocietyDto.RegistrationNo);

            if (existingSociety != null)
            {
                throw new InvalidOperationException("Society with this registration number already exists");
            }

            var society = new Society
            {
                Name = createSocietyDto.Name,
                RegistrationNo = createSocietyDto.RegistrationNo,
                Address = createSocietyDto.Address,
                City = createSocietyDto.City,
                State = createSocietyDto.State,
                PinCode = createSocietyDto.PinCode,
                Phone = createSocietyDto.Phone,
                Email = createSocietyDto.Email,
                ContactPerson = createSocietyDto.ContactPerson,
                EstablishedDate = createSocietyDto.EstablishedDate
            };

            _context.Societies.Add(society);
            await _context.SaveChangesAsync();

            return MapToSocietyDto(society);
        }

        public async Task<SocietyDto?> UpdateSocietyAsync(int id, CreateSocietyDto updateSocietyDto)
        {
            var society = await _context.Societies.FindAsync(id);
            if (society == null) return null;

            society.Name = updateSocietyDto.Name;
            society.RegistrationNo = updateSocietyDto.RegistrationNo;
            society.Address = updateSocietyDto.Address;
            society.City = updateSocietyDto.City;
            society.State = updateSocietyDto.State;
            society.PinCode = updateSocietyDto.PinCode;
            society.Phone = updateSocietyDto.Phone;
            society.Email = updateSocietyDto.Email;
            society.ContactPerson = updateSocietyDto.ContactPerson;
            society.EstablishedDate = updateSocietyDto.EstablishedDate;
            society.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToSocietyDto(society);
        }

        public async Task<bool> DeleteSocietyAsync(int id)
        {
            var society = await _context.Societies.FindAsync(id);
            if (society == null) return false;

            // Check if society has associated data
            var hasMembers = await _context.Members.AnyAsync(m => m.SocietyId == id);
            var hasUsers = await _context.Users.AnyAsync(u => u.SocietyId == id);

            if (hasMembers || hasUsers)
            {
                throw new InvalidOperationException("Cannot delete society with associated members or users");
            }

            _context.Societies.Remove(society);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SocietyChangeRequestDto> RequestSocietyChangeAsync(int societyId, CreateSocietyDto updatedData, int requestedBy)
        {
            var society = await _context.Societies.FindAsync(societyId);
            if (society == null)
            {
                throw new ArgumentException("Society not found");
            }

            var changeRequest = new SocietyChangeRequest
            {
                SocietyId = societyId,
                ChangedData = JsonSerializer.Serialize(updatedData),
                RequestedBy = requestedBy,
                Status = "Pending"
            };

            _context.SocietyChangeRequests.Add(changeRequest);
            await _context.SaveChangesAsync();

            return await GetChangeRequestDtoAsync(changeRequest.Id);
        }

        public async Task<IEnumerable<SocietyChangeRequestDto>> GetPendingChangeRequestsAsync()
        {
            return await _context.SocietyChangeRequests
                .Where(cr => cr.Status == "Pending")
                .Include(cr => cr.Society)
                .Include(cr => cr.RequestedByUser)
                .Select(cr => new SocietyChangeRequestDto
                {
                    Id = cr.Id,
                    SocietyId = cr.SocietyId,
                    SocietyName = cr.Society.Name,
                    ChangedData = cr.ChangedData,
                    Status = cr.Status,
                    RequestedBy = cr.RequestedBy,
                    RequestedByUsername = cr.RequestedByUser.Username,
                    RequestedDate = cr.RequestedDate,
                    Remarks = cr.Remarks
                })
                .ToListAsync();
        }

        public async Task<bool> ApproveChangeRequestAsync(int changeRequestId, ApproveSocietyChangeDto approvalDto, int approvedBy)
        {
            var changeRequest = await _context.SocietyChangeRequests
                .Include(cr => cr.Society)
                .FirstOrDefaultAsync(cr => cr.Id == changeRequestId);

            if (changeRequest == null || changeRequest.Status != "Pending")
            {
                return false;
            }

            // Create approval log
            var approvalLog = new ChangeApprovalLog
            {
                ChangeRequestId = changeRequestId,
                ApprovedBy = approvedBy,
                Status = approvalDto.Status,
                Remarks = approvalDto.Remarks
            };

            _context.ChangeApprovalLogs.Add(approvalLog);

            // Update change request status
            changeRequest.Status = approvalDto.Status;

            // If approved, update the society
            if (approvalDto.Status == "Approved")
            {
                var updatedData = JsonSerializer.Deserialize<CreateSocietyDto>(changeRequest.ChangedData);
                if (updatedData != null)
                {
                    changeRequest.Society.Name = updatedData.Name;
                    changeRequest.Society.RegistrationNo = updatedData.RegistrationNo;
                    changeRequest.Society.Address = updatedData.Address;
                    changeRequest.Society.City = updatedData.City;
                    changeRequest.Society.State = updatedData.State;
                    changeRequest.Society.PinCode = updatedData.PinCode;
                    changeRequest.Society.Phone = updatedData.Phone;
                    changeRequest.Society.Email = updatedData.Email;
                    changeRequest.Society.ContactPerson = updatedData.ContactPerson;
                    changeRequest.Society.EstablishedDate = updatedData.EstablishedDate;
                    changeRequest.Society.UpdatedDate = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<SocietyChangeRequestDto> GetChangeRequestDtoAsync(int changeRequestId)
        {
            return await _context.SocietyChangeRequests
                .Where(cr => cr.Id == changeRequestId)
                .Include(cr => cr.Society)
                .Include(cr => cr.RequestedByUser)
                .Select(cr => new SocietyChangeRequestDto
                {
                    Id = cr.Id,
                    SocietyId = cr.SocietyId,
                    SocietyName = cr.Society.Name,
                    ChangedData = cr.ChangedData,
                    Status = cr.Status,
                    RequestedBy = cr.RequestedBy,
                    RequestedByUsername = cr.RequestedByUser.Username,
                    RequestedDate = cr.RequestedDate,
                    Remarks = cr.Remarks
                })
                .FirstAsync();
        }

        private SocietyDto MapToSocietyDto(Society society)
        {
            return new SocietyDto
            {
                Id = society.Id,
                Name = society.Name,
                RegistrationNo = society.RegistrationNo,
                Address = society.Address,
                City = society.City,
                State = society.State,
                PinCode = society.PinCode,
                Phone = society.Phone,
                Email = society.Email,
                ContactPerson = society.ContactPerson,
                EstablishedDate = society.EstablishedDate,
                CreatedDate = society.CreatedDate
            };
        }
    }
}
