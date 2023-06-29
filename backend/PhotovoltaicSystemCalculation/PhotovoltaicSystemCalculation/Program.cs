using PhotovoltaicSystemCalculation.Services;
using PhotovoltaicSystemCalculation.ExternalAPI;
using PhotovoltaicSystemCalculation.Repositories;
using PhotovoltaicSystemCalculation.Services.Interfaces;
using PhotovoltaicSystemCalculation.ExternalAPI.Interfaces;
using PhotovoltaicSystemCalculation.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register your services here
builder.Services.AddDbContext<SQLLiteContext>();
builder.Services.AddScoped<ISolarAPI, SolarAPI>();
builder.Services.AddScoped<IWeatherForecastAPI, WeatherForecastAPI>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IPhotovoltaicService, PhotovoltaicService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Configure CORS here
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder => {
        // Replace with the client-side address
        builder.WithOrigins("http://localhost:8080").AllowAnyHeader().AllowAnyMethod();
        builder.WithOrigins("http://127.0.0.1:8080").AllowAnyHeader().AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection(); don't want to deal with CORS stuff

app.UseAuthorization();

app.UseCors("AllowSpecificOrigin");

app.MapControllers();

app.Run();
