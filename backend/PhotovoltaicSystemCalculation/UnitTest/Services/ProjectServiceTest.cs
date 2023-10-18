using Moq;
using PhotovoltaicSystemCalculation.Models;
using PhotovoltaicSystemCalculation.Services;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Models;

namespace UnitTest.Services
{
    public class ProjectServiceTest
    {
        private readonly Mock<IProjectRepository> _mockProjectRepository;

        public ProjectServiceTest()
        {
            _mockProjectRepository = new Mock<IProjectRepository>();
        }

        [Fact]
        public async Task GetProjects_ReturnsListOfProjects()
        {
            // Arrange
            var userId = 1;
            var projectList = new List<ProjectDTO>
            {
                new ProjectDTO { Id = 1, Name = "Project1", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"), Status = 1 },
                new ProjectDTO { Id = 2, Name = "Project2", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"), Status = 1 }
            };
            _mockProjectRepository.Setup(repo => repo.GetProjects(userId)).ReturnsAsync(projectList);
            var projectService = new ProjectService(_mockProjectRepository.Object);

            // Act
            var result = await projectService.GetProjects(userId);

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task CreateProject_ReturnsNewProject()
        {
            // Arrange
            var userId = 1;
            var createProjectRequest = new CreateProjectRequest { Name = "NewProject" };
            var newProjectDto = new ProjectDTO
            {
                Id = 3,
                Name = "NewProject",
                CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                Status = 1
            };
            _mockProjectRepository.Setup(repo => repo.CreateProject(It.IsAny<ProjectDTO>())).ReturnsAsync(newProjectDto);
            var projectService = new ProjectService(_mockProjectRepository.Object);

            // Act
            var result = await projectService.CreateProject(userId, createProjectRequest);

            // Assert
            Assert.True(result.Status);
            Assert.Equal(3, result.Id);
            Assert.Equal(userId, result.OwnerId);
            Assert.Equal("NewProject", result.Name);
        }

        [Fact]
        public async Task DeleteProject_ReturnsUpdatedListOfProjects()
        {
            // Arrange
            var userId = 1;
            var deleteProjectRequest = new DeleteProjectRequest { ProjectId = 2 };
            _mockProjectRepository.Setup(repo => repo.DeleteProject(userId, deleteProjectRequest.ProjectId)).ReturnsAsync(true);
            _mockProjectRepository.Setup(repo => repo.GetProjects(userId)).ReturnsAsync(new List<ProjectDTO>());

            var projectService = new ProjectService(_mockProjectRepository.Object);

            // Act
            var result = await projectService.DeleteProject(userId, deleteProjectRequest);

            // Assert
            _mockProjectRepository.Verify(repo => repo.DeleteProject(userId, deleteProjectRequest.ProjectId), Times.Once);
            Assert.Equal(0, result.Count);
        }

        [Fact]
        public async Task MarkProjectAsReadOnly_SetsProjectStatus()
        {
            // Arrange
            var projectId = 1;
            _mockProjectRepository.Setup(repo => repo.EditProject(projectId, 0)).ReturnsAsync(true);
            var projectService = new ProjectService(_mockProjectRepository.Object);

            // Act
            var result = await projectService.MarkProjectAsReadOnly(projectId);

            // Assert
            _mockProjectRepository.Verify(repo => repo.EditProject(projectId, 0), Times.Once);
            Assert.True(result);
        }

        [Fact]
        public async Task GetOldProjects_ReturnsOldProjects()
        {
            // Arrange
            var projectList = new List<ProjectDTO>
            {
                // Create some projects with different dates
                new ProjectDTO { Id = 1, Name = "A-Project", CreatedAt = DateTime.Now.AddDays(-31).ToString("yyyy-MM-dd HH:mm:ss.fff"), Status = 1 },
                new ProjectDTO { Id = 2, Name = "B-Project", CreatedAt = DateTime.Now.AddDays(-31).ToString("yyyy-MM-dd HH:mm:ss.fff"), Status = 0 },
                new ProjectDTO { Id = 3, Name = "C-Project", CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"), Status = 1 }
            };

            _mockProjectRepository.Setup(repo => repo.GetAllProjects()).ReturnsAsync(projectList);

            var projectService = new ProjectService(_mockProjectRepository.Object);

            // Act
            var result = await projectService.GetOldProjects();

            // Assert
            Assert.Single(result);
            Assert.Equal("A-Project", result.First().Name); // Only project that create more than 30 day and status still 1 should be old
        }
    }
}
