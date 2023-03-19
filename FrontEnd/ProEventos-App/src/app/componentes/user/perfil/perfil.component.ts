import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from 'src/app/models/Identity/UserUpdate';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public usuario: UserUpdate = {} as UserUpdate;

  public imagemURL: string = '';
  public file!: File;

  public get ehPalestrante(): boolean {
    return this.usuario.funcao == 'Palestrante';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if(this.usuario.imagemURL)
      this.imagemURL = environment.apiURL + `resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = 'assets/perfil.png';
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe({
      next: () => {
        this.toastr.success('Imagem atualizada com sucesso','Sucesso!')
      },
      error: (error: any) => {
        this.toastr.error('Erro ao fazer upload de imagem','Erro!');
        console.error(error);
      }
    }).add(() => this.spinner.hide());
  }
}
