using Microsoft.AspNetCore.Mvc;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ActionFilterAttributes;

namespace PhotovoltaicSystemCalculation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost("GetProjectList")]
        [UserExtractionFilter]
        public async Task<IActionResult> GetProjectList()
        {
            try
            {
                var projectList = await _projectService.GetProjects((int)HttpContext.Items["UserId"]);
                return Ok(projectList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("CreateProject")]
        [UserExtractionFilter]
        public async Task<IActionResult> CreateProject(CreateProjectRequest request)
        {
            if (string.IsNullOrEmpty(request?.Name))
            {
                return BadRequest("Invalid create project request");
            }
            
            try
            {
                var newProject = await _projectService.CreateProject((int)HttpContext.Items["UserId"], request);
                return Ok(newProject);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("DeleteProject")]
        [UserExtractionFilter]
        public async Task<IActionResult> DeleteProject(DeleteProjectRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid delete project request");
            }

            try
            {
                var projects = await _projectService.DeleteProject((int)HttpContext.Items["UserId"], request);
                return projects != null ? Ok(projects) : NotFound(new { Message = "Project not found or user not authorized." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
