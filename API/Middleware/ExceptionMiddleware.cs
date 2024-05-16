using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            this._logger = logger;
            this._next = next;
            this._env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // all good, slide to the next middleware using _next()
                await _next(context);
            }
            catch (Exception ex)
            {
                // an exception occurs, log it in _logger.LogError()
                _logger.LogError(ex, ex.Message);

                // provide exception details
                var response = new ProblemDetails
                {
                    Status = 500,
                    // only provide the details if the environment is in development
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                    Title = ex.Message
                };

                // serialize our exception details into JSON
                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                // add our exception details into context
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;
                context.Response.WriteAsync(json);
            }
        }
    }
}