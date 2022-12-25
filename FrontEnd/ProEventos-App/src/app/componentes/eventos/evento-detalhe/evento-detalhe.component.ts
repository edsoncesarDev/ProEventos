import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  public evento = {} as Evento;
  public form!: FormGroup;
  public estadoSalvar: string = 'post';

  public get f(): any{
    return this.form.controls;
  }

  public get bsconfigDate(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'MM/DD/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,)
  {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['',[Validators.required ]],
      dataEvento: ['',[Validators.required ]],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['',[Validators.required ]],
      email: ['', [Validators.required, Validators.email ]],
      imagemURL: ['',[Validators.required ]],

    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null){
      this.spinner.show();
      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento.','Erro!');
          console.error(error);
        },
        complete: () => this.spinner.hide()
      })
    }
  }

  public salvarAlteracao(): void {
    this.spinner.show();

    if(this.form.valid){
      debugger

      this.evento = (this.estadoSalvar == 'post')
                    ? this.evento = {...this.form.value}
                    : this.evento = {id: this.evento.id, ...this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe({
        next: () => this.toastr.success('Evento salvo com sucesso!', 'Sucesso'),
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento!', 'Erro!');
          console.error(error);
        },
        complete: () => this.spinner.hide()
      });

    }
  }
}
