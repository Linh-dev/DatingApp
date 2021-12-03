using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>().HasMany(ur => ur.UserRoles).WithOne(u => u.User).HasForeignKey(ur => ur.UserId).IsRequired();
            builder.Entity<AppRole>().HasMany(ur => ur.UserRoles).WithOne(u => u.Role).HasForeignKey(ur => ur.RoleId).IsRequired();

            builder.Entity<UserLike>().HasKey(e => new { e.LikedUserId, e.SoucreUserId });
            builder.Entity<UserLike>().HasOne(e => e.SoucreUser).WithMany(l => l.LikedUsers).HasForeignKey(e => e.SoucreUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserLike>().HasOne(e => e.LikedUser).WithMany(l => l.LikedByUsers).HasForeignKey(e => e.LikedUserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Message>().HasOne(e => e.Recipient).WithMany(l => l.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Message>().HasOne(e => e.Sender).WithMany(l => l.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        }
        
    }
}