using Scalar.AspNetCore;
using WebAPIGastos.Data;
using WebAPIGastos.Repositories;
using WebAPIGastos.Services;
using WebAPIGastos.Services.Categoria;

SQLitePCL.Batteries.Init();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<PessoaRepository>();
builder.Services.AddScoped<CategoriaRepository>();
builder.Services.AddScoped<TransacaoRepository>();
builder.Services.AddScoped<TransacaoService>();
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<CategoriaService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("front", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<DbConnectionFactory>();
    DatabaseInitializer.Initialize(factory);
}

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("front");
app.UseAuthorization();
app.MapControllers();

app.Run();
