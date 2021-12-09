using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public LikesRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserLike> GetUserLike(int soucreUserId, int likeUserId)
        {
            return await _context.Likes.FirstOrDefaultAsync(x => x.SoucreUserId == soucreUserId && x.LikedUserId == likeUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(x => x.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();
            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(x => x.SoucreUserId == likesParams.UserId);
                users = likes.Select(x => x.LikedUser);
            }
            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(x => x.LikedUserId == likesParams.UserId);
                users = likes.Select(x => x.SoucreUser);
            }

            var res = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = user.City,
                Id = user.Id
            });
            return await PagedList<LikeDto>.CreateAsync(res.AsNoTracking(), likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users.Include(x => x.LikedUsers).FirstOrDefaultAsync(x => x.Id == userId);
        }

    }
}
