using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using logicServer.Main.Data;
using logicServer.Main.Models;
using Microsoft.EntityFrameworkCore;

namespace logicServer.Main.Service
{
    public class ScoreService : IScoreService
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ScoreService(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET USER ID //
        private int GetUserId() => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET HIGHSCORE //
        public async Task<ServiceResponse<int>> GetScore()
        {
            var serviceResponse = new ServiceResponse<int>();
            var scoreRow = await _context.Scores.FirstOrDefaultAsync(u => u.UserId == GetUserId());
            if (scoreRow is null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "No high-score";
                return serviceResponse;
            }
            serviceResponse.Data = scoreRow.HighScore;
            return serviceResponse;
        }

        // SET HIGHSCORE //
        public async Task<ServiceResponse<string>> SetScore(int score)
        {
            var serviceResponse = new ServiceResponse<string>();
            var scoreRow = await _context.Scores.FirstOrDefaultAsync(u => u.UserId == GetUserId());
            if (scoreRow is null)
            {
                Score newScoreRow = new Score();
                newScoreRow.HighScore = score;
                newScoreRow.UserId = GetUserId();
                _context.Scores.Add(newScoreRow);
            }
            else
            {
                scoreRow!.HighScore = Math.Max(score, scoreRow.HighScore);
                _context.Scores.Attach(scoreRow);
            }
            await _context.SaveChangesAsync();
            return serviceResponse;
        }
    }
}