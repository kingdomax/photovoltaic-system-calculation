using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class EmailService : IEmailService
    {
        // List of reportData
        // 1 reportData = 1 product + 30 days electric production 
        public async Task<bool> SendReport(IList<ReportData> reportData, string recipientEmail)
        {
            return true;
        }
    }
}
