using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Model;
using logicServer.Main.Models;
using Microsoft.EntityFrameworkCore;

namespace logicServer.Main.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Word> Words => Set<Word>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Score> Scores => Set<Score>();
    }
}