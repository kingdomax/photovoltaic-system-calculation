﻿using PhotovoltaicSystemCalculation.Repositories.Models;

namespace PhotovoltaicSystemCalculation.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        public Task<ProjectDTO> GetProject(int id);
        public Task<IList<ProjectDTO>> GetAllProjects();
        public Task<IList<ProjectDTO>> GetProjects(int userId);
        public Task<ProjectDTO> CreateProject(ProjectDTO newProject);
        public Task<bool> EditProject(int projectId, int newStatus);
        public Task<bool> DeleteProject(int userId, int projectId);
    }
}