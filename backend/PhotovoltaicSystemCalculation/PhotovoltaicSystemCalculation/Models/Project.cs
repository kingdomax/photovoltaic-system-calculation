namespace PhotovoltaicSystemCalculation.Models
{
    public class Project
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Status { get; set; } // 0=read-only, 1=active
    }
}
