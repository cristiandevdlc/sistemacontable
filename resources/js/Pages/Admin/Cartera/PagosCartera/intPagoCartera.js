import moment from "moment"

export const intPagoData = {
    saldoTotal: 0,
    fechaMovimiento: moment().subtract(0, 'day').format('YYYY-MM-DDThh:mm'),
    noCliente: '',
    pago_idCliente: '',
    pago_idFormasPago: '',
    importe: '',
    documentoPago: '',
    anticipo: '',
    observaciones: '',
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
    showAccounts: false,
    open: false,

}
