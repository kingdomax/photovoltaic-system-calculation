using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly SQLLiteContext _context;
        public ProjectRepository(SQLLiteContext context) => _context = context;

        public async Task<ProjectDTO> GetProject(int userId)
        {
            return await _context.Projects.SingleOrDefaultAsync(p => p.Id == userId);
        }

        public async Task<IList<ProjectDTO>> GetProjects(int userId)
        {
            try
            {
                return await _context.Projects.Where(p => p.OwnerId == userId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving projects from the database: {ex.Message}");
            }
        }

        public async Task<ProjectDTO> CreateProject(ProjectDTO newProject)
        {
            try
            {
                _context.Projects.Add(newProject);
                await _context.SaveChangesAsync();
                return newProject;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while creating a new project in the database: {ex.Message}");
            }
        }

        public async Task<bool> DeleteProject(int userId, int projectId)
        {
            try
            {
                var project = await _context.Projects.FirstOrDefaultAsync(p => p.OwnerId == userId && p.Id == projectId);
                if (project != null)
                {
                    _context.Projects.Remove(project);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting a project from the database: {ex.Message}");
            }
        }
    }
}
