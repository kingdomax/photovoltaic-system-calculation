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
        public async Task<IActionResult> Login(UserLogin login)
        {
            var userToken = await _authenticationService.ValidateUser(login.Email, login.Password); // Validate the user's credentials. If the user was found, generate a token.
            return !string.IsNullOrEmpty(userToken) ? Ok(new { token = userToken }) : Unauthorized("Unauthorized"); // Return the token or Unauthorized status
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup(UserLogin login)
        {
            var userToken = await _authenticationService.RegisterNewUser(login.Email, login.Password);
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
                // Return the exception message as part of the response
                return BadRequest(e.Message);
            }
        }
    }
}
