using Microsoft.AspNetCore.Mvc.RazorPages;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using System.Xml.Linq;

namespace PhotovoltaicSystemCalculation.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserAccountRepository _userAccountRepository;

        public AuthenticationService(IUserAccountRepository userAccountRepository) 
        {
            _userAccountRepository = userAccountRepository;
        }

        public async Task<string> ValidateAndGenerateUserToken(UserLogin userLogin)
        {
            // This is simplified version for the sake of prototype app.
            // In real-world application, we would need JWT token for securely transmitting information between client-server. 
            var user = await _userAccountRepository.GetUserByEmailAndPassword(userLogin.Email, userLogin.Password);
            return user != null ? $"{user.Id}.{user.Email}" : ""; 
        }
    }
}
