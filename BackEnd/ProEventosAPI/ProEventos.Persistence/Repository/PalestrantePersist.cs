using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Context;
using ProEventos.Persistence.IRepository;
using ProEventos.Persistence.Pagination;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Repository
{
    public class PalestrantePersist : GeralPersist, IPalestrantePersist
    {
        private readonly ProEventosContext _context;
        public PalestrantePersist(ProEventosContext context) : base(context)
        {
            _context = context;
        }

        public async Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                 .Include(p => p.User)
                 .Include(r => r.RedesSociais);

            if (includeEventos)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking()
                         .Where(p => (p.MiniCurriculo.ToLower().Contains(pageParams.Term.ToLower()) ||
                                      p.User.PrimeiroNome.ToLower().Contains(pageParams.Term.ToLower()) ||
                                      p.User.UltimoNome.ToLower().Contains(pageParams.Term.ToLower())) &&
                                      p.User.Funcao == Domain.Enum.Funcao.Palestrante)
                         .OrderBy(p => p.Id);

            return await PageList<Palestrante>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.User)
                .Include(r => r.RedesSociais);

            if (includeEventos)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Evento);
            }

            query = query.OrderBy(p => p.Id)
                         .Where(p => p.UserId == userId)
                         .AsNoTracking();

            return await query.FirstOrDefaultAsync();
        }
    }
}
