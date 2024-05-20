import moment from "moment"

export const intData = {
    tipos: null,
    fechaInicial: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    fechaFinal: moment().format('YYYY-MM-DD'),

}




export const intState = {
    datos: [],
    tiposServicio: [],
    BonificacionCredito:0,
    descuento:0,
    contado:0,
    credito:0,
    total:0,
    totalKg:0,
    totalLts:0,
    showPDF:false,
    showReImpresion:false,
    nControl: 0,
    Tanques:[]

}
