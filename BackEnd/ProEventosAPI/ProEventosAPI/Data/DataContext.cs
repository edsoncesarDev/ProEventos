using Microsoft.EntityFrameworkCore;
using ProEventosAPI.Models;
using System;

namespace ProEventosAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
       
        public DbSet<Evento> Eventos { get; set; }
    }
}
