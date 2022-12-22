using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Models;

namespace logicServer.Main.Service
{
    public interface IAuthService
    {
        Task<ServiceResponse<string>> Register(User user, string password);
        Task<ServiceResponse<string>> Login(string username, string password);
        Task<ServiceResponse<string>> ChangePassword(string oldPassword, string newPassword);
        Task<ServiceResponse<Dictionary<string, string>>> GetUserDetails();
        Task<bool> UserExists(string username);
    }
}