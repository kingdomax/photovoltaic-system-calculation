using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PhotovoltaicSystemCalculation.ActionFilterAttributes
{
    public class UserExtractionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string authorization = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authorization))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userId = authorization.Split('.')[0];
            context.HttpContext.Items["UserId"] = Convert.ToInt32(userId);
        }
    }
}
