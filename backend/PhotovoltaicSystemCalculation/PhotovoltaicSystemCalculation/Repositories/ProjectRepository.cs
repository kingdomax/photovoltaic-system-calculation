using PhotovoltaicSystemCalculation.Repositories.Models;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using PhotovoltaicSystemCalculation.Models;

namespace PhotovoltaicSystemCalculation.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly SQLLiteContext _context;
        public ProjectRepository(SQLLiteContext context) => _context = context;

        public async Task<ProjectDTO> GetProject(int id)
        {
            return await _context.Projects.SingleOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IList<ProjectDTO>> GetAllProjects()
        {
            return await _context.Projects.ToListAsync();
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

        public async Task<bool> EditProject(int projectId, int newStatus)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) { throw new ArgumentException("User does not exist"); }

            // Only update fields that are not null or empty
            if (project.Status != newStatus) { project.Status = newStatus; }

            try
            {
                _context.Update(project);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception("Database error occurred when updating user", e);
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
