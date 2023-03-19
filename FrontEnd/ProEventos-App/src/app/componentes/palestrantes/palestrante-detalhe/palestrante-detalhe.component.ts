import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounce, debounceTime, map, tap } from 'rxjs';
import { Palestrante } from 'src/app/models/Palestrante';
import { PalestanteService } from 'src/app/services/palestante.service';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public form!: FormGroup;
  public situacaoDoForm: string = '';
  public corDaDescricao: string = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService: PalestanteService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  public validation(): void {
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }

  public get f(): any {
    return this.form.controls;
  }

  private verificaForm(): void {
    this.form.valueChanges.pipe(
      map(() => {
        this.situacaoDoForm = 'Minicurrículo está sendo atualizado!';
        this.corDaDescricao = 'text-warning';
      }),
      debounceTime(1000),
      tap(() => this.spinner.show())

    ).subscribe(
      () => {
        this.palestranteService
        .put({...this.form.value})
        .subscribe({
          next: () => {
            this.situacaoDoForm = 'Minicurrículo foi atualizado!'
            this.corDaDescricao = 'text-success';

            setTimeout(() => {
              this.situacaoDoForm = 'Minicurrículo foi carregado!'
              this.corDaDescricao = 'text-muted';
            }, 2000)
          },
          error:() => {
            this.toastr.error('Erro ao tentar atualizar palestrante','Erro');
          }

        }).add(() => this.spinner.hide())
      }
    )
  }

  private carregarPalestrante(): void {
    this.spinner.show();

    this.palestranteService
    .getPalestrante()
    .subscribe({
      next: (palestrante: Palestrante) => {
        this.form.patchValue(palestrante);
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar palestrante','Erro');
      }

    }).add(() => this.spinner.hide())
  }
}
