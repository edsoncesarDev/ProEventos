using ProEventos.Application.Dtos;
using ProEventos.Persistence.Pagination;
using System.Threading.Tasks;

namespace ProEventos.Application.IRepositoryApplication
{
    public interface IEventoService
    {
        Task<EventoDto> AddEvento(int userId, EventoDto model);
        Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto evento);
        Task<bool> DeleteEvento(int userId, int eventoId);

        Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
    }
}
