using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace logicServer.Main.Model
{
    public class Word
    {
        public int Id { get; set; }
        public int WordLength { get; set; }
        public string Possibilities { get; set; } = string.Empty;
    }
}