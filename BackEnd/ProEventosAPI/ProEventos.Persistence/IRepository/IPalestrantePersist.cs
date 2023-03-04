using ProEventos.Domain;
using ProEventos.Persistence.Pagination;
using System.Threading.Tasks;

namespace ProEventos.Persistence.IRepository
{
    public interface IPalestrantePersist : IGeralPersist
    {
        Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    }
}
