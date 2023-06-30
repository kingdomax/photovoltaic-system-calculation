using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;

namespace PhotovoltaicSystemCalculation.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<IList<Project>> GetProjects(int userId)
        {
            try
            {
                var projectDTOs = await _projectRepository.GetProjects(userId);
                return projectDTOs.Select(p => new Project
                {
                    Id = p.Id,
                    Name = p.Name,
                    CreatedAt = DateTime.Parse(p.CreatedAt),
                    Status = p.Status == 1
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving projects: {ex.Message}");
            }
        }

        public async Task<Project> CreateProject(int userId, CreateProjectRequest request)
        {
            try
            {
                var projectDto = new ProjectDTO
                {
                    Name = request.Name,
                    CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                    Status = 1,
                    OwnerId = userId
                };

                var newProjectDto = await _projectRepository.CreateProject(projectDto);

                return new Project
                {
                    Id = newProjectDto.Id,
                    OwnerId = userId,
                    Name = newProjectDto.Name,
                    CreatedAt = DateTime.Parse(newProjectDto.CreatedAt),
                    Status = newProjectDto.Status == 1
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while creating a new project: {ex.Message}");
            }
        }

        public async Task<IList<Project>> DeleteProject(int userId, DeleteProjectRequest request)
        {
            try
            {
                var result = await _projectRepository.DeleteProject(userId, request.ProjectId);
                return await GetProjects(userId);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting a project: {ex.Message}");
            }
        }

        public async Task<bool> MarkProjectAsReadOnly(int projectId)
        {
            try
            {
                return await _projectRepository.EditProject(projectId, 0);
            }
            catch (Exception ex) { throw new Exception($"An error occurred while MarkProjectAsReadOnly(): {ex.Message}"); }
        }

        public async Task<IList<Project>> GetOldProjects()
        {
            try
            {
                var projectDTOs = await _projectRepository.GetAllProjects();
                var projects = projectDTOs.Select(p => new Project
                {
                    Id = p.Id,
                    OwnerId = p.OwnerId,
                    Name = p.Name,
                    CreatedAt = DateTime.Parse(p.CreatedAt),
                    Status = p.Status == 1
                }).ToList();

                var currentDate = DateTime.Now;
                return projects.Where(p => p.Status == true && (currentDate - p.CreatedAt).TotalDays >= 30).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving old projects: {ex.Message}");
            }
        }
    }
}
