import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //importando BrowserAnimationsModule

import { HttpClientModule } from '@angular/common/http' //importando HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, //importando HttpClientModule
    BrowserAnimationsModule //importando BrowserAnimationsModule para o funcionamento do ngxBootstrap
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
