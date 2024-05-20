import moment from "moment"

export const intPagoData = {
    saldoTotal: 0,
    fechaMovimiento: moment().subtract(0, 'day').format('YYYY-MM-DD'),
    noCliente: '',
    pago_idCliente: '',
    pago_idFormasPago: '',
    importe: '',
    documentoPago: '',
    anticipo: '',
    observaciones: '',
    correos:'',
    folio:0

}
export const intPagoTotales = {
    sumaAcreditados: 0,
    porAcreditar: 0,
    acreditados: {},
}
export const pagoFields = {

}
export const intPagoState = {
    cuentasCliente: [],
    cuentasEmpresa: [],
    formasPago: [],
    clientes: [],
    facturas: [],
    ClientEmail:[],
    showAccounts: false,
    open: false,


    // loading: false, 
    // fechaMovimiento: fechaFormateada, 
    // idCliente: '', 
    // clienteNombre: '', 
    // cliente: '', 
    // folio:0, 
    // correo:false
}
