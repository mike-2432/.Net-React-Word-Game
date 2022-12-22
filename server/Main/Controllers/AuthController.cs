using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.DTO.User;
using logicServer.Main.Models;
using logicServer.Main.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace logicServer.Main.Controllers
{
    [ApiController]
    [Route("api/auth/")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _iAuthService;
        public AuthController(IAuthService iAuthService)
        {
            _iAuthService = iAuthService;
        }

        // ENDPOINTS //
        [Authorize]
        [HttpPost("allowed")]
        public ActionResult<ServiceResponse<string>> Allowed()
        {
            var response = new ServiceResponse<string>();
            response.Data = "Success";
            return Ok(response);
        }

        [Authorize]
        [HttpPost("getDetails")]
        public async Task<ActionResult<ServiceResponse<Dictionary<string, string>>>> GetUsername()
        {
            var response = await _iAuthService.GetUserDetails();
            return Ok(response);
        }

        [Authorize]
        [HttpPost("changePassword")]
        public async Task<ActionResult<ServiceResponse<string>>> ChangePassword(UserChangePasswordDto request)
        {
            var response = await _iAuthService.ChangePassword(request.OldPassword, request.NewPassword);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse<string>>> Register(UserRegisterDto request)
        {
            var response = await _iAuthService.Register(new User { Username = request.Username, Email = request.Email }, request.Password);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ServiceResponse<string>>> Login(UserLoginDto request)
        {
            var response = await _iAuthService.Login(request.Username, request.Password);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
    }
}