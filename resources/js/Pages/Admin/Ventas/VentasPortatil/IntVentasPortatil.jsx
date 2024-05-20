import { getCurrDateInput, getCurrentdDate } from "@/utils"
import moment from "moment"

export const IntVentaPortatil = {
    fecha: moment().format('YYYY-MM-DDTHH:mm'),
    supervisor: null,
    unidad: null,
    ayudante1: null,
    ayudante2: null,
    zona: null,
    turno: null,
    tanques: "0",
    operador: null,
    red: "No hay red",
    remision: "0",
    // Credito: "0.00",
    // Contado: "0.00",
    kiloContado: 0,
    kiloCredito: 0,
    kilos: 0,
    efectivo: 0,
    contado: 0,
    credito: 0,
    total: 0,

    vendidos: 0,
    regresoCon: 0,
    salioCon: 0,
    diferencia: 0,
    lecturaAnterior: null
}

export const IntStateVentas = {
    zonas: [],
    lectura: [],
    turnos: [],
    unidades: [],
    // operadores: '',
    vendedores: [],
    ayudantes: [],
    supervisores: [],
    motivosCambios: [],
    editOperador: false,
    editAyudante: false,
    editSupervisor: false,
    enableRemision: false,
    dialogLectura: false,
    dialogRemision: false,
    enableEditExit: false,
    motivo: '',
    onlyPrint: false,
    openPrint: false
}

export const IntVentaFinalData = {
    ventaDetalle: {},
    dataVenta: {},
}

export const IntRemissionTotals = {
    lts: { contado: 0, credito: 0, total: 0 },
    price: { contado: 0, credito: 0, total: 0 },
    prod: {
        t10: 0,
        t20: 0,
        t30: 0,
        t45: 0,
        rec: 0,
        tanques: 0,
    },
    remisiones: 0
}

export const intNewOrder = {
    remision: 'required',
    // vale: 'required',
    fecha: 'required',
    cliente: 'required',
    producto: 'required',
    cantidad: 'required',
    precio: 'required',
    total: 'required',
    estacion: 'required',
    tipoVenta: 'required',
    formaPago: 'required',
    facturar: 'required',
}

export const remissionRules = {
    remision: 'required',
    // vale: 'required',
    clienteId: 'required',
    producto: 'required',
    cantidad: 'required',
    estacionId: 'required',
    tipoVenta: 'required',
    formaPago: 'required',
    facturar: 'required',
}

export const IntPdfPortData = {
    fecha: moment().format('YYYY-MM-DDTHH:mm'),
    folio: null,
    operador: null,
    unidad: null,
    tanque10: null,
    tanque20: null,
    tanque30: null,
    tanque45: null,
    recargas: null,
    kg: null,
    totalkg: null,
    total: null,
}