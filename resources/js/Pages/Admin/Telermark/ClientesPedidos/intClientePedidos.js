import { getCurrDateInput } from "@/utils"

import Video from './../../Ventas/VentasPortatil/animation_lmupcpbw_small.gif'

export const videoFinished = Video

export const intMapAddress = {
    lat: 25.50097706352141,
    lng: -103.36696620462429,
    label: '',
    value: {
        place_id: ''
    },
    selectActive: false
}

export const intClienteData = {
    clientePedidosId: '',
    telefono: '',
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    telefono2: '',
    Posventa: 1,
    direccion_pedidos: [],
    saved: false,
}

export const intAddressData = {
    direccionPedidosId: '',
    clientePedidosId: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    entrecalle1: '',
    entrecalle2: '',
    zipCode: '',
    estado: '',
    municipio: '',
    ColoniaId: '',
    Referencias: '',

    nombreNegocio: '',
    promedioconsumo: '',
    latitud: '1',
    longitud: '1',
    saved: false,
}

export const intStateModule = {
    controlAddress: 0,
    states: [],
    cities: [],
    suburbs: [],
    products: [],
    paymentMethods: [],
    addresses: [],
    stecnico: [],
    historic: [],
    allProducts: [],
    allOrders: [],
    loadingWho: false,
    orderFinished: false,
    openGeolocation: false,
    geoSuburbDefaultId: null
}

export const intOrderData = {
    direccionPedidosId: '',
    PaymentMethodId: '',
    fechaPedido: getCurrDateInput().split('T')[0],
    orderDetails: {
        solucionserviciotecnicoid: null,
        motivoserviciotecnicoid: null,
        servicio: 'Sin comentarios',
        Cantidad: 1,
        quienconquienId: '',
        productoId: '',
        Subtotal: '',
        productoObjecto: {
            // producto_idProducto: '',
            // producto_nombre: '',
            // historico: {
            //     historico_precio: '',
            // }
        },
        historico: {},
        who: {}
    },
}