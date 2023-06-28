namespace PhotovoltaicSystemCalculation.Repositories.Models
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public string CreatedAt { get; set; }
        public int Status { get; set; } // 0=read-only, 1=active
    }
}
