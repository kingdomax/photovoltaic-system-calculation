using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IUserAccountRepository
    {
        public Task<UserDTO> GetUserByEmailAndPassword(string email, string password);
        public Task<UserDTO> CreateNewUser(string email, string password);
        public Task DeleteUser(int userId);
    }
}
