import validationRules from "@/core/Validator";
import ilogo from "../png/Grupo 10@2x.png";
import camion from "../png/camion.png";
import backArrow from "../png/LeftArrow.png"
import * as _detallesDialogStyles from '../sass/_detallesDialogSyle.scss';

export const primaryColor = "#fc4c02";
export const secondaryColor = "#1B2654";
export const tirthColor = "#3F5097";
export const disabledColor = '#7c7c7c';
export const excelButtonColor = "1b5e20";
export const pdfButtonColor = "af2828";

export const primaryColorExcel = "ed7d31";
export const secondaryColorExcel = "1B2654";
export const tirthColorExcel = "3F5097";
export const intergasLogo = ilogo;
export const camionLogo = camion;
export const leftArrow = backArrow;

export const detallesDialogStyles = _detallesDialogStyles;

export const ServiceTypes = {
    PORTATIL: 1,
    ESTACIONARIO: 2,
    STECNICO: 3,
    UTILITARIO: 4,
    RECARGAS: 1010,
    // LLENOS: 1016,
    LLENOS: 1,
    VISITA: 1017,
    MONTACARGAS: 1019,
    CIL_MONTACARGA: 1031,
    // RECARGAS: 10,
    // LLENOS: 11,
    // VISITA: 12,
    // MONTACARGAS: 13
}

export const tipoNoVariable = {
    'ESTACIONARIO': 0,
    'PORTATIL': 1,
};

export const tiposServEstacionario = [
    ServiceTypes['MONTACARGAS'],
    ServiceTypes['ESTACIONARIO'],
    ServiceTypes['CIL_MONTACARGA'],
];

export const tiposServPortatil = [
    ServiceTypes['PORTATIL'],
    ServiceTypes['RECARGAS'],
    ServiceTypes['LLENOS']
];


export const tiposServVisita = [ServiceTypes['VISITA']];

export const tiposServUtilitario = [ServiceTypes['UTILITARIO']];

export const variacionesTipo = [
    tiposServEstacionario,
    tiposServPortatil,
    tiposServVisita,
    tiposServUtilitario,
];

export default async function request(url, method = 'GET', body = {}, customMessage = { enabled: false, error: {}, success: {} }) {
    const response = await fetch(url, requestBody(method, body)).then(response => {
        if (customMessage.enabled) {
            if (response.ok) {
                if (customMessage.success) {
                    noty(customMessage.success.message, customMessage.success.type || 'success')
                }
            } else {
                if (customMessage.error) {
                    noty(customMessage.error.message, customMessage.error.type || 'error')
                }
            }
        }
        else if (response.ok) {
            if (method === "POST" && response.status === 201) noty("Registro guardado.", 'success')
            else if (method === "POST" && response.status === 200) noty("Registro obtenido.", 'success')
            else if (method === "PUT") noty("Registro actualizado.", 'info')
            else if (method === "DELETE") noty("Registro eliminado.", 'error')
        } else {
            if (response.status != 599)
                noty("No se pudo guardar el registro.", 'error')
        }
        return response.json()
    })

    return response;
}

export async function requestMultipart(url, method, body) {
    const res = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (method === "POST") {
                        noty("Registro guardado.", 'success')
                    } else if (method === "PUT") {
                        noty("Registro actualizado.", 'info')
                    }
                }
                resolve(xhr.response);
            }
        };
        xhr.open(method, url);
        xhr.send(body);
    });
    return JSON.parse(res)
}


export async function fileDownloader(url, method = 'GET', body = {}, fileName = Date.now(), onStartDownload = () => { }) {
    fetch(url, requestBody(method, body))
        .then((response) => {
            if (response.ok) {
                noty('Archivo descargado con exito.', 'success')
                return response.blob();
            } else {
                noty('Error al descargar el archivo.', 'error')
                throw new Error("Error al descargar el archivo");
            }
        })
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        })
        .catch((error) => {
            noty('Error al descargar el archivo.', 'error')
        })
        .finally(() => {
            if (onStartDownload && typeof onStartDownload === 'function') {
                onStartDownload();
            }
        });
}

export function requestBody(method = 'GET', body = {}) {
    const reqBody = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        }
    }
    if (method !== 'GET' && method !== 'DELETE') {
        reqBody.body = JSON.stringify(body)
    }
    return reqBody;
}

export function noty(message = '', type = 'success') {
    new Noty({
        text: message,
        type: type,
        theme: "metroui",
        layout: "bottomRight",
        timeout: 2000
    }).show();
}

/**
 * 
 * @param {rules} rules // Rules to validate { field: ['rule1', 'rule2'] }
 * @param {data} data // Data to validate { key: 'value' }
 *  
 */

export function validateInputs(rules, data, aliases = {}) {
    const errors = {};
    let isValid = true;
    for (const fieldRules in rules) {
        const result = validationRules(rules[fieldRules], data[fieldRules])
        if (!result.valid) {
            isValid = false
            errors[fieldRules] = result.message;
        }
    };

    if (!isValid) {
        noty('Validacion fallida (Favor de revisar los campos).', 'error')
    }
    return { errors, isValid };
}


/**
 * 
 * @param {string} imageUrl // Es el path de la imagenn a generar
 * @returns 
 */
export const loadImageAsBuffer = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };

        xhr.onerror = function () {
            reject('Network error occurred');
        };

        xhr.send();
    });
};

/**
 * 
 * @returns empresa and logo
 */
export const getEnterpriseData = async () => {

    const empresaData = localStorage.getItem('empresaData')

    // console.log(empresaData)
    if (!empresaData) {
        const response = await request(route('empresa-user-icono'), 'GET');
        const body = {
            empresa: response.empresa_razonSocial,
            logo: response.empresa_Logotipo,
            id: response.empresa_idEmpresa

        }
        localStorage.setItem('empresaData', JSON.stringify(body))
        return body;
    }
    return JSON.parse(empresaData);
}

/**
 * @returns regex of x type
 */
export const regex = {
    rfc: /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
    mayus: /[A-Z]/,
    minus: /[a-z]/,
    letters: /[A-Za-z]/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    date1: /^\d{2}-\d{2}-\d{4}$/,
    zipCode: /([0-9]{4})\w+/
}

export const randomColors = ['#02869B', '#A07EC1', '#7240A2', '#FFC300', '#D03838', '#F19D00', '#18CBA5', '#1E8AA9', '#845CE8', '#D05877', '#E9B45D', '#3AA09B', '#5D89E9', '#4CC981'];

export const locationBody = { colonias: [], municipio: null, estado: null, pais: null };

/**
 * @return { colonias: [], municipio: {}, estado: {}, pais: {} }
 */
export const dataCodigoPostal = async (zipCode) => {
    const response = await request(route("colonia-por-cp", zipCode), 'GET', {}, { enabled: true });
    if (Array.from(response).length < 1)
        noty('No se encontraron colonias', 'error')
    const body = response.reduce((acc, item) => {
        acc.colonias.push({
            Colonia_Id: item.Colonia_Id,
            Colonia_Nombre: item.Colonia_Nombre,
            Colonia_IdMunicipio: item.Colonia_IdMunicipio,
            c_CodigoPostal: item.c_CodigoPostal
        });

        if (!acc.municipio) {
            acc.municipio = {
                idMunicipio: item.municipio.idMunicipio.toString(),
                claveMunicipio: item.municipio.claveMunicipio,
                idestado: item.municipio.idestado,
                descripcionMunicipio: item.municipio.descripcionMunicipio,
                cliente_localidad: item.municipio.descripcionMunicipio
            };
        }
        if (!acc.estado) {
            acc.estado = {
                idEstado: item.municipio.estado.idEstado.toString(),
                cveEstado: item.municipio.estado.cveEstado,
                cvePais: item.municipio.estado.cvePais,
                descripcionEstado: item.municipio.estado.descripcionEstado
            };
        }
        if (!acc.pais) {
            acc.pais = {
                idPais: item.municipio.estado.pais.idPais.toString(),
                cvePais: item.municipio.estado.pais.cvePais,
                descripcionPais: item.municipio.estado.pais.descripcionPais
            };
        }
        return acc;
    }, {
        colonias: [],
        municipio: null,
        estado: null,
        pais: null
    });

    return body;
}

export const yearsList = (yearsCount = 10) => {
    const actYear = (new Date()).getFullYear()

    const years = []
    for (let fYear = actYear; fYear > actYear - yearsCount; fYear--) {
        years.push({ value: fYear })
    }
    return years;
}

Object.defineProperty(Date.prototype, 'formatMX', {
    value: function SayHi() {
        return this.toLocaleDateString('es-MX', {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: '2-digit',
            minute: '2-digit',
        })
            .replaceAll('/', '-')
    },
    writable: true,
    configurable: true,
})
Object.defineProperty(Date.prototype, 'formatTime', {
    value: function SayHi() {
        return this.toLocaleTimeString('es-MX')
    },
    writable: true,
    configurable: true,
})

Object.defineProperty(Date.prototype, 'formatMXNoTime', {
    value: function SayHi() {
        // this.setDate(this.getDate() + 1)
        return this.toLocaleDateString('es-MX', {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .replaceAll('/', '-')
    },
    writable: true,
    configurable: true,
})

// 12-29-2023T10:23:39.635Z
// 2023-12-29T15:59:35.928Z
export function getCurrentdDate() {
    const currentDate = new Date();
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZone: 'America/Monterrey',
    };

    const formattedDateStr = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    const replacedDateStr = formattedDateStr
        .replace(' ', 'T')
        .replaceAll('/', '-')
        .replace(',', '')
        .replaceAll(' ', '')
        .replace('AM', 'Z')
        .replace('PM', 'Z');

    const parts = replacedDateStr.split('T')[0].split('-');
    const rearrangedDate = `${parts[1]}-${parts[0]}-${parts[2]}`;

    return rearrangedDate + 'T' + replacedDateStr.split('T')[1];
}
export function getCurrDateInput() {
    const currentDate = new Date();
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZone: 'America/Monterrey',
    };

    const formattedDateStr = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    const replacedDateStr = formattedDateStr
        .replace(' ', 'T')
        .replaceAll('/', '-')
        .replace(',', '')
        .replaceAll(' ', '')
        .replace('AM', 'Z')
        .replace('PM', 'Z');

    const parts = replacedDateStr.split('T')[0].split('-');
    const rearrangedDate = `${parts[2]}-${parts[0]}-${parts[1]}`;

    return rearrangedDate + 'T' + replacedDateStr.split('T')[1];
}

export function numberFormat(number) {
    return new Intl.NumberFormat('es-MX').format(parseFloat(number))
}

export function moneyFormat(number) {
    return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number)
}

export const nonNullObjVal = (obj = {}) => {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null && v !== ''))
}

export const firstObj = (arr = []) => arr.find(() => true)