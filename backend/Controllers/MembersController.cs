
using Microsoft.AspNetCore.Mvc;
using MemberManagementAPI.Models;
using MemberManagementAPI.Services;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;
        private readonly ILogger<MembersController> _logger;

        public MembersController(IMemberService memberService, ILogger<MembersController> logger)
        {
            _memberService = memberService;
            _logger = logger;
        }

        /// <summary>
        /// Get all members
        /// </summary>
        /// <returns>List of all members</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            try
            {
                var members = await _memberService.GetAllMembersAsync();
                return Ok(members);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching members");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Get member by ID
        /// </summary>
        /// <param name="id">Member ID</param>
        /// <returns>Member details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            try
            {
                var member = await _memberService.GetMemberByIdAsync(id);
                if (member == null)
                {
                    return NotFound($"Member with ID {id} not found");
                }
                return Ok(member);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching member with ID {Id}", id);
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Get member by Member Number
        /// </summary>
        /// <param name="memberNo">Member Number</param>
        /// <returns>Member details</returns>
        [HttpGet("by-number/{memberNo}")]
        public async Task<ActionResult<Member>> GetMemberByNumber(string memberNo)
        {
            try
            {
                var member = await _memberService.GetMemberByMemberNoAsync(memberNo);
                if (member == null)
                {
                    return NotFound($"Member with number {memberNo} not found");
                }
                return Ok(member);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching member with number {MemberNo}", memberNo);
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Create a new member
        /// </summary>
        /// <param name="member">Member details</param>
        /// <returns>Created member</returns>
        [HttpPost]
        public async Task<ActionResult<Member>> CreateMember([FromBody] Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdMember = await _memberService.CreateMemberAsync(member);
                return CreatedAtAction(nameof(GetMember), new { id = createdMember.Id }, createdMember);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating member");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Update an existing member
        /// </summary>
        /// <param name="id">Member ID</param>
        /// <param name="member">Updated member details</param>
        /// <returns>Updated member</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Member>> UpdateMember(int id, [FromBody] Member member)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedMember = await _memberService.UpdateMemberAsync(id, member);
                if (updatedMember == null)
                {
                    return NotFound($"Member with ID {id} not found");
                }
                return Ok(updatedMember);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating member with ID {Id}", id);
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Delete a member
        /// </summary>
        /// <param name="id">Member ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMember(int id)
        {
            try
            {
                var result = await _memberService.DeleteMemberAsync(id);
                if (!result)
                {
                    return NotFound($"Member with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting member with ID {Id}", id);
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
}
