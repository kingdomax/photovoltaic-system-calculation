using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using System.Globalization;
using System.Net.Mail;
using System.Text;
using OfficeOpenXml;

namespace PhotovoltaicSystemCalculation.Services
{
    public class EmailService : IEmailService
    {
        private readonly IUserAccountRepository _userAccountRepository;

        public EmailService(IUserAccountRepository userAccountRepository) 
        {
            _userAccountRepository = userAccountRepository;
        }

        public async Task<bool> SendReport(IList<ReportData> reportData, int userId, string projectName)
        {
            string fileName;

            //Get recipient Email and project name
            UserDTO user = await _userAccountRepository.GetUser(userId);
            string email = user.Email;

            StringBuilder emailBody = new StringBuilder();
            emailBody.AppendLine($"Report 30 Days Electric Produce of All products of the Project: {projectName}");

            //Generate Excel file, grouping product by lat and long
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
            using (var package = new ExcelPackage())
            {
                var groupedReportData = reportData.GroupBy(r => new { r.Product.Id });

                foreach (var group in groupedReportData)
                {
                    var firstItemInGroup = group.First();
                    var ws = package.Workbook.Worksheets.Add($"Product ID:{firstItemInGroup.Product.Id} {firstItemInGroup.Product.Brand}");

                    ws.Cells["A1"].Value = "ProductName";
                    ws.Cells["B1"].Value = "Latitude";
                    ws.Cells["C1"].Value = "Longitude";
                    ws.Cells["D1"].Value = "Date";
                    ws.Cells["E1"].Value = "Electric Production";

                    int rowNumber = 2;
                    foreach (var reportDataItem in group)
                    {
                        Product product = reportDataItem.Product;
                        string productName = product.Name;
                        string latitude = product.Latitude.ToString(CultureInfo.InvariantCulture);
                        string longitude = product.Longitude.ToString(CultureInfo.InvariantCulture);

                        emailBody.AppendLine();
                        emailBody.AppendLine($"Product: {productName}, Latitude: {latitude}, Longitude: {longitude}");

                        IList<ElectricProduction> electricProductions = reportDataItem.ElectricProductions;
                        foreach (ElectricProduction electricProduction in electricProductions)
                        {
                            double epValue = electricProduction.EP;
                            DateTime dateValue = electricProduction.Date;

                            ws.Cells[rowNumber, 1].Value = productName;
                            ws.Cells[rowNumber, 2].Value = latitude;
                            ws.Cells[rowNumber, 3].Value = longitude;
                            ws.Cells[rowNumber, 4].Value = dateValue.ToString(CultureInfo.InvariantCulture);
                            ws.Cells[rowNumber, 5].Value = epValue;

                            rowNumber++;
                        }
                    }
                }

                fileName = "EPreport.xlsx";
                package.SaveAs(new FileInfo(fileName));
            }

            //Send Email with xlsx attched
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

            mail.From = new MailAddress("dbw.project.2023@gmail.com");
            mail.To.Add(email);
            mail.Subject = $"Electric Produces Report of Project {projectName}";
            mail.Body = emailBody.ToString();

            Attachment attachment = new Attachment(fileName);
            mail.Attachments.Add(attachment);

            //SMTP server credentials verify
            SmtpServer.Port = 587;
            SmtpServer.Credentials = new System.Net.NetworkCredential("dbw.project.2023@gmail.com", "rtugmlllaixpnlcj");
            SmtpServer.EnableSsl = true;

            bool isSuccess = false;
            try
            {
                await SmtpServer.SendMailAsync(mail);
                isSuccess = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                // Delete the file after sending the email
                //if (File.Exists(fileName)) { File.Delete(fileName); }
            }
            return isSuccess;
        }
    }
}
