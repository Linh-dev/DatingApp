using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserLike>().HasKey(e => new { e.LikedUserId, e.SoucreUserId });
            builder.Entity<UserLike>().HasOne(e => e.SoucreUser).WithMany(l => l.LikedUsers).HasForeignKey(e => e.SoucreUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserLike>().HasOne(e => e.LikedUser).WithMany(l => l.LikedByUsers).HasForeignKey(e => e.LikedUserId).OnDelete(DeleteBehavior.Cascade);
        }
        
    }
}