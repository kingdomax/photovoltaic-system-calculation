using PhotovoltaicSystemCalculation.Helpers;
using PhotovoltaicSystemCalculation.Helpers.Interfaces;

namespace UnitTest.Helpers
{
    public class DateTimeHelperTests
    {
        [Theory]
        [InlineData("invalid-string")]
        [InlineData("2022-99-99 99:99:99.999")]
        public void ConvertToUnix_InvalidDateTimeString_ReturnsZero(string iso8601String)
        {
            // Act
            long actualUnixTimestamp = DateTimeHelper.ConvertToUnix(iso8601String);

            // Assert
            Assert.Equal(0, actualUnixTimestamp);
        }

        [Fact]
        public void GetCurrentUnixTimestampMinusThreeHours_ReturnsCorrectTimestamp()
        {
            // Arrange
            var mockTimeProvider = new MockTimeProvider
            {
                UtcNow = new DateTime(2022, 10, 14, 12, 34, 56, DateTimeKind.Utc)
            };
            DateTimeHelper.TimeProvider = mockTimeProvider;

            long expectedUnixTimestamp = 1665740096; // Corresponding Unix timestamp for 2022-10-14 09:34:56 UTC

            // Act
            long actualUnixTimestamp = DateTimeHelper.GetCurrentUnixTimestampMinusThreeHours();

            // Assert
            Assert.Equal(expectedUnixTimestamp, actualUnixTimestamp);
        }
    }
}
