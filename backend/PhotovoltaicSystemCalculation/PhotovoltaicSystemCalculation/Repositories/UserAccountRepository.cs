using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly SQLLiteContext _context;
        public UserAccountRepository(SQLLiteContext context) => _context = context;

        public async Task<UserDto> GetUserByEmailAndPassword(string email, string password)
        {
            // Never store passwords in plain text !!
            // This is simplified version for the sake of prototype app.
            // Always hash and salt them before storage, and compare the hashed (and salted) values when checking login credentials.
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email && u.Password == password);
            return user;
        }

        public async Task<UserDto> CreateNewUser(string email, string password)
        {
            var newUser = new UserDto { Email = email, Password = password };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }
    }
}
