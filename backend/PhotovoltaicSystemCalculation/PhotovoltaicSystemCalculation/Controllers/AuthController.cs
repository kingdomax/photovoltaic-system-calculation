using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> DeleteAccount([FromHeader] string Authorization)
        {
            if (string.IsNullOrEmpty(Authorization)) { return Unauthorized("Unauthorized"); }

            var userId = Authorization.Split('.')[0];
            try
            {
                await _authenticationService.DeleteUser(userId);
                return Ok(new { });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message); // Return the exception message as part of the response
            }
        }

        [HttpPost("EditProfile")]
        public async Task<IActionResult> EditProfile([FromBody] EditProfileRequest request, [FromHeader] string Authorization)
        {
            if (string.IsNullOrEmpty(Authorization)) { return Unauthorized("Unauthorized"); }

            var userId = Authorization.Split('.')[0];
            try
            {
                var updatedInfo = await _authenticationService.UpdateUser(userId, request.UserInfo, request.NewPassword);
                return Ok(new { UserInfo = updatedInfo });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message); // Return the exception message as part of the response
            }
        }
    }
}
