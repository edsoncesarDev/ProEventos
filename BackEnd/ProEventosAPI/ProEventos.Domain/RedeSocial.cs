namespace ProEventos.Domain
{
    public class RedeSocial
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string URL { get; set;}
        public int? EventoId { get; set; }
        public virtual Evento Evento { get; set; }
        public int? PalestranteId { get; set; }
        public virtual Palestrante Palestrante { get; set; }

    }
}
