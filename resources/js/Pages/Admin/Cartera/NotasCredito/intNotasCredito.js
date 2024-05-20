import moment from "moment"

export const intNotaCredito = {
    saldoTotal: 0,
    fechaMovimiento: moment().subtract(0, 'day').format('YYYY-MM-DD'),
    noCliente: '',
    serie: '',
    folio: '',
    tipoRelacion:'',
    facts:'',
    facturasNoTimbradas: '', 
    facturasTimbradas: '',
    UsoCFDISAT:'', 
    correos: '',
    observaciones: '',
}
export const intPagoTotales = {
    importe: 0,
    rerto: 0,
    acreditados: {},
}
export const pagoFields = {

}
export const intPagoState = {
    TipoRelacion: [],
    clientes: [],
    folios:[],
    UsoCFDI: '',
    showAccounts: false,
    open: false,
    ClientEmail:[], 
    estadocorreo: false
}
