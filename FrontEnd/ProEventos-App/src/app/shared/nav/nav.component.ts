import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isCollapsed = true;

  constructor(public accountService: AccountService,
              private router: Router) { }

  ngOnInit(): void{
  }

  public logout(): void{
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  public showMenu(): boolean{
    return this.router.url != '/user/login';
  }
}
