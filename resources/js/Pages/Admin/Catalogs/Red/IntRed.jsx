export const IntRedStates = {
    redes: [],
    personas: [],
    empresas: [],
    proveedores: [],
    historico: [],
    open: false,
    openHistorico: false,
    loading: true,
    errors: {},
    action: 0 // 0 create / 1 update
}

export const IntRedData = {
    red_numero: '',
    red_idProveedor: '',
    IdPersona: '',
    idRed: '',
    red_idEmpresa: null,
    red_idEmpresaByCliente: null,
    estatus: '',
    asignacion: null
}

export const IntRedRules = {
    red_numero: ['required', 'max:10', 'min:10'],
    red_idProveedor: 'required',
    IdPersona: '',
    idRed: '',
    red_idEmpresa: ''
    // estatus: '',
}