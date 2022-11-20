import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //importando
import { HttpClientModule } from '@angular/common/http'; //importando
import { FormsModule } from '@angular/forms'; //importando

import { CollapseModule } from 'ngx-bootstrap/collapse'; //importado
import { TooltipModule } from 'ngx-bootstrap/tooltip'; //importado
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; //importado
import { ModalModule } from 'ngx-bootstrap/modal'; //importado
import { ToastrModule } from 'ngx-toastr'; //importado
import { NgxSpinnerModule } from "ngx-spinner"; //importado

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContatosComponent } from './componentes/contatos/contatos.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { EventosComponent } from './componentes/eventos/eventos.component';
import { PalestrantesComponent } from './componentes/palestrantes/palestrantes.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';

import { EventoService } from './services/evento.service';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';//importado



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

   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, //importando para fazer requisições no backEnd
    BrowserAnimationsModule, //importando para o funcionamento do ngxBootstrap
    FormsModule, //importado para utilizar Two-way Data Binding
    CollapseModule.forRoot(), //importado para utilizar Toggle collapse no component nav
    TooltipModule.forRoot(), //importado para utilizar TooltipModule
    BsDropdownModule.forRoot(), //importado para utilizar BsDropdownModule - forRoot caso precise passar algum parâmetro
    ModalModule.forRoot(), //importado para utilizar ModalModule
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
    }), //importado para mostrar alertas em nossos componentes
    NgxSpinnerModule,
  ],
  providers: [EventoService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
