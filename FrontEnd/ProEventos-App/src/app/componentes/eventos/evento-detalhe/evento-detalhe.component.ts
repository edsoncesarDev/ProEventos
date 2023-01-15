import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/Evento';
import { Lote } from 'src/app/models/Lote';
import { LoteService } from 'src/app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {

  public evento = {} as Evento;
  public eventoId!: number;
  public form!: FormGroup;
  public estadoSalvar: string = 'post';
  public modalRef!: BsModalRef;
  public loteAtual = {id: 0, nome: '', indice: 0};
  public imagemURL = 'assets/upload.png';
  public file!: File;

  public get f(): any{
    return this.form.controls;
  }

  public get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  public get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activatedrouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router,
              private loteService: LoteService,
              private modalService: BsModalService)
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
      imagemURL: [''],
      lotes: this.fb.array([])

    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any{
    return {'is-invalid': campoForm?.errors && campoForm.touched};
  }

  public carregarEvento(): void {
    this.eventoId = Number(this.activatedrouter.snapshot.paramMap.get('id'));

    if(this.eventoId != null && this.eventoId != 0){
      this.spinner.show();
      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (eventoRetorno: Evento) => {
          eventoRetorno.dataEvento = new Date(eventoRetorno.dataEvento || '');
          this.evento = {...eventoRetorno};
          this.form.patchValue(this.evento);

          if(this.evento.imagemURL != ''){
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }

          //carregando lotes
          eventoRetorno.lotes.forEach(lote => {
            lote.dataInicio = new Date(lote.dataInicio || '');
            lote.dataFim = new Date(lote.dataFim || '');
            this.lotes.push(this.criarLote(lote));
          });

        },
        error: (error: any) => {
          this.toastr.error('Erro ao tentar carregar evento.','Erro!');
          console.error(error);
        }

      }).add(() => this.spinner.hide());
    }
  }

  public salvarEvento(): void {

    this.spinner.show();

    if(this.form.valid){
      debugger

      this.evento = (this.estadoSalvar == 'post')
      ? {...this.form.value}
      : {id: this.evento.id, ...this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe({
        next: (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);

        },
        error: (error: any) => {
          this.toastr.error('Erro ao salvar evento!', 'Erro!');
          console.error(error);
        }
      }).add(() => this.spinner.hide());
    }
  }

  // Lotes

  public get modoEditar(): boolean {
    return this.estadoSalvar == 'put'
  }

  public get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  public adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  public criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id:[lote.id],
      nome:[lote.nome, Validators.required],
      quantidade:[lote.quantidade, Validators.required],
      preco:[lote.preco, Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  public salvarLotes(): void {

    if(this.form.controls['lotes'].valid){
      this.spinner.show();

      this.loteService.saveLotes(this.eventoId, this.form.value.lotes).subscribe({
        next: () => {
          this.toastr.success('Lotes salvo com sucesso!','Sucesso');
        },
        error: (error: any) => {
          this.toastr.error('Erro ao salvar lotes!','Erro');
          console.error(error);
        }
      }).add(() => this.spinner.hide());
    }
  }

  public removerLote(template:TemplateRef<any>, indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id')!.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')!.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm' });

  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe({
      next: () => {
        this.toastr.success('Lote deletado com sucesso!', 'Sucesso')
        this.lotes.removeAt(this.loteAtual.indice);
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}`, 'Erro');
        console.error(error);
      }

    }).add(() => this.spinner.hide());

  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  public retornaTituloLote(nome: string): string {
    return nome == null || nome == '' ? 'Nome do lote' : nome
  }

  public onFileChange(img: any): void {
    const reader = new FileReader();

    this.file = img.target.files;
    reader.readAsDataURL(this.file[0]);

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.uploadImagem();
  }

  public uploadImagem() : void {
    this.spinner.show();

    this.eventoService.postUpload(this.eventoId, this.file).subscribe({
      next: () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com sucesso!','Sucesso');
      },
      error: (error: any) => {
        this.toastr.error('Erro ao fazer upload de imagem!', 'Erro');
        console.error(error);
      }

    }).add(() => this.spinner.hide());

  }

}
