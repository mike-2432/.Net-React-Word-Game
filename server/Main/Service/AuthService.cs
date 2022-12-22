using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using logicServer.Main.Data;
using logicServer.Main.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace logicServer.Main.Service
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AuthService(DataContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // INTERFACE METHODS //
        // ================= //
        // LOGIN //
        public async Task<ServiceResponse<string>> Login(string username, string password)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower().Equals(username.ToLower()));
            if (user is null)
            {
                response.Success = false;
                response.Message = "Login Failed";
            }
            else if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Login Failed";
            }
            else
            {
                response.Data = CreateToken(user);
                response.Message = "Success";
            }
            return response;
        }

        // REGISTER //
        public async Task<ServiceResponse<string>> Register(User user, string password)
        {
            var response = new ServiceResponse<string>();
            if (await UserExists(user.Username))
            {
                response.Success = false;
                response.Message = "User already exists.";
                return response;
            }
            if (await EmailExists(user.Email))
            {
                response.Success = false;
                response.Message = "Email already exists.";
                return response;
            }
            if (PasswordValid(password) == false)
            {
                response.Success = false;
                response.Message = "Password is not valid";
                return response;
            }
            if (EmailValid(user.Email) == false)
            {
                response.Success = false;
                response.Message = "Email is not valid";
                return response;
            }

            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            response.Message = "Success";
            return response;
        }

        // GET USER DETAILS //
        public async Task<ServiceResponse<Dictionary<string, string>>> GetUserDetails()
        {
            var response = new ServiceResponse<Dictionary<string, string>>();
            var userDetails = new Dictionary<string, string>();

            var user = await _context.Users.FirstAsync(u => u.Id == GetUserId());
            userDetails.Add("Username", user.Username);
            userDetails.Add("Email", user.Email);
            response.Data = userDetails;
            response.Message = "Success";
            return response;
        }

        // USER EXISTS //
        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower())) return true;
            return false;
        }

        // CHANGE PASSWORD //
        public async Task<ServiceResponse<string>> ChangePassword(string oldPassword, string newPassword)
        {
            var response = new ServiceResponse<string>();
            if (PasswordValid(newPassword) == false)
            {
                response.Success = false;
                response.Message = "Password is not valid";
                return response;
            }

            var user = await _context.Users.FirstAsync(u => u.Id == GetUserId());
            if (!VerifyPasswordHash(oldPassword, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Old Password is not correct";
                return response;
            }
            if (VerifyPasswordHash(newPassword, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Password did not change";
                return response;
            }

            CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _context.Users.Attach(user);
            await _context.SaveChangesAsync();
            response.Message = "Success";
            return response;
        }

        // GET USER ID //
        private int GetUserId() => int.Parse(_httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!);


        // VALIDATION METHODS //
        // ================= //
        // EMAIL EXISTS //
        private async Task<bool> EmailExists(string email)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower())) return true;
            return false;
        }

        // IS PASSWORD VALID //
        private bool PasswordValid(string password)
        {
            var hasRequired = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            var isValid = hasRequired.IsMatch(password);
            return isValid;
        }

        // IS EMAIL VALID //
        private bool EmailValid(string email)
        {
            Regex regex = new Regex(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*" + "@" + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))$");
            Match match = regex.Match(email);
            if (match.Success) return true;
            return false;
        }

        // PASSWORD METHODS //
        // ================ //
        // CREATE PASSWORD HASH //
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        // VALIDATE PASSWORD //
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        // CREATE TOKEN ///
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var appSettingsToken = _configuration.GetSection("AppSettings:Token").Value;
            if (appSettingsToken is null)
                throw new Exception("Appsettings Token is null");

            SymmetricSecurityKey key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingsToken));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}