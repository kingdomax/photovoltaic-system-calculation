using System.Globalization;
using PhotovoltaicSystemCalculation.Helpers.Interfaces;

namespace PhotovoltaicSystemCalculation.Helpers
{
    public static class DateTimeHelper
    {
        public static ITimeProvider TimeProvider { get; set; } = new RealTimeProvider();

        public static long ConvertToUnix(string iso8601String)
        {
            DateTime dateTime;

            // Parse the date time string in specified format
            if (DateTime.TryParseExact(iso8601String, "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime))
            {
                // Convert it to UTC (if it's not already)
                DateTime utcDateTime = dateTime.ToUniversalTime();

                // Get Unix timestamp
                long unixTimestamp = ((DateTimeOffset)utcDateTime).ToUnixTimeSeconds();

                return unixTimestamp;
            }
            
            Console.WriteLine("Invalid date time string");
            return 0;
        }

        public static long GetCurrentUnixTimestampMinusThreeHours()
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var unixTimestamp = (long)(TimeProvider.UtcNow.AddHours(-3) - epoch).TotalSeconds;

            return unixTimestamp;
        }
    }
}
