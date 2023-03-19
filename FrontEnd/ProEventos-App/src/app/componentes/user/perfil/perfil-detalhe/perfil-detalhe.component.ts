import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { UserUpdate } from 'src/app/models/Identity/UserUpdate';
import { AccountService } from 'src/app/services/account.service';
import { PalestanteService } from 'src/app/services/palestante.service';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  @Output() changeFormValue = new EventEmitter();

  public userUpdate: UserUpdate = {} as UserUpdate;

  public form!: FormGroup;

  public get f(): any{
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private palestrante: PalestanteService
  ) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges.subscribe(
      () => {
        this.changeFormValue.emit({...this.form.value})
      }
    )
  }

  private carregarUsuario(): void {

    this.spinner.show();

    this.accountService.getUser().subscribe({
      next:(userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário carregado', 'Sucesso');

      },
      error:(error: any) => {
        console.error(error.error);
        this.toastr.error('Usuário não carregado', 'Erro');
        this.router.navigate(['/dashboard']);

      }
    }).add(() => this.spinner.hide());
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      userName: [''],
      imagemURL: [''],
      titulo: ['NaoInformado', [Validators.required]],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      funcao: ['NaoInformado', [Validators.required]],
      descricao: ['', [Validators.required]],
      password: ['', [Validators.nullValidator, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.nullValidator]],
    }, formOptions);
  }

  onSubmit(): void {
    this.atualizarUsuario();

  }

  public atualizarUsuario(): void {
    this.userUpdate = {...this.form.value};
    this.spinner.show();

    if(this.userUpdate.funcao == 'Palestrante'){
      this.palestrante.post().subscribe({
        next: () => {
          this.toastr.success('Função palestrante ativada!','Sucesso!');
        },
        error: (error: any) => {
          this.toastr.error('A função palestrante não pode ser ativada!','Erro!');
          console.error(error);
        }
      })
    }

    this.accountService.updateUser(this.userUpdate).subscribe({
      next: () => {
        this.toastr.success('Usuário atualizado!', 'Sucesso');
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(error.error);
      }
    }).add(() => this.spinner.hide());


  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }
}
