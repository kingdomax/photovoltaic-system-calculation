using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Models;
using System.Security.Cryptography.Xml;

namespace PhotovoltaicSystemCalculation.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserAccountRepository _userAccountRepository;
        public AuthenticationService(IUserAccountRepository userAccountRepository) =>  _userAccountRepository = userAccountRepository;


        public async Task<string> ValidateUser(string username, string password)
        {
            var user = await _userAccountRepository.GetUser(username, password);
            return GenerateUserToken(user); 
        }

        public async Task<string> RegisterNewUser(string username, string password)
        {
            // check if user already exists
            var existingUser = await _userAccountRepository.GetUser(username, password);
            if (existingUser != null) { return null; }

            var createdUser = await _userAccountRepository.CreateNewUser(username, password);
            return GenerateUserToken(createdUser);
        }

        public async Task DeleteUser(int userId)
        {
            try 
            { 
                await _userAccountRepository.DeleteUser(userId); 
            }
            catch (ArgumentException e) { throw new Exception("User does not exist", e); }
            catch (Exception e) { throw new Exception("An error occurred when deleting user", e); }
        }

        public async Task<UserInfo> UpdateUser(int userId, UserInfo newInfo, string newPassword)
        {
            try
            {
                var updatedUser = await _userAccountRepository.UpdateUser(userId, newInfo, newPassword);

                return new UserInfo
                {
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    Address = updatedUser.Address,
                    Country = updatedUser.Country,
                    State = updatedUser.State,
                    Zip = updatedUser.Zip,
                    Email = updatedUser.Email,
                };
            }
            catch (ArgumentException e) { throw new Exception("User does not exist", e); }
            catch (Exception e) { throw new Exception("An error occurred when updating user", e); }
        }

        // This is simplified version for the sake of prototype app.
        // In real-world application, we would need JWT token for securely transmitting information between client-server. 
        private string GenerateUserToken(UserDTO user)
        {
            return user != null ? $"{user.Id}.{user.Username}" : "";
        }
    }
}
