import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //importando

import { HttpClientModule } from '@angular/common/http' //importando

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { NavComponent } from './nav/nav.component';

import { CollapseModule } from 'ngx-bootstrap/collapse'; // importado

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, //importando para fazer requisições no backEnd
    BrowserAnimationsModule, //importando para o funcionamento do ngxBootstrap
    CollapseModule.forRoot() //importado para utilizar Toggle collapse no component nav
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
