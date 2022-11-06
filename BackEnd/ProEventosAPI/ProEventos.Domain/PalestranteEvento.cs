using System.ComponentModel.DataAnnotations;

namespace ProEventos.Domain
{
    public class PalestranteEvento
    {
        
        public int PalestranteId { get; set; }
        public virtual Palestrante Palestrante { get; set; }
        public int EventoId { get; set; }
        public virtual Evento Evento { get; set; }
    }
}
