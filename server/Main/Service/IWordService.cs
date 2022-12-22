using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Models;

namespace logicServer.Main.Service
{
    public interface IWordService
    {
        Task<ServiceResponse<string>> GetNewWord(int wordlength);
    }
}