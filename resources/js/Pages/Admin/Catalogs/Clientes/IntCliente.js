const clienteData = {
    cliente_idPais: '',
    cliente_idEstado: '',
    cliente_colonia: '',
    cliente_ciudad: '',//municipio
    cliente_calle: '',
    cliente_localidad: '',
    //Adicionales, no estan en la tabla pero son importantes
    descripcionPais: '',
    descripcionMunicipio: '',
    descripcionEstado: '',
    cliente_idCliente: '',
    cliente_idUsuario: '',
    cliente_idTipoCaptacion: '',
    cliente_idTipoCliente: '',
    cliente_idFormasPago: '',
    cliente_idTipoCartera: '',
    cliente_idVendedor: '',
    cliente_idUsoCfdiSAT: '',
    cliente_nombrecomercial: '',
    cliente_razonsocial: '',
    cliente_rfc: '',
    cliente_numeroInterior: '',
    cliente_numeroExterior: '',
    cliente_codigoPostal: '',
    cliente_telefono: '',
    cliente_limiteCredito: '0',
    cliente_diasCredito: '0',
    cliente_CreditoAutorizado: '0',
    cliente_descuento: '0',
    cliente_DescuentoAutorizado: '0',
    cliente_cienLitros: '0',
    cliente_fecha: '',
    cliente_fechaModificacion: '',
    cliente_estatus: '1',
    cliente_estatusReposicion: '0',
    cliente_tieneCredito: '0',
    cliente_tieneDescuento: '0',
    cliente_cuentaContable: '',
    cliente_descuentoTanque: '0',
    cliente_dscportanque: '0',
    cliente_idRegimenFiscal: '',
    cliente_representanteLegal: '',
}
export const clienteValidation = {
    cliente_idPais: 'required',
    cliente_idEstado: 'required',
    cliente_colonia: 'required',
    cliente_ciudad: 'required',
    cliente_calle: 'required',
    cliente_localidad: 'required',
    // descripcionPais: 'required',
    // descripcionMunicipio: 'required',
    // descripcionEstado: 'required',
    // cliente_idCliente: 'required',
    // cliente_idUsuario: 'required',
    cliente_idTipoCaptacion: 'required',
    cliente_idTipoCliente: 'required',
    cliente_idFormasPago: 'required',
    cliente_idTipoCartera: 'required',
    // cliente_idVendedor: 'required',
    cliente_idUsoCfdiSAT: 'required',
    cliente_nombrecomercial: 'required',
    cliente_razonsocial: 'required',
    cliente_rfc: ['required', 'rfc'],
    cliente_numeroExterior: 'required',
    cliente_codigoPostal: 'required',
    cliente_telefono: ['required', 'max:10'],
    // cliente_cuentaContable: 'required',
    cliente_idRegimenFiscal: 'required',
    // cliente_representanteLegal: 'required',
    // cliente_limiteCredito: 'required',
    // cliente_diasCredito: 'required',
    // cliente_descuento: 'required',
    // cliente_descuentoTanque: 'required',
}

export default clienteData;

export const IntClientDialogs = {
    actionsDialog: false,
    crudDialog: false,
    loading: true,
    loadingModal: true
}

export const IntClienteSucursal = {
    sucursalesCliente: [],
    fetchData: () => { },
    idCliente: '',
    nombreCliente: ''
}

export const IntDataSelects = {
    tipoClientes: null,
    tipoCaptaciones: null,
    tipoCarteras: null,
    formaPagos: null,
    vendedores: null,
    cfdis: null,
    regimenes: null,
}

export const IntStateDialogClient = {
    loading: false,
    largeDialog: false,
    specialPermission: false
}

export const IntEnterpriseList = {
    empresaList: [],
    empresaClient: []
}

export const IntBankData = {
    banksList: [],
    paymentTypes: [],
    clientAccounts: [],
    bankData: {
        cuentasBancoCliente_idCliente: null,
        cuentasBancoCliente_idBanco: null,
        cuentasBancoCliente_cuentaBancaria: null,
        cuentasBancoCliente_estatus: '1',
        cuentasBancoCliente_descripcion: null,
    }
}

export const bankAccountValidations = {
    cuentasBancoCliente_idBanco: 'required',
    cuentasBancoCliente_cuentaBancaria: ['required', 'min:10', 'max:18'],
    cuentasBancoCliente_estatus: 'required',
    cuentasBancoCliente_descripcion: 'required',
}