import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducto, IResponseProduct } from '../models/producto.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  BASE_URL = 'http://localhost:3002/bp/products'
  headers = new HttpHeaders().set('Content-Type', 'application/json')
  options = { headers: this.headers }

  constructor(
    public _http: HttpClient
  ) { }

  WSobtenerListadoProductos(): Observable<IProducto[]>
  {
    return this._http
    .get<IProducto[]>(`${this.BASE_URL}`)
  }
  WSverificarIDProducto(idProducto: string): Observable<boolean>
  {
    return this._http
    .get<boolean>(`${this.BASE_URL}/verification/${idProducto}`)
  }
  WSregistrarProducto(data: IProducto): Observable<IResponseProduct>
  {
    return this._http
    .post<IResponseProduct>(`${this.BASE_URL}`, data, this.options)
  }
  WSobtenerProductoID(idProducto: string): Observable<IProducto>
  {
    return this._http
    .get<IProducto>(`${this.BASE_URL}/${idProducto}`)
  }
  WSeliminarProductoID(idProducto: string): Observable<IResponseProduct>{
    return this._http
    .delete<IResponseProduct>(`${this.BASE_URL}/${idProducto}`)
  }
  WSactualizarProducto(idProducto: string, data: IProducto): Observable<IResponseProduct>{
    return this._http
    .put<IResponseProduct>(`${this.BASE_URL}/${idProducto}`, data, this.options)
  }
}
