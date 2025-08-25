
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MemberManagementAPI.Models.DTOs;
using MemberManagementAPI.Services;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SocietiesController : ControllerBase
    {
        private readonly ISocietyService _societyService;
        private readonly ILogger<SocietiesController> _logger;

        public SocietiesController(ISocietyService societyService, ILogger<SocietiesController> logger)
        {
            _societyService = societyService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SocietyDto>>> GetSocieties()
        {
            try
            {
                var societies = await _societyService.GetAllSocietiesAsync();
                return Ok(societies);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving societies");
                return StatusCode(500, new { message = "An error occurred while retrieving societies" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SocietyDto>> GetSociety(int id)
        {
            try
            {
                var society = await _societyService.GetSocietyByIdAsync(id);
                if (society == null)
                {
                    return NotFound();
                }

                return Ok(society);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving society");
                return StatusCode(500, new { message = "An error occurred while retrieving society" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<SocietyDto>> CreateSociety([FromBody] CreateSocietyDto createSocietyDto)
        {
            try
            {
                var society = await _societyService.CreateSocietyAsync(createSocietyDto);
                return CreatedAtAction(nameof(GetSociety), new { id = society.Id }, society);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating society");
                return StatusCode(500, new { message = "An error occurred while creating society" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<SocietyDto>> UpdateSociety(int id, [FromBody] CreateSocietyDto updateSocietyDto)
        {
            try
            {
                var society = await _societyService.UpdateSocietyAsync(id, updateSocietyDto);
                if (society == null)
                {
                    return NotFound();
                }

                return Ok(society);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating society");
                return StatusCode(500, new { message = "An error occurred while updating society" });
            }
        }

        [HttpPost("{id}/request-change")]
        [Authorize(Roles = "SocietyAdmin")]
        public async Task<ActionResult<SocietyChangeRequestDto>> RequestSocietyChange(int id, [FromBody] CreateSocietyDto updateSocietyDto)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var currentUserSocietyId = User.FindFirst("SocietyId")?.Value;

                if (currentUserSocietyId == null || int.Parse(currentUserSocietyId) != id)
                {
                    return Forbid("You can only request changes for your own society");
                }

                var changeRequest = await _societyService.RequestSocietyChangeAsync(id, updateSocietyDto, currentUserId);
                return Ok(changeRequest);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error requesting society change");
                return StatusCode(500, new { message = "An error occurred while requesting society change" });
            }
        }

        [HttpGet("change-requests")]
        [Authorize(Roles = "SuperAdmin,User")]
        public async Task<ActionResult<IEnumerable<SocietyChangeRequestDto>>> GetPendingChangeRequests()
        {
            try
            {
                var changeRequests = await _societyService.GetPendingChangeRequestsAsync();
                return Ok(changeRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving change requests");
                return StatusCode(500, new { message = "An error occurred while retrieving change requests" });
            }
        }

        [HttpPost("change-requests/{changeRequestId}/approve")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> ApproveChangeRequest(int changeRequestId, [FromBody] ApproveSocietyChangeDto approvalDto)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _societyService.ApproveChangeRequestAsync(changeRequestId, approvalDto, currentUserId);

                if (!result)
                {
                    return NotFound(new { message = "Change request not found or already processed" });
                }

                return Ok(new { message = "Change request processed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving change request");
                return StatusCode(500, new { message = "An error occurred while processing change request" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult> DeleteSociety(int id)
        {
            try
            {
                var result = await _societyService.DeleteSocietyAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting society");
                return StatusCode(500, new { message = "An error occurred while deleting society" });
            }
        }
    }
}
