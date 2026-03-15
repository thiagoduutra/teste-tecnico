using System.Data;
using Microsoft.Data.Sqlite;
using Scalar.AspNetCore;

namespace WebAPIGastos.Data;

public class DbConnectionFactory
{
    private readonly IConfiguration _configuration;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IDbConnection CreateConnection()
    {
        return new SqliteConnection(_configuration.GetConnectionString("DefaultConnection"));
    }
}