
using Microsoft.AspNetCore.Mvc;
using MemberManagementAPI.Models.DTOs;
using MemberManagementAPI.Services;

namespace MemberManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                _logger.LogInformation($"Login attempt for user: {loginDto.Username}");
                var result = await _authService.LoginAsync(loginDto);
                _logger.LogInformation($"Login successful for user: {loginDto.Username}");
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Login failed for user {loginDto.Username}: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login for user: {loginDto.Username}");
                return StatusCode(500, new { message = "An error occurred during login", details = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                var user = await _authService.CreateUserAsync(createUserDto, 1); // Default to admin user
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _authService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                // Simple access - no role checking

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user");
                return StatusCode(500, new { message = "An error occurred while retrieving user" });
            }
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                var user = await _authService.GetUserByIdAsync(1); // Default to first user
                
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user");
                return StatusCode(500, new { message = "An error occurred while retrieving user" });
            }
        }
    }
}
