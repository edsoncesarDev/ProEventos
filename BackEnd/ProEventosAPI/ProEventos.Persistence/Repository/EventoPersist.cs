using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Context;
using ProEventos.Persistence.IRepository;
using ProEventos.Persistence.Pagination;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Repository
{
    public class EventoPersist : IEventoPersist
    {

        private readonly ProEventosContext _context;
        public EventoPersist(ProEventosContext context)
        {
            _context = context;
        }
        
        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(l => l.Lotes)
                .Include(r => r.RedesSociais);

            if (includePalestrantes)
            {
                query.Include(pe => pe.PalestrantesEventos)
                     .ThenInclude(p => p.Palestrante);
            }

            query = query.Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                                      e.Local.ToLower().Contains(pageParams.Term.ToLower())) &&
                                      e.UserId == userId)
                         .OrderBy(e => e.Id)
                         .AsNoTracking();

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(l => l.Lotes)
                .Include(r => r.RedesSociais);

            if (includePalestrantes)
            {
                query = query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.OrderBy(e => e.Id)
                .Where(e => e.Id == eventoId && e.UserId == userId)
                .AsNoTracking();

            return await query.FirstOrDefaultAsync();
        }

    }
}
