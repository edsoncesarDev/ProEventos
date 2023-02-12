import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/models/Identity/UserLogin';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public model: UserLogin = {} as UserLogin;

  constructor(private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void { }

  public login(): void{
    this.spinner.show();
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error:(error: any) => {
        if(error.status == 401) this.toastr.error('Usuário ou senha inválida', 'Erro');
        else console.error(error);
      }
    }).add(() => this.spinner.hide());
  }
}
