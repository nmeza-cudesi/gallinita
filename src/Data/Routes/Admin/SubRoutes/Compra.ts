import { IRoute } from "../../../../Model/Routing";
import {
    ListarProveedorGuard,
    RegistrarCompraGuard
} from "../../../Guards/Compra";
import {
    ListarProveedor,
    RegistrarCompra
} from '../../../../Admin/Views/Compra';

export const CompraRoutes: IRoute[] = [
    {
        name: 'Compras',
        guard: RegistrarCompraGuard,
        path: '/registrar-compra',
        component: RegistrarCompra,
    },
    {
        name: 'Listar Proveedor',
        guard: ListarProveedorGuard,
        path: '/listar-proveedor',
        component: ListarProveedor,
    },
]