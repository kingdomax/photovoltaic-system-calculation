using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IAuthenticationService
    {
        public Task<string> ValidateAndGenerateUserToken(UserLogin userLoginDto);
    }
}
