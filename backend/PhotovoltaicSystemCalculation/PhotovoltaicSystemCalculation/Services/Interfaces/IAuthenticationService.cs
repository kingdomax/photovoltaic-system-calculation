using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IAuthenticationService
    {
        public Task<string> ValidateUser(string email, string password);
        public Task<string> RegisterNewUser(string email, string password);
        public Task DeleteUser(string userId);
    }
}
