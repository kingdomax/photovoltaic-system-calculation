using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Services.Interfaces
{
    public interface IProjectService
    {
        public Task<IList<Project>> GetProjects(int userId);
        public Task<IList<Project>> GetOldProjects();
        public Task<Project> CreateProject(int userId, CreateProjectRequest newProject);
        public Task<bool> MarkProjectAsReadOnly(int projectId);
        public Task<IList<Project>> DeleteProject(int userId, DeleteProjectRequest request);
    }
}
