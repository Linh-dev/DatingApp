using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : ApiBaseController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;

        public LikesController(ILikesRepository likesRepository, IUserRepository userRepository)
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var soucreUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var soucreUser = await _likesRepository.GetUserWithLikes(soucreUserId);
            
            if (likedUser == null) return NotFound();
            if (soucreUser.UserName == username) return BadRequest("You cannot like yourself");
            
            var userLike = await _likesRepository.GetUserLike(soucreUserId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SoucreUserId = soucreUserId,
                LikedUserId = likedUser.Id
            };

            soucreUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like user");
        }

        [HttpGet("{predicate}")]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLike([FromQuery] LikesParams likesParams)
        {
            var userId = User.GetUserId();
            likesParams.UserId = userId;
            var users = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}
