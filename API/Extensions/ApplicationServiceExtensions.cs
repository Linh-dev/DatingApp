using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ITokenService, TokenService>();

            services.AddDbContext<DataContext>(option => {
                option.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            });
            return services;
        }
    }
}
