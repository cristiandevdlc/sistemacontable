import { EmpresaData, CuentasBanco } from "../intEmpresa"

export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_EMPRESA':
            // getImagen(action.payload.empresa_idEmpresa)
            return {
                ...state,
                empresa:action.payload,
                cuentasBanco: { ...state.cuentasBanco, CuentasBancoEmpresa_idEmpresa: action.payload.empresa_idEmpresa }
            }
        case 'SET_TIMBRES':
            return { ...state, timbres: action.payload }
        case 'SET_CUENTAS_BANCO_LIST':
            return { ...state, cuentasBancoList: action.payload }
        case 'SET_IMAGE':
            return { ...state, image: action.payload }
        case 'SET_ARCHIVOS':
            // return { ...state, archivos: action.payload }
            return {
                ...state,
                empresa: {
                    ...state.empresa,
                    empresa_archivoKey: action.payload.empresa_archivoKey,
                    empresa_SelloDigital: action.payload.empresa_SelloDigital
                }
            }
        case 'SET_SELLO_DIGITAL':
            return { ...state, empresa: { ...state.empresa, empresa_SelloDigital: action.payload } }
        case 'SET_ARCHIVO_KEY':
            return { ...state, empresa: { ...state.empresa, empresa_archivoKey: action.payload } }
        case 'SET_EMPRESA_RFC':
            return { ...state, empresa: { ...state.empresa, empresa_rfc: action.payload } }
        case 'SET_IDREGIMENFISCAL':
            return { ...state, empresa: { ...state.empresa, empresa_idRegimenFiscal: action.payload } }
        case 'SET_PASSWORD_SELLO':
            return { ...state, empresa: { ...state.empresa, empresa_passwordSello: action.payload } }
        case 'SET_NO_CERTIFICADO':
            return { ...state, empresa: { ...state.empresa, empresa_noCertificado: action.payload } }
        case 'SET_NO_OFICIO':
            return { ...state, empresa: { ...state.empresa, empresa_numeroOficio: action.payload } }
        case 'SET_NO_PERMISO':
            return { ...state, empresa: { ...state.empresa, empresa_numeroPermiso: action.payload } }
        case 'SET_USUARIO_CERTIFICADO':
            return { ...state, empresa: { ...state.empresa, empresa_usuarioCertificado: action.payload } }
        case 'SET_PASSWORD_CERTIFICADO':
            return { ...state, empresa: { ...state.empresa, empresa_passwordCertificado: action.payload } }
        case 'SET_CONSULTA_REMISION':
            return { ...state, empresa: { ...state.empresa, empresa_ConsultaRemision: action.payload } }
        case 'SET_CORREO':
            return { ...state, empresa: { ...state.empresa, empresa_correoNotificacion: action.payload } }
        case 'SET_HOST':
            return { ...state, empresa: { ...state.empresa, empresa_host: action.payload } }
        case 'SET_PUERTO':
            return { ...state, empresa: { ...state.empresa, empresa_puerto: action.payload } }
        case 'SET_PASSWORD_CORREO':
            return { ...state, empresa: { ...state.empresa, empresa_passwordCorreo: action.payload } }
        case 'SET_SEGURIDAD_SSL':
            return { ...state, empresa: { ...state.empresa, empresa_seguridadSSL: action.payload } }
        case 'SET_LOCALIDAD_RESPONSE':
            return {
                ...state,
                empresa: {
                    ...state.empresa,
                    empresa_idPais: action.payload.empresa_idPais,
                    empresa_ciudad: action.payload.empresa_ciudad,
                    empresa_idEstado: action.payload.empresa_idEstado,
                    descripcionMunicipio: action.payload.descripcionMunicipio,
                    empresa_localidad: action.payload.empresa_localidad,
                }
            }
        case 'SET_RUTA_FACTURACION':
            return { ...state, empresa: { ...state.empresa, empresa_RutaFacturacion: action.payload } }
        case 'SET_LOGOTIPO':
            return { ...state, empresa: { ...state.empresa, empresa_Logotipo: action.payload } }
        case 'SET_RAZON_SOCIAL':
            return { ...state, empresa: { ...state.empresa, empresa_razonSocial: action.payload } }
        case 'SET_RAZON_COMERCIAL':
            return { ...state, empresa: { ...state.empresa, empresa_razonComercial: action.payload } }
        case 'SET_CALLE':
            return { ...state, empresa: { ...state.empresa, empresa_calle: action.payload } }
        case 'SET_NUMERO_EXTERIOR':
            return { ...state, empresa: { ...state.empresa, empresa_numeroExterior: action.payload } }
        case 'SET_NUMERO_INTERIOR':
            return { ...state, empresa: { ...state.empresa, empresa_numeroInterior: action.payload } }
        case 'SET_CODIGO_POSTAL':
            return { ...state, empresa: { ...state.empresa, empresa_codigoPostal: action.payload } }
        case 'SET_COLONIA':
            return { ...state, empresa: { ...state.empresa, empresa_colonia: action.payload } }
        case 'SET_LOCALIDAD':
            return { ...state, empresa: { ...state.empresa, empresa_localidad: action.payload } }
        case 'SET_REFERENCIA':
            return { ...state, empresa: { ...state.empresa, empresa_referencia: action.payload } }
        case 'SET_TELEFONOS':
            return { ...state, empresa: { ...state.empresa, empresa_telefonos: action.payload } }
        case 'SET_COLOR':
            return { ...state, empresa: { ...state.empresa, empresa_Color: action.payload } }
        case 'SET_STEP':
            return { ...state, step: action.payload }
        case 'SET_LOADING_OPENMODAL':
            return { ...state, loading: { ...state.loading, openModal: action.payload } }
        case 'SET_LOADING_FORM':
            return { ...state, loading: { ...state.loading, form: action.payload } }
        case 'SET_OPEN':
            return { ...state, open: action.payload }
        case 'SET_ACTION':
            return { ...state, action: action.payload }
        case 'SET_AUX_ACTION':
            return { ...state, aux: action.payload }
        case 'SET_BANCOS_LIST':
            return { ...state, catalog: { ...state.catalog, BANKS: action.payload } }
        // case 'SET_EMPRESAS_LIST':
        //     return { ...state, catalog: { ...state.catalog, EMPRESAS: action.payload } }
        case 'SET_REGIMENS':
            return { ...state, regimens: action.payload }
        case 'SET_BANCO_SELECTED':
            return {
                ...state,
                cuentasBanco: {
                    ...state.cuentasBanco,
                    CuentasBancoEmpresa_Descripcion: action.payload.descripcion,
                    CuentasBancoEmpresa_idBanco: action.payload.idBanco
                }
            }
        case 'SET_NO_CUENTA':
            return {
                ...state,
                cuentasBanco: {
                    ...state.cuentasBanco,
                    CuentasBancoEmpresa_Cuenta: action.payload
                }
            }
        case 'SET_CB_STATUS':
            return {
                ...state,
                cuentasBanco: {
                    ...state.cuentasBanco,
                    CuentasBancoEmpresa_Estatus: action.payload ? "1" : "0"
                }
            }
        case 'CREATE_BANK_ACCOUNT':
            return { ...state, submitCuenta: action.payload }
        case 'SET_CONFIRM':
            return { ...state, confirmacionDialog: { ...state.confirmacionDialog, confirm: action.payload } }
        case 'SET_SHOW_CONFIRM_DIALOG':
            return { ...state, confirmacionDialog: { ...state.confirmacionDialog, show: action.payload } }
        case 'SET_BACK':
            return { ...state, confirmacionDialog: { ...state.confirmacionDialog, back: action.payload } }



        case 'SUBMIT_EMPRESA':
            return { ...state, submit: action.payload }
        case 'SET_ERRORS':
            return { ...state, errors: action.payload }
        case 'SET_DESCRIPCION_CUENTA':
            return { ...state, cuentasBanco: { ...state.cuentasBanco, CuentasBancoEmpresa_Descripcion: action.payload } }
        case 'HANDLE_BACK_CLICK':
            return {
                ...state,
                empresa: action.payload,
                cuentasBanco: { ...state.cuentasBanco, CuentasBancoEmpresa_idEmpresa: action.payload.empresa_idEmpresa },
                action: '',
                confirmacionDialog: {
                    show: false,
                    confirm: false,
                    back: false
                }
            }
        case 'HANDLE_CLOSE_MODAL':
            return {
                ...state,
                open: false,
                empresa: EmpresaData,
                cuentasBanco: CuentasBanco,
                cuentasBancoList: null,
                action: '',
                loading: { ...state.loading, form: false },
                formAction: 'create',
                timbres: '',
                image: '',
                errors: {},
                aux: '',
                step: 0,
                submit: false,
                submitCuenta: false,
                confirmacionDialog: {
                    show: false,
                    confirm: false,
                    back: false
                }
            }

        default:
            return state
    }
}