using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Models;

namespace logicServer.Main.Service
{
    public interface IScoreService
    {
        Task<ServiceResponse<int>> GetScore();
        Task<ServiceResponse<string>> SetScore(int score);
    }
}