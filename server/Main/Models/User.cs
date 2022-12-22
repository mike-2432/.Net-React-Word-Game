using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace logicServer.Main.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = new byte[0];
        public byte[] PasswordSalt { get; set; } = new byte[0];
        public Score? Score { get; set; }
    }
}