import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeftMenu from "@/components/LeftMenu";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useReducer } from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import UserMenusContext from "@/Context/UserMenusContext";
import { getEnterpriseData } from "@/utils";
import { lazy, Suspense } from 'react';
import LoadingDiv from "@/components/LoadingDiv";
import '../../sass/TablesComponent/_tablesStyle.scss'
import "../../sass/TablesComponent/_tableEditDropStyle.scss";
import "../../sass/Select/_virtualizedSelect.scss";
import "../../sass/_scrollableContentStyle.scss";

const routes = [
    {
        path: "/",
        import: lazy(() => import('./Dashboard'))
    },
    {
        path: 'dashboard',  
        import: lazy(() => import("./Dashboard"))
    },
    {
        path: 'menus',
        import: lazy(() => import("./Admin/Catalogs/Menus/Menus"))
    },
    {
        path: 'roles',
        import: lazy(() => import("./Admin/Catalogs/Roles"))
    },
    {
        path: 'usuarios',
        import: lazy(() => import("./Admin/Catalogs/Usuarios"))
    },
    {
        path: 'bancos',
        import: lazy(() => import("./Admin/Catalogs/Bancos/Bancos"))
    },
    {
        path: 'cat-sat-pais',
        import: lazy(() => import("./Admin/Catalogs/SAT/Pais/Pais"))
    },
    {
        path: 'metodos-de-pago',
        import: lazy(() => import("./Admin/Catalogs/Sat/MetodosDePago/MetodosDePago"))
    },
    {
        path: 'estados',
        import: lazy(() => import("./Admin/Catalogs/SAT/Estados/Estados"))
    },
    {
        path: 'cat-sat-impuesto',
        import: lazy(() => import("./Admin/Catalogs/SAT/Impuesto/Impuesto"))
    },
    {
        path: 'conceptos-productos',
        import: lazy(() => import("./Admin/Catalogs/SAT/ConceptosProductos/ConceptosProductos"))
    },
    {
        path: 'tipo-cliente',
        import: lazy(() => import("./Admin/Catalogs/TipoCliente/TipoCliente"))
    },
    {
        path: 'pre-corte',
        import: lazy(() => import("./Admin/Pre-Corte/PreCorte"))
    },
    {
        path: 'moneda',
        import: lazy(() => import("./Admin/Catalogs/Sat/Moneda/Moneda"))
    },
    {
        path: 'regimen',
        import: lazy(() => import("./Admin/Catalogs/SAT/RegimenFiscal/RegimenFiscal"))
    },
    {
        path: 'estacion',
        import: lazy(() => import("./Admin/Catalogs/Estacion/Estacion"))
    },
    {
        path: 'red',
        import: lazy(() => import("./Admin/Catalogs/Red/Red"))
    },
    {
        path: 'folios',
        import: lazy(() => import("./Admin/Catalogs/Folios/Folios"))
    },
    {
        path: 'carteras',
        import: lazy(() => import("./Admin/Catalogs/TipoCartera/TipoCartera"))
    },
    {
        path: 'autorizacion-credito-descuento',
        import: lazy(() => import("./Admin/Catalogs/Clientes/AutorizacionCreditoDescuento/AutorizacionCreditoDescuento"))
    },
    {
        path: 'rutas',
        import: lazy(() => import("./Admin/Catalogs/Ruta/Ruta"))
    }, 
    {
        path: 'zona',
        import: lazy(() => import("./Admin/Catalogs/Zona/Zona"))
    },
    {
        path: 'empresas',
        import: lazy(() => import("./Admin/Catalogs/Empresas/Empresas"))
    },
    {
        path: 'tipo-captacion',
        import: lazy(() => import("./Admin/Catalogs/TipoCaptacion/TipoCaptacion"))
    },
    {
        path: 'tipo-servicio',
        import: lazy(() => import("./Admin/Catalogs/TipoServicio/TipoServicio"))
    },
    {
        path: 'cat-sat-cfdi',
        import: lazy(() => import("./Admin/Catalogs/SAT/CFDI/CFDI"))
    },
    {
        path: 'clave-Sat',
        import: lazy(() => import("./Admin/Catalogs/SAT/ClaveSatMostrar/ClaveSat"))
    },
    {
        path: 'turno',
        import: lazy(() => import("./Admin/Catalogs/Turno/Turno"))
    },
    {
        path: 'punto-recorrido',
        import: lazy(() => import("./Admin/Catalogs/Punto-Recorrido/PuntoRecorrido"))
    },
    {
        path: 'Cedis',
        import: lazy(() => import("./Admin/Catalogs/Cedis/Cedis"))
    },
    {
        path: 'clientes',
        import: lazy(() => import("./Admin/Catalogs/Clientes/Clientes"))
    },
    {
        path: 'isrs',
        import: lazy(() => import("./Admin/RH/ISR"))
    },
    {
        path: 'puesto',
        import: lazy(() => import("./Admin/Catalogs/Puesto/Puesto"))
    },
    {
        path: 'departamento',
        import: lazy(() => import("./Admin/Catalogs/Departamento/Departamento"))
    },
    {
        path: 'areas-funcionales',
        import: lazy(() => import("./Admin/Catalogs/AreasFuncionales/AreasFuncionales"))
    },
    {
        path: 'puntorondin',
        import: lazy(() => import("./Admin/Catalogs/PuntoRondin/PuntoRondin"))
    },
    {
        path: 'facturaciones',
        import: lazy(() => import("./Admin/Facturacion/FacturacionProducto"))
    },
    {
        path: 'Facturaciondiversos',
        import: lazy(() => import("./Admin/Facturacion/FacturacionDiversas"))
    },
    {
        path: 'unidadmedida',
        import: lazy(() => import("./Admin/Catalogs/UnidadMedida/UnidadMedida"))
    },
    {
        path: 'unidades',
        import: lazy(() => import("./Admin/Catalogs/Unidades/Unidades"))
    },
    {
        path: 'relacionsat',
        import: lazy(() => import("./Admin/Catalogs/SAT/TipoRelacionSAT/TipoRelacionSAT"))
    },
    {
        path: 'recorrido',
        import: lazy(() => import("./Admin/Catalogs/Recorrido/Recorrido"))
    },
    {
        path: 'municipios',
        import: lazy(() => import("./Admin/Catalogs/SAT/Municipio/Municipio"))
    },
    {
        path: 'centro-costos',
        import: lazy(() => import("./Admin/Catalogs/Centro_Costo/Centro_Costo"))
    },
    {
        path: 'asuntos',
        import: lazy(() => import("./Admin/Catalogs/Asunto/Asunto"))
    },
    {
        path: 'correo-notificaciones',
        import: lazy(() => import("./Admin/Catalogs/CorreoNotificaciones/CorreoNotificaciones"))
    },
    {
        path: 'Colonias',
        import: lazy(() => import("./Admin/Catalogs/SAT/Colonias/Colonias"))
    },
    {
        path: 'vendedor-puesto',
        import: lazy(() => import("./Admin/Catalogs/VendedorPuesto/Vendedor-P"))
    },
    {
        path: 'productos',
        import: lazy(() => import("./Admin/Catalogs/Productos/Productos"))
    },
    {
        path: 'personas',
        import: lazy(() => import("./Admin/Catalogs/Personas/Personas"))
    },
    {
        path: 'formas-de-pago-sat',
        import: lazy(() => import("./Admin/Catalogs/SAT/FormasPago/FormasPago"))
    },
    {
        path: 'quien-con-quien',
        import: lazy(() => import("./Admin/Ventas/QuienConQuien2"))
    },
    {
        path: 'colonias-rutas',
        import: lazy(() => import("./Admin/Catalogs/ColoniasRutas/ColoniasRutas"))
    },
    {
        path: 'densidades',
        import: lazy(() => import("./Admin/Catalogs/Prueba/Densidades"))
    },
    {
        path: 'serv-tec-soluciones',
        import: lazy(() => import("./Admin/Telermark/ServTecSoluciones/ServTecSoluciones"))
    },
    {
        path: 'tipo-de-documentacion',
        import: lazy(() => import("./Admin/RH/TipoDocumentacion/TipoDocumentacion"))
    },
    {
        path: 'periodicidad',
        import: lazy(() => import("./Admin/RH/Periodicidad/Periodicidad"))
    },
    {
        path: 'documentacion',
        import: lazy(() => import("./Admin/RH/Documentacion/Documentacion"))
    },
    {
        path: 'pregunta-encuesta',
        import: lazy(() => import("./Admin/Telermark/PreguntaEncuesta/PreguntaEncuesta"))
    },
    {
        path: 'clientes-pedidos',
        import: lazy(() => import("./Admin/Telermark/ClientesPedidos/ClientesPedidos"))
    },
    {
        path: 'direccion_pedidos',
        import: lazy(() => import("./Admin/Telermark/DireccionPedidos/DireccionPedidos"))
    },
    {
        path: 'origen-pedido',
        import: lazy(() => import("./Admin/Telermark/OrigenPedido"))
    },
    {
        path: 'sTecnico',
        import: lazy(() => import("./Admin/Telermark/sTecnico/STecnico"))
    },
    {
        path: 'vespxmat',
        import: lazy(() => import("./Admin/Telermark/Vespxmat/Vespxmat"))
    },
    {
        path: 'buscar-cliente',
        import: lazy(() => import("./Admin/Telermark/BuscarCliente/BuscarCliente"))
    },
    {
        path: 'motivos-cancelacion',
        import: lazy(() => import("./Admin/Telermark/MotivoCancelacion/MotivosCancelacion"))
    },
    {
        path: 'prospeccion',
        import: lazy(() => import("./Admin/Telermark/prospeccion/Prospeccion"))
    },
    {
        path: 'motivos',
        import: lazy(() => import("./Admin/Telermark/Motivos/Motivos"))
    },
    {
        path: 'cargas-autorizadas',
        import: lazy(() => import("./Admin/Ventas/CargasAutorizadas/CargasAutorizadas"))
    },
    {
        path: 'agentesvsusuarios',
        import: lazy(() => import("./Admin/Telermark/AgentesvsUsuarios/AgentesvsUsuarios"))
    },
    {
        path: 'cliente-otra-empresa',
        import: lazy(() => import("./Admin/Catalogs/ClienteOtraEmpresa/ClienteOtraEmpresa"))
    },
    {
        path: 'monitor',
        import: lazy(() => import("./Admin/Telermark/Monitores/Monitor/Monitor"))
    },
    {
        path: 'tanques',
        import: lazy(() => import("./Admin/Catalogs/Tanques/Tanques"))
    },
    {
        path: 'valvulas',
        import: lazy(() => import("./Admin/Catalogs/Valvulas/Valvulas"))
    },
    {
        path: 'tienda-snacks',
        import: lazy(() => import("./Tiendita/TiendaSnacks/TiendaSnacks"))
    },
    {
        path: 'articulos',
        import: lazy(() => import("./Tiendita/Articulos/Articulos"))
    },
    {
        path: 'almacen',
        import: lazy(() => import("./Tiendita/Almacen/Almacen"))
    },
    {
        path: 'administrar-creditos',
        import: lazy(() => import("./Tiendita/AdministrarCreditos/AdministrarCreditos"))
    },
    {
        path: 'precios',
        import: lazy(() => import("./Admin/Catalogs/Precios/Precios"))
    },
    {
        path: 'tanques-valvulas',
        import: lazy(() => import("./Admin/Catalogs/TanquesValvulas/TanquesValvulas"))
    },
    {
        path: 'correcion_pedidos',
        import: lazy(() => import("./Admin/Telermark/Correcion_pedidos/Correccion_pedidos"))
    },
    {
        path: 'control-vehiculos',
        import: lazy(() => import("./Admin/Catalogs/ControlVehiculos/ControlVehiculos"))
    },
    {
        path: 'lista-verificacion',
        import: lazy(() => import("./Admin/Catalogs/ListaVerificacion/ListaVerificacion"))
    },
    {
        path: 'nivel-gasolina',
        import: lazy(() => import("./Admin/Catalogs/NivelGasolina/NivelGasolina"))
    },
    {
        path: 'motivo-entrada-salida',
        import: lazy(() => import("./Admin/Catalogs/MotivoEntradaSalida/MotivoEntradaSalida"))
    },
    {
        path: 'nivel-carburacion',
        import: lazy(() => import("./Admin/Catalogs/NivelCarburacion/NivelCarburacion"))
    },
    {
        path: 'asignacion-tanque',
        import: lazy(() => import("./Admin/Catalogs/AsignacionTanque/AsignacionTanque"))
    },
    {
        path: 'confirmacion-clientes',
        import: lazy(() => import("./Admin/Telermark/Monitores/ConfirmacionClientes/ConfirmacionClientes"))
    },
    {
        path: 'dashboard-telemark',
        import: lazy(() => import("../Pages/Admin/Telermark/DashBoardTelemark/DashBoard-Telemark"))
    },
    {
        path: 'dashboard-ventas',
        import: lazy(() => import("./Admin/Ventas/DashBoardVentas/DashBoardVentas"))
    },
    {
        path: 'reporte-precio',
        import: lazy(() => import("./Admin/Catalogs/ReportePrecios/ReportePrecios"))
    },
    {
        path: 'proximos-pedidos',
        import: lazy(() => import("./Admin/Catalogs/Proximos-Pedidos/proximosPedidos"))
    },
    {
        path: 'geo-reporte',
        import: lazy(() => import("./Admin/Telermark/Georeporte/georeporte"))
    },
    {
        path: 'partes-unidad',
        import: lazy(() => import("./Admin/Catalogs/UnidadPartes/PartesUnidad"))
    },
    {
        path: 'reportes-tanques',
        import: lazy(() => import("./Admin/Catalogs/Tanques/Reportes/ReportesTanques"))
    },
    {
        path: 'reportes',
        import: lazy(() => import("./Admin/Telermark/Reportes/Reportes"))
    },
    {
        path: 'operadores-transporte',
        import: lazy(() => import("./Admin/Transporte/Transporte"))
    },
    {
        path: 'sat-localidades',
        import: lazy(() => import("./Admin/Catalogs/SAT/Localidades/Localidades"))
    },
    {
        path: 'origen-transporte',
        import: lazy(() => import("./Admin/Transporte/Origen/Origen"))
    },
    {
        path: 'destino-transporte',
        import: lazy(() => import("./Admin/Transporte/Destino/Destino"))
    },
    {
        path: 'origendestino-transporte',
        import: lazy(() => import("./Admin/Transporte/OrigenDestino/OrigenDestino"))
    },
    {
        path: 'reportes-isabel',
        import: lazy(() => import("./Admin/Telermark/Reportes/ReportesIsabel"))
    },
    {
        path: 'ordenes',
        import: lazy(() => import("./Admin/Telermark/Reportes/Ordenes"))
    },
    {
        path: 'pedidos-ruta',
        import: lazy(() => import("./Admin/Telermark/PedidosRuta/PedidosRuta"))
    },
    {
        path: 'Localizacion_gps',
        import: lazy(() => import("./Admin/Telermark/Localizacion-gps/Localizacion_gps"))
    },
    {
        path: 'ventas-portatil',
        import: lazy(() => import("./Admin/Ventas/VentasPortatil/VentasPortatil"))
    },
    {
        path: 'configuracion-autotransporte',
        import: lazy(() => import("./Admin/Transporte/ConfiguracionDeAutotransporte/ConfiguracionAutotransporte"))
    },
    {
        path: 'ventas-estacionario',
        import: lazy(() => import("./Admin/Ventas/VentasEstacionario/VentasEstacionario"))
    },
    {
        path: 'auditoria-sistemas',
        import: lazy(() => import("./Admin/Sistemas/Auditoria/Auditoria"))
    },
    {
        path: 'catalogos-sistemas',
        // C:\Users\Rhint\Desktop\siafweb\resources\js\Pages\Admin\Catalogs\CatalogoDescripcionSistemas\CatalogoDescripcionSistemas.jsx
        import: lazy(() => import("./Admin/Catalogs/CatalogoDescripcionSistemas/CatalogoDescripcionSistemas"))
    },
    {
        path: 'operadores-unidad',
        import: lazy(() => import("./Admin/Transporte/OperadoresUnidad/OperadoresUnidad"))
    },
    {
        path: 'generados-en-ruta',
        import: lazy(() => import("./Admin/Telermark/Reportes/GenEnRuta/ServiciosGenEnRuta"))
    },
    {
        path: 'reporte-servicio-tecnico',
        import: lazy(() => import("./Admin/Telermark/Reportes/ReporteServicioTecnico"))
    },
    {
        path: 'comparaciones-anuales',
        import: lazy(() => import("./Admin/Telermark/Reportes/Comparaciones/CompAnuales/ComparacionesAnuales"))
    },
    {
        path: 'comparaciones-origenes',
        import: lazy(() => import("./Admin/Telermark/Reportes/Comparaciones/CompOrigenes/ComparacionesOrigines"))
    },
    {
        path: 'mantenimiento-ventas',
        import: lazy(() => import("./Admin/Ventas/Mantenimiento-Ventas/MantenimientoVenta"))
    },
    {
        path: 'cartaporte-transporte',
        import: lazy(() => import("./Admin/Transporte/CartaPorte/CartaPorteTransporte"))
    },
    {
        path: 'reporte-direccion-clientes',
        import: lazy(() => import("./Admin/Telermark/Reportes/Direccion/ReporteDirClientes"))
    },
    {
        path: 'lista-auditoria',
        import: lazy(() => import("./Admin/Sistemas/Auditoria/Auditoria"))
    },
    {
        path: 'pedidos-diarios',
        import: lazy(() => import("./Admin/Telermark/Reportes/PedidosDiarios/PedidosDiarios"))
    },
    {
        path: 'reporte-confirmacion-clientes',
        import: lazy(() => import("./Admin/Telermark/Reportes/ConfirmacionClientes/ReporteConfClientes"))
    },
    {
        path: 'cambio-lectura',
        import: lazy(() => import("./Admin/Ventas/Cambio Lectura/CambioLectura"))
    },
    {
        path: 'reportes-vendedores',
        import: lazy(() => import("./Admin/Catalogs/ReportesVendedores/ReporteVendedor"))
    },
    {
        path: 'reporte-diario-operadoras',
        import: lazy(() => import("./Admin/Telermark/Reportes/DiarioOperadoras/ReporteDiarioOperadoras"))
    },
    {
        path: 'reporte-remisiones',
        import: lazy(() => import("./Admin/Ventas/Reportes/ReporteRemisiones/ReporteRemisiones"))
    },
    {
        path: 'venta-detalle',
        import: lazy(() => import("./Tiendita/VentaDetalle/VentaDetalle"))
    },
    {
        path: 'corte-general',
        import: lazy(() => import("./Admin/Ventas/CorteGeneral/CorteGeneral"))

    },
    {
        path: 'cortes',
        import: lazy(() => import("./Tiendita/Cortes/Cortes"))
    },
    {
        path: 'compra',
        import: lazy(() => import("./Tiendita/Compra/Compra"))
    },
    {

        path: 'Facturacion-Remisiones',
        import: lazy(() => import("./Admin/ventas/Facturacion-Remisiones/FacturacionRemisiones"))
    },
    {
        path: "Generador-Factura-Cliente",
        import: lazy(() => import("./Admin/Ventas/Facturacion-Remisiones/GeneradorFacturaCliente"))

    },
    {
        path: 'arqueo',
        import: lazy(() => import("./Tiendita/Arqueo/Arqueo"))
    },
    {
        path: 'reporte-de-venta-tiendita',
        import: lazy(() => import("./Tiendita/ReporteDeVentaTiendita/ReporteDeVentaTiendita"))
    },
    {
        path: 'proveedor',
        import: lazy(() => import("./Admin/Catalogs/Proveedor/Proveedor"))
    },
    {
        path: 'asignar-articulos',
        import: lazy(() => import("./Tiendita/AsignarArticulos/AsignarArticulos"))
    },
    {
        path: 'usuario-almacen',
        import: lazy(() => import("./Tiendita/UsuarioAlmacen/UsuarioAlmacen"))
    },
    {
        path: 'ajuste-inventarios',
        import: lazy(() => import("./Tiendita/AjusteInventarios/AjusteInventarios"))
    },
    {
        path: 'pagos',
        import: lazy(() => import("./Admin/Cartera/PagosCartera/PagosCartera"))
    },

    {
        path: 'antiguedad-clientes-por-cobrar',
        import: lazy(() => import("./Admin/Cartera/AntiguedadClientesxCobrar/AntiguedadClientesxCobrar"))
    },
    {
        path: 'cargos-clientes',
        import: lazy(() => import("./Admin/Cartera/CargosClientes/CargosClientes"))
    },
    {
        path: 'marca-modelos',
        import: lazy(() => import("./Admin/Catalogs/MarcaModeloCarros/MarcaModeloCarros"))
    },
    {
        path: 'supervisor-puesto',
        import: lazy(() => import("./Admin/Catalogs/SupervisorPuesto/SupervisorPuesto"))
    },
    {
        path: 'tipos-vehiculos',
        import: lazy(() => import("./Admin/Catalogs/TipoVehiculo/TipoVehiculo"))
    },
    {
        path: 'ReportesLiquidacion',
        import: lazy(() => import("./Admin/Ventas/Reportes/ReportesLiquidacion"))
    },
    {
        path: 'facturacion-consultas',
        import: lazy(() => import("./Admin/Facturacion/FacturacionConsultas"))
    },

    {
        path: 'Visualizar-Factura',
        import: lazy(() => import("./Admin/Facturacion/VisualizarFactura"))
    },
    {
        path: 'facturas-cancelacion',
        import: lazy(() => import("./Admin/Facturacion/CancelacionFacturas"))
    },
    {
        path: 'cancelar-pagos',
        import: lazy(() => import("./Admin/Cartera/CancelarPagos/CancelarPagos"))
    },
    {
        path: 'timbrado-pagos',
        import: lazy(() => import("./Admin/Cartera/TimbradoPagos/TimbradoPagos"))
    },
    {

        path: 'facturacion-carburacion',
        import: lazy(() => import("./Admin/Facturacion/FacturacionCarburacion"))
    },
    {
        path: 'notas-de-credito',
        import: lazy(() => import("./Admin/Cartera/NotasCredito/NotasCredito"))

    },
    {
        path: 'reporte-facturacion',
        import: lazy(() => import("./Admin/Facturacion/ReporteFacturacion"))
    },
    {
        path: 'consulta-notas-de-credito',
        import: lazy(() => import("./Admin/Cartera/ConsultaNotasCredito/ConsultaNotasCredito"))

    },
    {
        path: 'datos-cliente-ncr',
        import: lazy(() => import("./Admin/Cartera/ConsultaNotasCredito/DatosCliente"))

    },
    {
        path: 'Reporte-Pagos',
        import: lazy(() => import("./Admin/Cartera/ReportePagos/ReportePagos"))
    },
    {
        path: 'reporte-vigilancia',
        import: lazy(() => import("./Admin/Vigilancia/Reportes/ReporteVigilancia/ReporteVigilancia"))
    },
    {
        path: 'reportes-comparativos',
        import: lazy(() => import("./Admin/Ventas/Reportes/ReportesComparativos/ReportesComparativos"))
    },
    {
        path: 'historico-vigilancia',
        import: lazy(() => import("./Admin/Vigilancia/HistoricoVigilancia/HistoricoVigilancia"))
    },
    {
        path: 'pruebas',
        import: lazy(() => import("./Admin/Pruebas"))
    },
]

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER_MENUS':
            return { ...state, userMenus: action.payload }
        case 'SET_SELECTED_MENU':
            return { ...state, selectedMenu: action.payload }
        case 'SET_LOGGED_USER':
            return { ...state, loggedUser: action.payload }
        case 'SET_SEARCH_MENU_TERM':
            return { ...state, searchMenuTerm: action.payload }
        case 'SET_FILTERED_MENUS':
            return { ...state, filteredMenus: action.payload }
        default:
            return state
    }
}

const initialState = {
    userMenus: [],
    selectedMenu: "",
    loggedUser: {
        usuario_username: ""
    },
    searchMenuTerm: "",
    filteredMenus: []
}

const Home = (props) => {
    const { post } = useForm()
    const navigate = useNavigate();
    const location = useLocation();
    const [state, dispatch] = useReducer(reducer, initialState)
    const [userMenus, setUserMenus] = useState()
    const [loggedUser, setLoggedUser] = useState()
    const [selectedMenu, setSelectedMenu] = useState()
    const [showMenu, setShowMenu] = useState(true);
    const [token, setToken] = useState(false);
    const [empresa, setEmpresa] = useState({
        empresa: '',
        logo: '',
    })
    // const [filteredMenus, setFilteredMenus] = useState(userMenus);

    useEffect(() => {
        // if (props.token) {
        const title = {
            menu1: 'Dashboard',
            menu2: '',
            menu3: '',
        }

        localStorage.setItem('title', JSON.stringify(title))
        localStorage.setItem('token', props.token)

        const url = location.pathname.substring(1)

        setToken(true)
        if (props.menuInicio && props.menuInicio.menu_url !== url) {
            return window.location.replace(`/${props.menuInicio.menu_url}`);
        }

    }, []);

    const getUserMenus = async () => {
        const response = await fetch(route("user.menus"))
        const data = await response.json()
        dispatch({ type: 'SET_USER_MENUS', payload: data })
        setUserMenus(data)
    };

    const getEmpresaLogged = () => {
        getEnterpriseData().then(res => {
            setEmpresa(res);
        })
    }

    const SetLoggedUser = () => {
        dispatch({ type: 'SET_LOGGED_USER', payload: props.auth.user })
        setLoggedUser(props.auth.user)
    }

    const SetSelectedMenuFunc = (menu) => {
        dispatch({ type: 'SET_SELECTED_MENU', payload: menu })
        setSelectedMenu(menu)
    }

    const MenuFunction = () => {
        setShowMenu(!showMenu);
    };

    const filterMenus = (menuList, calc = []) => {
        const regex = new RegExp(state.searchMenuTerm.toLowerCase(), 'u');
        const obj = {}
        menuList.forEach(menu => {
            if (menu.childs && menu.childs.length > 0) {
                filterMenus(menu.childs, calc);
            } else {
                const objKeys = Object.keys(menu);
                const child = {};

                for (const key of objKeys) {
                    child[key] = menu[key];
                }

                if (child.menu_nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(regex)) {
                    calc.push(child);
                }
            }
        });
        return calc
    };

    useEffect(() => {
        if (!userMenus && token) {
            getUserMenus();
            SetLoggedUser();
            getEmpresaLogged();
        }
    }, [userMenus, token]);

    useEffect(() => {
        if (state.searchMenuTerm !== '' && state.searchMenuTerm) {
            const filtered = filterMenus(state.userMenus)
            dispatch({ type: 'SET_FILTERED_MENUS', payload: filtered })
            // setFilteredMenus(filtered);
        } else {
            dispatch({ type: 'SET_FILTERED_MENUS', payload: userMenus })
            // setFilteredMenus(userMenus);
        }
    }, [state.searchMenuTerm, userMenus]);

    const containerClass = showMenu ? "body-container" : "body-container open";

    return (
        <div id="page-container">
            <UserMenusContext.Provider value={{ userMenus, selectedMenu, SetSelectedMenuFunc, loggedUser, state, dispatch }}>
                {!token && <LoadingDiv />}
                {token && <div className={containerClass}>
                    <LeftMenu MenuFunction={MenuFunction} showMenu={showMenu} empresa={empresa} auth={props.auth} menus={props.menus} />
                    <div className="content sm:overflow-auto md:overflow-hidden">
                        <Header user={props.auth.user} empresa={empresa} />
                        <div className="scrollable-content styled-scroll">
                            <Routes>
                                {
                                    routes.map((route, index) => (
                                        <Route key={index} lazy={route.import} path={route.path} element={(
                                            <Suspense fallback={
                                                <div className="h-full"> <LoadingDiv /> </div>
                                            }>
                                                <route.import />
                                            </Suspense>
                                        )} />
                                    ))
                                }
                            </Routes>
                        </div>
                    </div>
                </div>}
            </UserMenusContext.Provider>
            <div className="serverhostInfo non-selectable">{props.localServerInfo && props.localServerInfo}</div>
        </div>
    );
};

export default Home;