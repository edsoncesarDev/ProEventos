import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxCurrencyModule } from 'ngx-currency';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContatosComponent } from './componentes/contatos/contatos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { EventosComponent } from './componentes/eventos/eventos.component';
import { PalestrantesComponent } from './componentes/palestrantes/palestrantes.component';
import { PalestranteDetalheComponent } from './componentes/palestrantes/palestrante-detalhe/palestrante-detalhe.component';
import { PalestranteListaComponent } from './componentes/palestrantes/palestrante-lista/palestrante-lista.component';
import { PerfilComponent } from './componentes/user/perfil/perfil.component';
import { PerfilDetalheComponent } from './componentes/user/perfil/perfil-detalhe/perfil-detalhe.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';
import { EventoDetalheComponent } from './componentes/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './componentes/eventos/evento-lista/evento-lista.component';
import { UserComponent } from './componentes/user/user.component';
import { LoginComponent } from './componentes/user/login/login.component';
import { RegistrationComponent } from './componentes/user/registration/registration.component';
import { HomeComponent } from './componentes/home/home.component';
import { RedesSociaisComponent } from './componentes/redes-sociais/redes-sociais.component';

import { AccountService } from './services/account.service';
import { EventoService } from './services/evento.service';
import { LoteService } from './services/lote.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';

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
    PerfilDetalheComponent,
    TituloComponent,
    DateTimeFormatPipe, //declarando pipe criado para datas
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    PalestranteListaComponent,
    PalestranteDetalheComponent,
    RedesSociaisComponent,


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
    BsDatepickerModule.forRoot(), //importado para a funcionalidades de datas
    PaginationModule.forRoot(), //importado para a funcionalidade de paginação
    TabsModule.forRoot(), //importado para criar tabs dinâmicas
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }), //importado para mostrar alertas em nossos componentes
    NgxSpinnerModule,
    NgxCurrencyModule
  ],
  providers: [
    AccountService,
    EventoService,
    LoteService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
