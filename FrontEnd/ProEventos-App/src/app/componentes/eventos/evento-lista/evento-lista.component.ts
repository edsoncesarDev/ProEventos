import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import { Evento } from 'src/app/models/Evento';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;
  public eventos: Evento[] = [];
  public eventoId:  number = 0;
  public pagination = {} as Pagination;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public showImg: boolean = true;

  public termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if(this.termoBuscaChanged.observers.length == 0){

      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor

          ).subscribe({
            next: (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result!;
              this.pagination = paginatedResult.pagination;
            },
            error: () => {
              this.toastr.error('Erro ao carregar os Eventos', 'Erro!');
            }
          }).add(() => this.spinner.hide());
        }
      )
    }
    this.termoBuscaChanged.next(evt.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  public ngOnInit(): void {

    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 1} as Pagination;
    this.carregarEventos()

  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService.getEventos(this.pagination.currentPage,
                                  this.pagination.itemsPerPage).subscribe({

      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result!;
        this.pagination = paginatedResult.pagination;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar eventos.','Erro!')
      }

    }).add(() => this.spinner.hide());

  }

  public openModal(event: any, template: TemplateRef<any>, eventoId: number): void{
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        if(result.message == 'Evento deletado'){
          this.toastr.success('Evento deletado com sucesso.', 'Deletado!');
          this.carregarEventos();
        }
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}.`,'Erro!');
        console.error(error);
      }

    }).add(() => this.spinner.hide());

  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public mostraImagem(imagemURL: string): string {
    return (imagemURL != '')
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/semImagem.jpg';
  }

}
