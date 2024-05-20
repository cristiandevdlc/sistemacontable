import estacionario from "../../../../../png/estacionario/estacionario_izquierdo.png";
import portatil from "../../../../../png/Portatil/DSC_42591.png";
import utilitario from "../../../../../png/NP300.png";
import visita from "../../../../../png/nissan-march.png";
import { ServiceTypes } from "@/utils";

export const imgEstacionario = estacionario;
export const imgPortatil = portatil;
export const imgUtilitario = utilitario;
export const imgVisita = visita;

export const typesES = {
    entrada: 1,
    salida: 2
}

export const dialogTypes = {
    estacionario: 0,
    portatil: 1,
    visita: 2,
    utilitario: 3,
}

export const dialogTitles = [
    'estacionarios',
    'portatiles',
    'de visita',
    'utilitarios',
]

export const tiposServEstacionario = [
    ServiceTypes.MONTACARGAS,
    ServiceTypes.ESTACIONARIO,
]

export const tiposServPortatil = [
    ServiceTypes.PORTATIL,
    ServiceTypes.RECARGAS,
    ServiceTypes.LLENOS
]


export const tiposServVisita = [ServiceTypes.VISITA]

export const tiposServUtilitario = [ServiceTypes.UTILITARIO]

export const servicesList = [
    tiposServEstacionario,
    tiposServPortatil,
    tiposServVisita,
    tiposServUtilitario,
]

export const IntCatalogsList = {
    listaVerificacion: [],
    motivosES: [],
    motivosESFiltrados: [],
}

export const IntGeneralControlState = {
    ...IntCatalogsList,
    regTypes: [
        { id: 1, value: 'Entrada' },
        { id: 2, value: 'Salida' },
    ],
    dialogHandler: () => { },
    dialogType: dialogTypes.estacionario,
    openDialog: false,
    dataLoaded: false,
    nivelesGasolina: [],
    carburaciones: [],
    unidades: [],
    unidadesFiltradas: [],
    empleados: [],
    visitaHist: [],
    refresh: true,
}

export const IntSubmitState = {
    submit: () => { },
    btnText: ''
}

/* REGISTROS ESTACIONARIOS */
export const IntPartesEstacionarias = { Fpt1: "", Fpt2: "", Fpt3: "", Fpt4: "", Fpt5: "", Fpt6: "", Fpt7: "", Fpt8: "", Fpt9: "", Apt1: "", Apt2: "", Apt3: "", Apt4: "", Dpt1: "", Dpt2: "", Dpt3: "", Dpt4: "", Dpt5: "", Dpt6: "", Dpt7: "", Dpt8: "", Dpt9: "", Ipt1: "", Ipt2: "", Ipt3: "", Ipt4: "", Ipt5: "", Ipt6: "", Ipt7: "", Ipt8: "", Ipt9: "" }

export const IntEstacionarioData = {
    tipoRegistro: 1,
    motivosES: '',
    unidad: '',
    gasolina: '',
    carburacion: 85,
    kilometraje: 0,
    lectura: 0,
    porcentaje: 85,
    venta: 0,
    unidadObjeto: {},
    dataSent: false
}
export const IntEstacionarioRules = {
    tipoRegistro: 'required',
    motivosES: 'required',
    unidad: 'required',
    gasolina: 'required',
    carburacion: 'required',
    kilometraje: 'required',
    lectura: 'required',
    porcentaje: 'required',
}

/* PORTATILESSSS */
export const IntPortatilData = {
    tipoRegistro: 1,
    motivosES: '',
    unidad: '',
    gasolina: '',
    porcentaje: 85,
    kilometraje: 0,
    unidadObjeto: {},
    dataSent: false
}
export const IntPortatilRules = {
    tipoRegistro: 'required',
    motivosES: 'required',
    unidad: 'required',
    gasolina: 'required',
    porcentaje: 'required',
    kilometraje: 'required',
}

/* UTILITARIOS */
export const IntUtilitarioData = {
    tipoRegistro: 1,
    motivosES: '',
    unidad: '',
    gasolina: '',
    porcentaje: 85,
    operador: '',
    telefono: '',
    kilometraje: 0,
    unidadObjeto: {},
    dataSent: false
}

export const IntUtilitarioRules = {
    tipoRegistro: 'required',
    motivosES: 'required',
    unidad: 'required',
    gasolina: 'required',
    porcentaje: 'required',
    kilometraje: 'required',
    operador: 'required',
    telefono: 'required',
}

/* UTILITARIOS */
export const IntVisitaData = {
    tipoRegistro: 1,
    motivosES: '',
    celular: '',
    visitante: '',
    empresa: '',
    placa: '',
    unidadvisitante: '',
    quienSale: '',
    
}

export const IntVisitaRules = {
    tipoRegistro: 'required',
    motivosES: 'required',
    celular: 'required',
    visitante: 'required',
    empresa: 'required',
    placa: 'required',
    unidadvisitante: 'required',
    quienSale: '',
}