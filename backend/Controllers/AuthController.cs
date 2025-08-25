
using Microsoft.AspNetCore.Mvc;
using MemberManagementAPI.Models;
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
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _authService.GetUserByEmailAsync(request.Email);
                
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                // Simple login without password verification for now
                return Ok(new
                {
                    token = "simple-token", // Simple token for frontend
                    user = new
                    {
                        id = user.Id,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        mobile = user.Mobile,
                        role = user.Role,
                        societyId = user.SocietyId,
                        society = user.Society?.Name
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.CreateUserAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpGet("me")]
        public async Task<ActionResult> GetCurrentUser()
        {
            try
            {
                // Return first user for simplicity
                var user = await _authService.GetUserByIdAsync(1);
                
                if (user == null)
                {
                    return NotFound();
                }

                return Ok(new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    mobile = user.Mobile,
                    role = user.Role,
                    societyId = user.SocietyId,
                    society = user.Society?.Name
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get current user error");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public int? SocietyId { get; set; }
    }
}
