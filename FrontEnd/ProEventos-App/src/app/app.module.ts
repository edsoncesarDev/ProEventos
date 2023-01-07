import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //importando
import { HttpClientModule } from '@angular/common/http'; //importando
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //importando

import { CollapseModule } from 'ngx-bootstrap/collapse'; //importado
import { TooltipModule } from 'ngx-bootstrap/tooltip'; //importado
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; //importado
import { ModalModule } from 'ngx-bootstrap/modal'; //importado
import { ToastrModule } from 'ngx-toastr'; //importado
import { NgxSpinnerModule } from "ngx-spinner"; //importado

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; //importado
import { defineLocale } from 'ngx-bootstrap/chronos'; //importado
import { ptBrLocale } from 'ngx-bootstrap/locale'; //importado

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContatosComponent } from './componentes/contatos/contatos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { EventosComponent } from './componentes/eventos/eventos.component';
import { PalestrantesComponent } from './componentes/palestrantes/palestrantes.component';
import { PerfilComponent } from './componentes/user/perfil/perfil.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { EventoDetalheComponent } from './componentes/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './componentes/eventos/evento-lista/evento-lista.component';
import { UserComponent } from './componentes/user/user.component';
import { LoginComponent } from './componentes/user/login/login.component';
import { RegistrationComponent } from './componentes/user/registration/registration.component';

import { EventoService } from './services/evento.service';
import { LoteService } from './services/lote.service';

 //importado
import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';



defineLocale('pt-br', ptBrLocale); //importado - definindo datePicker como BR


@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent,
    TituloComponent,
    ContatosComponent,
    DashboardComponent,
    PerfilComponent,
    TituloComponent,
    DateTimeFormatPipe, //declarando pipe criado para datas
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,

   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, //importando para fazer requisições no backEnd
    BrowserAnimationsModule, //importando para o funcionamento do ngxBootstrap
    FormsModule, //importado para utilizar Two-way Data Binding
    ReactiveFormsModule, //importando para realizar as validações dos inputs
    CollapseModule.forRoot(), //importado para utilizar Toggle collapse no component nav
    TooltipModule.forRoot(), //importado para utilizar TooltipModule
    BsDropdownModule.forRoot(), //importado para utilizar BsDropdownModule - forRoot caso precise passar algum parâmetro
    ModalModule.forRoot(), //importado para utilizar ModalModule
    BsDatepickerModule.forRoot(), //importado para funcionalidades de datas
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }), //importado para mostrar alertas em nossos componentes
    NgxSpinnerModule,
  ],
  providers: [
    EventoService,
    LoteService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
