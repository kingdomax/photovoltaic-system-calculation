namespace PhotovoltaicSystemCalculation.Helpers.Interfaces
{
    public interface ITimeProvider
    {
        DateTime UtcNow { get; }
    }

    public class RealTimeProvider : ITimeProvider
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }

    public class MockTimeProvider : ITimeProvider // For unit testing purpose (eg. DateTimeHelperTests)
    {
        public DateTime UtcNow { get; set; }
    }
}
