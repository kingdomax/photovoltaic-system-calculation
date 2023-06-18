using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly SQLLiteContext _context;
        public UserAccountRepository(SQLLiteContext context) => _context = context;

        public async Task<UserDTO> GetUserByEmailAndPassword(string email, string password)
        {
            // Never store passwords in plain text !!
            // This is simplified version for the sake of prototype app.
            // Always hash and salt them before storage, and compare the hashed (and salted) values when checking login credentials.
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email && u.Password == password);
            return user;
        }

        public async Task<UserDTO> CreateNewUser(string email, string password)
        {
            var newUser = new UserDTO { Email = email, Password = password };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId); // Delete account based on primary key
            if (user == null) { throw new ArgumentException("User does not exist"); }

            try
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception("Database error occurred when deleting user", e);
            }
        }
    }
}
