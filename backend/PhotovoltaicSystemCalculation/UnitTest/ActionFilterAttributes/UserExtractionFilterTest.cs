using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using PhotovoltaicSystemCalculation.ActionFilterAttributes;

namespace UnitTest.ActionFilterAttributes
{
    public class UserExtractionFilterTests
    {
        private readonly UserExtractionFilter _filter;
        private readonly ActionExecutingContext _context;

        public UserExtractionFilterTests()
        {
            _filter = new UserExtractionFilter();

            // Prepare the HttpContext and ActionExecutingContext
            var httpContext = new DefaultHttpContext();
            var actionContext = new ActionContext()
            {
                HttpContext = httpContext,
                RouteData = new Microsoft.AspNetCore.Routing.RouteData(),
                ActionDescriptor = new Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor(),
            };
            _context = new ActionExecutingContext(
                actionContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>(),
                new object());
        }

        [Fact]
        public void OnActionExecuting_NoAuthorizationHeader_ReturnsUnauthorized()
        {
            // Act
            _filter.OnActionExecuting(_context);

            // Assert
            Assert.IsType<UnauthorizedResult>(_context.Result);
        }

        [Fact]
        public void OnActionExecuting_WithAuthorizationHeader_ExtractsUserId()
        {
            // Arrange
            string userId = "123";
            _context.HttpContext.Request.Headers["Authorization"] = $"{userId}.username";

            // Act
            _filter.OnActionExecuting(_context);

            // Assert
            Assert.Equal(Convert.ToInt32(userId), _context.HttpContext.Items["UserId"]);
        }
    }
}
