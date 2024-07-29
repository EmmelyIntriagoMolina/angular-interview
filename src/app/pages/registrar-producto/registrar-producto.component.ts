import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { 
  RouterLink,
  Router
} from '@angular/router';
import { 
  FormBuilder, 
  ReactiveFormsModule,
  FormsModule,
  Validators, 
  FormGroup
} from '@angular/forms';
import moment from 'moment';
import { ProductoService } from '../../service/producto.service';
import { 
  catchError, 
  map, 
  throwError 
} from 'rxjs';
import Swal from 'sweetalert2';
import { ValidatorsPersonalizados } from '../../helper/validators-personalizados';
import { IProducto, IResponseProduct } from '../../models/producto.interface';

@Component({
  selector: 'app-registrar-producto',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
    MatGridListModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './registrar-producto.component.html',
  styleUrl: './registrar-producto.component.scss'
})
export class RegistrarProductoComponent implements OnInit {

  formularioProducto: FormGroup
  constructor(
    private readonly _builder: FormBuilder,
    private readonly _ProductoService: ProductoService,
    private readonly _router: Router,
  ) {}
  ngOnInit() {
    this.iniciarFormulario()
  }
  
  iniciarFormulario(){
    this.formularioProducto = this._builder.group({
      id: ['', 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ]
      ],
      name: ['',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      description: [ '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],
      logo: [
        '', Validators.required
      ],
      date_release: [
        moment().format("YYYY-MM-DD"), 
        Validators.required
      ],
      date_revision: [
        moment().add(1, 'year').format("YYYY-MM-DD"), 
        Validators.required,
      ],
    }, {
      validators: ValidatorsPersonalizados.dateReleaseValidate(
        'date_release'
      )
    })
  }
  registrarProducto(){
    this._ProductoService
    .WSregistrarProducto(
      this.formularioProducto.value
    ).pipe(
      map(async(response: IResponseProduct) => {
        await Swal.fire('¡Correct!', response.message, 'success')
        this._router.navigateByUrl("/");
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
  initDateRevision(){
    const date_revision = moment(this.formularioProducto.value.date_release).add(1, 'year').format("YYYY-MM-DD")
    this.formularioProducto.patchValue({date_revision: date_revision})
    return this.formularioProducto
  }
  reiniciarFormulario(){
    this.formularioProducto.reset()
    this.iniciarFormulario()
  }
  verificarIDProducto(formulario: FormGroup){
    this._ProductoService
    .WSverificarIDProducto(
      formulario.value.id
    )
    .pipe(
      map((estado: boolean) => {
        if (estado) {
          Swal.fire(
            'Oops!', 
            'Ya existe un producto registrado con el ID que intentas registrar', 
            'warning'
          )
          formulario.patchValue({id: ''})
        }
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
  verificarDatoValido(
    dato: string, 
    formulario: FormGroup
  ): boolean | null{
    return formulario.controls[dato].errors 
    && formulario.controls[dato].touched
  }
  obtenerError(
    dato: string, 
    formulario: FormGroup
  ): string | null {
    if (!formulario.controls[dato] ) return null
    const errors = formulario.controls[dato].errors || {}
    for (const key of Object.keys(errors)) {
      switch(key){
        case 'required':
          return 'Este campo es requerido'
        case 'minlength':
          return "No cumple el mínimo de caracteres"  
        case 'maxLength':
          return "Excede el límite de caracteres"  
        default:
          return null
      }
    }
    return null
  }
  actualizarProductoID(formulario: FormGroup){
    this._ProductoService
    .WSactualizarProducto(
      formulario.value.id,
      formulario.value
    ).pipe(
      map(async(response: IResponseProduct) => {
        await Swal.fire('¡Correct!', response.message, 'success')
        this._router.navigateByUrl("/");
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
