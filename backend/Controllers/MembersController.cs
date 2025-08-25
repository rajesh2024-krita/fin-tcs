
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MemberManagementAPI.Models;
using MemberManagementAPI.Services;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;
        private readonly ILogger<MembersController> _logger;

        public MembersController(IMemberService memberService, ILogger<MembersController> logger)
        {
            _memberService = memberService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var societyId = User.FindFirst("SocietyId")?.Value;

                var members = await _memberService.GetMembersAsync(currentUserId, currentUserRole, societyId != null ? int.Parse(societyId) : null);
                return Ok(members);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving members");
                return StatusCode(500, new { message = "An error occurred while retrieving members" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var societyId = User.FindFirst("SocietyId")?.Value;

                var member = await _memberService.GetMemberByIdAsync(id, currentUserId, currentUserRole, societyId != null ? int.Parse(societyId) : null);
                
                if (member == null)
                {
                    return NotFound();
                }

                return Ok(member);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving member");
                return StatusCode(500, new { message = "An error occurred while retrieving member" });
            }
        }

        [HttpGet("by-number/{memberNo}")]
        public async Task<ActionResult<Member>> GetMemberByNumber(string memberNo)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var societyId = User.FindFirst("SocietyId")?.Value;

                var member = await _memberService.GetMemberByNumberAsync(memberNo, currentUserId, currentUserRole, societyId != null ? int.Parse(societyId) : null);
                
                if (member == null)
                {
                    return NotFound();
                }

                return Ok(member);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving member by number");
                return StatusCode(500, new { message = "An error occurred while retrieving member" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,SocietyAdmin")]
        public async Task<ActionResult<Member>> CreateMember([FromBody] Member member)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userSocietyId = User.FindFirst("SocietyId")?.Value;

                // For SocietyAdmin, ensure they can only create members for their society
                if (currentUserRole == "SocietyAdmin" && userSocietyId != null)
                {
                    member.SocietyId = int.Parse(userSocietyId);
                }

                var createdMember = await _memberService.CreateMemberAsync(member, currentUserId, currentUserRole);
                return CreatedAtAction(nameof(GetMember), new { id = createdMember.Id }, createdMember);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating member");
                return StatusCode(500, new { message = "An error occurred while creating member" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,SocietyAdmin")]
        public async Task<ActionResult<Member>> UpdateMember(int id, [FromBody] Member member)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userSocietyId = User.FindFirst("SocietyId")?.Value;

                member.Id = id;
                var updatedMember = await _memberService.UpdateMemberAsync(member, currentUserId, currentUserRole, userSocietyId != null ? int.Parse(userSocietyId) : null);
                return Ok(updatedMember);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating member");
                return StatusCode(500, new { message = "An error occurred while updating member" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,SocietyAdmin")]
        public async Task<ActionResult> DeleteMember(int id)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userSocietyId = User.FindFirst("SocietyId")?.Value;

                var result = await _memberService.DeleteMemberAsync(id, currentUserId, currentUserRole, userSocietyId != null ? int.Parse(userSocietyId) : null);
                
                if (!result)
                {
                    return NotFound(new { message = "Member not found or could not be deleted" });
                }
                
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting member");
                return StatusCode(500, new { message = "An error occurred while deleting member" });
            }
        }
    }
}
