using ProEventos.Domain;
using ProEventos.Persistence.Pagination;
using System.Threading.Tasks;

namespace ProEventos.Persistence.IRepository
{
    public interface IEventoPersist
    {
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes = false);
        
    }
}
