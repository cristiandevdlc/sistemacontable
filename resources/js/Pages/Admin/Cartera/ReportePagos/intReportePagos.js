import moment from "moment"

export const intReportePagos = {
    FechaInicio: moment().format("YYYY-MM-DD"),
    FechaFinal: moment().format("YYYY-MM-DD"),
    Cliente: '',
    Concepto: '',

}

export const intReporteState = {
    open: false,
    loading: false,
    info:false,
    clientes:[],
    pagos:[],
    newPdf: true,
    pdf: false,
    comp: true,
    info: false,
    pdfName:'',
    // pagosCanceladosCheck:false
}
