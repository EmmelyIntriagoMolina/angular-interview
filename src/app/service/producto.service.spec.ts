import { TestBed } from '@angular/core/testing';
import { ProductoService } from './producto.service';
import { HttpClientModule } from '@angular/common/http';
import { IProducto } from '../models/producto.interface';


describe('ProductoService', () => {
  let service: ProductoService;
  let producto: IProducto = {
    id: 'id-dos',
    name: 'Producto Prueba',
    description: 'Este es un producto registrado desde pruebas unitarias',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/affluent/platinum-card.jpg',
    date_release: new Date(),
    date_revision: new Date()
  }
  let IProducto: IProducto

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ProductoService);
  });
  
  test('should be created', () => {
    expect(service).toBeTruthy()
  })
  
  test('Obtener listado de productos', (done) => {
    service.WSobtenerListadoProductos()
      .subscribe(respuesta => {
        expect(respuesta).toMatchObject<IProducto[]>
        done();
      })
  })

  test('Verificar ID de producto', (done) => {
    service.WSverificarIDProducto('id-uno')
      .subscribe(respuesta => {
        expect(respuesta).toBe(true);
        done();
      })
  })

  test('Agregar producto duplicado', () => {
    service.WSregistrarProducto(producto)
      .subscribe(respuesta => {
        console.log(respuesta.message, 'respuesta')
        expect(respuesta.error?.message).toBe('Duplicate identifier found in the database');
      })
  })
});
