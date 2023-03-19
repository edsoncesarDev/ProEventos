import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RedeSocial } from 'src/app/models/RedeSocial';
import { RedeSocialService } from 'src/app/services/rede-social.service';

@Component({
  selector: 'app-redes-sociais',
  templateUrl: './redes-sociais.component.html',
  styleUrls: ['./redes-sociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {

  public modalRef!: BsModalRef;
  @Input() eventoId: number = 0;
  public formRS!: FormGroup;
  public redeSocialAtual = {id: 0, nome: '', indice: 0};

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private redeSocialService: RedeSocialService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.carregaRedesSociais(this.eventoId);
    this.validation();
  }

  public carregaRedesSociais(id: number = 0): void {

    let origem = 'palestrante';

    if(this.eventoId != 0) origem = 'evento';

    this.spinner.show();

    this.redeSocialService.getRedesSociais(origem, id).subscribe({
      next: (redeSocialRetorno: RedeSocial[]) => {
        debugger
        redeSocialRetorno.forEach((redeSocial) => {
          this.redesSociais.push(this.criarRedeSocial(redeSocial));
        })
      },
      error: (error: any) => {
        this.toastr.error('Erro ao tentar carregar Rede Social','Erro');
        console.error(error);
      }

    }).add(() => this.spinner.hide());
  }

  public validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([])
    })
  }

  public adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({id: 0} as RedeSocial))
  }

  public criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  public retornaTitulo(nome: string): string {
    return nome === null || nome === '' ? 'Rede Social' : nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarRedesSociais(): void {

    let origem = 'palestrante';

    if(this.eventoId !== 0) origem = 'evento';

    if(this.formRS.controls['redesSociais'].valid) {
      this.spinner.show();
      this.redeSocialService
          .saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais)
          .subscribe({
            next: () => {
              this.toastr.success('Redes Sociais foram salvas com Sucesso!', 'Sucesso');
            },
            error: (error: any) => {
              this.toastr.error('Erro ao tentar salvar Redes Sociais!', 'Erro');
              console.error(error);
            }
          }).add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>, indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id')!.value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome')!.value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirmDeleteRedeSocial(): void {
    let origem = 'palestrante';
    this.modalRef.hide();
    this.spinner.show();

    if(this.eventoId !== 0) origem = 'evento';

    this.redeSocialService
        .deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id)
        .subscribe({
          next: () => {
            this.toastr.success('Rede Social deletado com sucesso!', 'Sucesso');
            this.redesSociais.removeAt(this.redeSocialAtual.indice);
          },
          error: (error: any) => {
            this.toastr.error(`Erro ao tentar deletar a Rede Social ${this.redeSocialAtual.nome}`, 'Erro');
            console.error(error);
          }

        }).add(() => this.spinner.hide());
  }

  public declineDeleteRedeSocial(): void {
    this.modalRef.hide();
  }
}
