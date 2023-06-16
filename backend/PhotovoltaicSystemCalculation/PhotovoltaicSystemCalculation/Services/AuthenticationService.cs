using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserAccountRepository _userAccountRepository;
        public AuthenticationService(IUserAccountRepository userAccountRepository) =>  _userAccountRepository = userAccountRepository;

        public async Task<string> ValidateUser(string email, string password)
        {
            var user = await _userAccountRepository.GetUserByEmailAndPassword(email, password);
            return GenerateUserToken(user); 
        }

        public async Task<string> RegisterNewUser(string email, string password)
        {
            // check if user already exists
            var existingUser = await _userAccountRepository.GetUserByEmailAndPassword(email, password);
            if (existingUser != null) { return null; }

            var createdUser = await _userAccountRepository.CreateNewUser(email, password);
            return GenerateUserToken(createdUser);
        }

        public async Task DeleteUser(string userId)
        {
            try { await _userAccountRepository.DeleteUser(Convert.ToInt32(userId)); }
            catch (ArgumentException e) { throw new Exception("User does not exist", e); }
            catch (Exception e) { throw new Exception("An error occurred when deleting user", e); }
        }

        // This is simplified version for the sake of prototype app.
        // In real-world application, we would need JWT token for securely transmitting information between client-server. 
        private string GenerateUserToken(UserDto user)
        {
            return user != null ? $"{user.Id}.{user.Email}" : "";
        }
    }
}
