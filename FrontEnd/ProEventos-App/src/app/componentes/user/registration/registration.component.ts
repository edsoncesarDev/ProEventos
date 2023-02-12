import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { User } from 'src/app/models/Identity/User';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public user: User = {} as User;

  public form!: FormGroup;
  public get f(): any{
    return this.form.controls;
  }
  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      userName: ['',[Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]

    }, formOptions);
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public register(): void {
    this.user = { ...this.form.value};
    this.accountService.register(this.user).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(error.error);
      }
    })
  }
}
