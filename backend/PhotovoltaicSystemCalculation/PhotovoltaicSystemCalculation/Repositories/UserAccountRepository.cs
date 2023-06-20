using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class UserAccountRepository : IUserAccountRepository
    {
        private readonly SQLLiteContext _context;
        public UserAccountRepository(SQLLiteContext context) => _context = context;

        public async Task<UserDTO> GetUser(string username, string password)
        {
            // Never store passwords in plain text !!
            // This is simplified version for the sake of prototype app.
            // Always hash and salt them before storage, and compare the hashed (and salted) values when checking login credentials.
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username && u.Password == password);
            return user;
        }

        public async Task<UserDTO> CreateNewUser(string username, string password)
        {
            var newUser = new UserDTO { Username = username, Password = password };
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

        public async Task<UserDTO> UpdateUser(int userId, UserInfo newInfo, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) { throw new ArgumentException("User does not exist"); }

            // Only update fields that are not null or empty
            if (!string.IsNullOrEmpty(newInfo.FirstName)) { user.FirstName = newInfo.FirstName; }
            if (!string.IsNullOrEmpty(newInfo.LastName)) { user.LastName = newInfo.LastName; }
            if (!string.IsNullOrEmpty(newInfo.Address)) { user.Address = newInfo.Address; }
            if (!string.IsNullOrEmpty(newInfo.Country)) { user.Country = newInfo.Country; }
            if (!string.IsNullOrEmpty(newInfo.State)) { user.State = newInfo.State; }
            if (!string.IsNullOrEmpty(newInfo.Zip)) { user.Zip = newInfo.Zip; }
            if (!string.IsNullOrEmpty(newInfo.Email)) { user.Email = newInfo.Email; }
            if (!string.IsNullOrEmpty(newPassword)) { user.Password = newPassword; } // Typically we need to hash this

            try
            {
                _context.Update(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception e)
            {
                throw new Exception("Database error occurred when updating user", e);
            }
        }
    }
}
