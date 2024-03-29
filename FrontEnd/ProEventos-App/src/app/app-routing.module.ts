import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { PalestrantesComponent } from './componentes/palestrantes/palestrantes.component';

import { EventosComponent } from './componentes/eventos/eventos.component';
import { EventoDetalheComponent } from './componentes/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './componentes/eventos/evento-lista/evento-lista.component';

import { UserComponent } from './componentes/user/user.component';
import { LoginComponent } from './componentes/user/login/login.component';
import { RegistrationComponent } from './componentes/user/registration/registration.component';
import { PerfilComponent } from './componentes/user/perfil/perfil.component';

import { ContatosComponent } from './componentes/contatos/contatos.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './componentes/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil'},
      {
        path: 'user/perfil', component: PerfilComponent
      },
      { path: 'eventos', redirectTo: 'eventos/lista'},
      {
        path: 'eventos', component: EventosComponent,
        children: [
          { path: 'detalhe/:id', component: EventoDetalheComponent},
          { path: 'detalhe', component: EventoDetalheComponent},
          { path: 'lista', component: EventoListaComponent},
        ],
      },
      {path: 'dashboard', component: DashboardComponent},
      {path: 'palestrantes', component: PalestrantesComponent},
      {path: 'contatos', component: ContatosComponent},
    ]
  },
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},
    ]
  },
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
