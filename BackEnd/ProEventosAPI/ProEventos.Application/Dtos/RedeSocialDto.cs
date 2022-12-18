namespace ProEventos.Application.Dtos
{
    public class RedeSocialDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string URL { get; set; }
        public int? EventoId { get; set; }
        public virtual EventoDto Evento { get; set; }
        public int? PalestranteId { get; set; }
        public virtual PalestranteDto Palestrante { get; set; }

    }
}
