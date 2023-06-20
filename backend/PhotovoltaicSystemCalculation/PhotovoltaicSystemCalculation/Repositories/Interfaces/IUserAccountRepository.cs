using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IUserAccountRepository
    {
        public Task<UserDTO> GetUser(string username, string password);
        public Task<UserDTO> CreateNewUser(string username, string password);
        public Task DeleteUser(int userId);
        public Task<UserDTO> UpdateUser(int userId, UserInfo newInfo, string newPassword);
    }
}
