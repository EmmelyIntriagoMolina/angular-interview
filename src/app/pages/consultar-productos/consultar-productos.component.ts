import { 
  Component, 
  EventEmitter, 
  OnInit, 
  Output, 
  ViewChild 
} from '@angular/core';
import { ProductoService } from '../../service/producto.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IProducto, IResponseProduct } from '../../models/producto.interface';
import { 
  MatTableDataSource, 
  MatTableModule
} from '@angular/material/table';
import { 
  MatPaginator, 
  MatPaginatorModule, 
  PageEvent
} from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule} from '@angular/material/menu';
import { RouterLink, Router } from '@angular/router';
import { 
  MatSort, 
  MatSortModule 
} from '@angular/material/sort';
import { catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import jQuery from 'jquery';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import moment from 'moment';

@Component({
  selector: 'app-consultar-productos',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatDividerModule,
  ],
  providers: [],
  templateUrl: './consultar-productos.component.html',
  styleUrl: './consultar-productos.component.scss'
})
export class ConsultarProductosComponent implements OnInit {
  constructor (
    private _ProductoService: ProductoService,
    private _router: Router 
  ){}
  listadoProductos: IProducto[] = []
  columnasListadoProductos = ['logo', 'name', 'description', 'date_release', 'date_revision', 'action']
  dataSource: any
  currentPage: number = 1
  length: number = 0
  pageEvent: PageEvent
  pageSize: number = 10
  pageIndex: number = 1
  productoSeleccionado: IProducto = {
    id:             '',
    name:           '',
    description:    '',
    logo:           '',
    date_release:   new Date(),
    date_revision:  new Date(),
  }
  formularioProducto: FormGroup
  
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  ngOnInit(){
    this.obtenerListadoProductos()
  }
  
  obtenerListadoProductos(){
    this._ProductoService
    .WSobtenerListadoProductos()
    .pipe(
      map((productos) => {
        this.listadoProductos = productos
        this.inicializarDataSource(productos)
      }),
      catchError((error: HttpErrorResponse) => 
        throwError(() => {
          error.status == 404
          ? Swal.fire(`${error.status}`, error.statusText, 'error')
          : error.status == 400
            ? Swal.fire(`${error.status}`, error.error.message, 'error') : ''
        }
      ))
    )
    .subscribe()
  }
  inicializarDataSource(datos: IProducto[]){
    this.dataSource = new MatTableDataSource<IProducto>(datos)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
  filtrarDatos(filtro: Event){
    const value = (filtro.target as HTMLInputElement).value
    this.dataSource.filter = value
  }
  eliminarProducto(idProducto: string){
    this._ProductoService
    .WSeliminarProductoID(idProducto)
    .pipe(
      map(async(response: IResponseProduct) => {
        await Swal.fire('¡Correct!', response.message, 'success')
        this.obtenerListadoProductos()
        $('#eliminarProductoModal').click()
      }),
      catchError((error: HttpErrorResponse) => 
        throwError(() => {
          error.status == 404
          ? Swal.fire(`${error.status}`, error.statusText, 'error')
          : error.status == 400
            ? Swal.fire(`${error.status}`, error.error.message, 'error') : ''
        }
      ))
    )
    .subscribe()
  }
  obtenerProductoID(idProducto: string){
    this._ProductoService
    .WSobtenerProductoID(idProducto)
    .pipe(
      map((producto: IProducto) => {
        this.formularioProducto.setValue({
          id: producto.id,
          name: producto.name,
          description: producto.description,
          logo: producto.logo,
          date_release: producto.date_release,
          date_revision: producto.date_revision
        })
        console.log(this.formularioProducto, 'formulario producto')
      }),
      catchError((error: HttpErrorResponse) => 
        throwError(() => {
          error.status == 404
          ? Swal.fire(`${error.status}`, error.statusText, 'error')
          : error.status == 400
            ? Swal.fire(`${error.status}`, error.error.message, 'error') : ''
        }
      ))
    )
    .subscribe()
  }
}
