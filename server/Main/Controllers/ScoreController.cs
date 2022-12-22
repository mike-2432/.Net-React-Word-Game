using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Models;
using logicServer.Main.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace logicServer.Main.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/score/")]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreService _scoreService;
        public ScoreController(IScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        // ENDPOINTS //
        [HttpPost("getHighScore")]
        public async Task<ActionResult<ServiceResponse<int>>> GetScore()
        {
            var response = await _scoreService.GetScore();
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("setHighScore/{score}")]
        public async Task<ActionResult<ServiceResponse<string>>> SetScore(int score)
        {
            var response = await _scoreService.SetScore(score);
            return Ok(response);
        }
    }
}