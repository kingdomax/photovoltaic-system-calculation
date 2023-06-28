using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        public Task<IList<ProjectDTO>> GetProjects(int userId);
        public Task<ProjectDTO> CreateProject(ProjectDTO newProject);
    }
}