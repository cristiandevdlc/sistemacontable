import moment from "moment"

export const intConsultaNotasCredito = {
    FechaInicio: moment().format("YYYY-MM-DD"),
    FechaFinal: moment().format("YYYY-MM-DD"),
}
export const intClienteDatos = {
    NoCliente: "",
    NombreCliente: "",
    RFC: "",
    Calle: "",
    Colonia: "",
    NoExterior: "",
    NoInterior: "",
    Pais: "",
    Estado: "",
    Ciudad: "",
    Localidad: "",
    CP: "", 
    correo:""    
    
}

export const intStateConsultasNCR = {
    facturas: [],
    info: false,
    comp: false,
    NCR: [],
    DatosCliente:[], 
}
