using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IUserAccountRepository
    {
        public Task<UserDto> GetUserByEmailAndPassword(string email, string password);
        public Task<UserDto> CreateNewUser(string email, string password);
    }
}
