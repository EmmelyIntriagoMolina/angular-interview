import { Routes } from '@angular/router';
import { ConsultarProductosComponent } from './pages/consultar-productos/consultar-productos.component';
import { RegistrarProductoComponent } from './pages/registrar-producto/registrar-producto.component';

export const routes: Routes = [
    {
        path: '',
        component: ConsultarProductosComponent,
    },
    {
        path: 'registrar-producto',
        component: RegistrarProductoComponent,
    },
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    }
];
