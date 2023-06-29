using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using System.Globalization;
using System.Net.Mail;
using System.Text;

namespace PhotovoltaicSystemCalculation.Services
{
    public class EmailService : IEmailService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IUserAccountRepository _userAccountRepository;

        public EmailService(IProjectRepository projectRepository, IUserAccountRepository userAccountRepository) 
        {
            _projectRepository = projectRepository;
            _userAccountRepository = userAccountRepository;
        }

        public async Task<bool> SendReport(IList<ReportData> reportData, int userId)
        {
            //Get recipient Email
            UserDTO user = await _userAccountRepository.GetUser(userId);
            string email = user.Email;

            ProjectDTO project = await _projectRepository.GetProject(reportData[0].Product.ProjectId);
            string projectName = project.Name;

            string email1 = "patboke.jit@gmail.com";

            StringBuilder emailBody = new StringBuilder();
            emailBody.AppendLine($"Project: {projectName}");

            StringBuilder csvContent = new StringBuilder();
            csvContent.AppendLine("ProductName,Latitude,Longitude,Date");

            foreach (ReportData reportDataItem in reportData)
            {
                Product product = reportDataItem.Product;
                string productName = product.Name;
                string latitude = product.Latitude.ToString();
                string longitude = product.Longitude.ToString();

                emailBody.AppendLine($"Product: {productName}, Latitude: {latitude}, Longitude: {longitude}");

                IList<ElectricProduction> electricProductions = reportDataItem.ElectricProductions;
                foreach (ElectricProduction electricProduction in electricProductions)
                {
                    double epValue = electricProduction.EP;
                    DateTime dateValue = electricProduction.Date;

                    emailBody.AppendLine($"Electric Production: {epValue}, Date: {dateValue}");
                    // add data to CSV
                    csvContent.AppendLine($"{productName},{latitude},{longitude},{dateValue.ToString(CultureInfo.InvariantCulture)}");
                }
            }

            // Write CSV data to a file
            string fileName = "report.csv";
            File.WriteAllText(fileName, csvContent.ToString());

            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com"); // You can use SMTP servers like smtp.gmail.com

            mail.From = new MailAddress("dbw.project.2023@gmail.com");
            mail.To.Add(email1);
            mail.Subject = $"Report for Project {projectName}";
            mail.Body = emailBody.ToString();

            // Attach CSV file
            Attachment attachment = new Attachment(fileName);
            mail.Attachments.Add(attachment);

            // Use this if your SMTP server requires credentials
            SmtpServer.Port = 587; // Change if necessary
            SmtpServer.Credentials = new System.Net.NetworkCredential("dbw.project.2023@gmail.com", "rtugmlllaixpnlcj");
            SmtpServer.EnableSsl = true; // Some servers require this

            try
            {
                await SmtpServer.SendMailAsync(mail);
                return true;
            }
            catch (Exception ex)
            {
                // Handle the exception here
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                // Delete the file after sending the email
                if (File.Exists(fileName))
                {
                    File.Delete(fileName);
                }
            }
        }
    }
}
