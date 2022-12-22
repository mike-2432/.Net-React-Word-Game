using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using logicServer.Main.Data;
using logicServer.Main.Models;
using Microsoft.EntityFrameworkCore;

namespace logicServer.Main.Service
{
    public class WordService : IWordService
    {
        private readonly DataContext _context;
        public WordService(DataContext context)
        {
            _context = context;
        }

        // ENDPOINTS //
        public async Task<ServiceResponse<string>> GetNewWord(int wordlength)
        {
            var serviceResponse = new ServiceResponse<string>();
            var dbWords = await _context.Words
                    .Where(w => w.WordLength == wordlength)
                    .OrderBy(w => Guid.NewGuid())
                    .FirstOrDefaultAsync();
            serviceResponse.Data = dbWords!.Possibilities;
            return serviceResponse;
        }
    }
}