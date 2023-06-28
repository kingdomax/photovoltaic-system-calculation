using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.ActionFilterAttributes;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginRequest login)
        {
            var userToken = await _authenticationService.ValidateUser(login.Username, login.Password);
            return !string.IsNullOrEmpty(userToken) ? Ok(new { token = userToken }) : Unauthorized("Unauthorized");
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup(UserLoginRequest login)
        {
            var userToken = await _authenticationService.RegisterNewUser(login.Username, login.Password);
            return !string.IsNullOrEmpty(userToken) ? Ok(new { token = userToken }) : BadRequest("User already exists");
        }

        [HttpPost("DeleteAccount")]
        [UserExtractionFilter]
        public async Task<IActionResult> DeleteAccount([FromHeader] string Authorization)
        {
            try
            {
                await _authenticationService.DeleteUser((int) HttpContext.Items["UserId"]);
                return Ok(new { });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message); // Return the exception message as part of the response
            }
        }

        [HttpPost("EditProfile")]
        [UserExtractionFilter]
        public async Task<IActionResult> EditProfile([FromBody] EditProfileRequest request, [FromHeader] string Authorization)
        {
            try
            {
                var updatedInfo = await _authenticationService.UpdateUser((int) HttpContext.Items["UserId"], request.UserInfo, request.NewPassword);
                return Ok(new { UserInfo = updatedInfo });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message); // Return the exception message as part of the response
            }
        }
    }
}
