using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace logicServer.Main.Models
{
    public class Score
    {
        public int Id { get; set; }
        public int HighScore { get; set; }
        public User? User { get; set; }
        public int UserId { get; set; } // Foreign Key
    }
}