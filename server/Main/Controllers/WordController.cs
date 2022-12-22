using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Data;
using logicServer.Main.Model;
using logicServer.Main.Models;
using logicServer.Main.Service;
using Microsoft.AspNetCore.Mvc;

namespace server.Main.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordController : ControllerBase
    {
        private readonly IWordService _iWordService;
        public WordController(IWordService iWordService, DataContext context)
        {
            _iWordService = iWordService;
        }

        // ENDPOINTS //
        [HttpGet("GetWord/{length}")]
        public async Task<ActionResult<ServiceResponse<string>>> GetWord(int length)
        {
            var response = await _iWordService.GetNewWord(length);
            return Ok(response);
        }
    }
}