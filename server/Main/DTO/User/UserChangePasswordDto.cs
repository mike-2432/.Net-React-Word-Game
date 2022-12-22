using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace logicServer.Main.DTO.User
{
    public class UserChangePasswordDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}