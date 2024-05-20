import moment from "moment"

export const intData = {
    tipos: '',
    unidad: '',
    fechaInicial: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    fechaFinal: moment().format('YYYY-MM-DD'),


}

export const intState = {
    datos: [],
    tiposServicio: [],
    unidades:[],
    TotalLts: 0,
    TotalCantidad: 0,
    TotalBonificacion: 0,
    TotalImporte: 0,
    Total: 0,
    showPDF: false,
    loadingPDF: false,
    unidadesEnabled:false

}
