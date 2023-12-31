﻿using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IEmailService
    {
        public Task<bool> SendReport(IList<ReportData> reportData, int userId, string projectName);
    }
}