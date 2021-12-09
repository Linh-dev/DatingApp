using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using API.Extensions;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resutContext = await next();

            if (!resutContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resutContext.HttpContext.User.GetUserId();
            var repo = resutContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
            var user = await repo.UserRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await repo.Complete();
        }
    }
}
