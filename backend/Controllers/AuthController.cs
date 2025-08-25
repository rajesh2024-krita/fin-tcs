
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
using Microsoft.AspNetCore.Authorization;
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
                var result = await _authService.LoginAsync(request.Email, request.Password);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        [Authorize(Roles = "SuperAdmin,SocietyAdmin")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
                var currentUserRole = User.FindFirst("role")?.Value;
                
                var result = await _authService.RegisterAsync(request, currentUserId, currentUserRole);
                return Ok(result);
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
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult> GetCurrentUser()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
                var user = await _authService.GetUserByIdAsync(userId);
                
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
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? SocietyId { get; set; }
    }
}
