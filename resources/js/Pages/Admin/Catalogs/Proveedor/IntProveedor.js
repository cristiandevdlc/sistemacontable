const proveedorData = {
    proveedor_id: "",
    proveedor_idPais: "",
    proveedor_idEstado: "",
    proveedor_nombrecomercial: "",
    proveedor_razonsocial: "",
    proveedor_rfc: "",
    proveedor_calle: "",
    proveedor_numero: "",
    proveedor_idColonia: "",
    proveedor_telefono: "",
    proveedor_estatus: "1",
    // proveedor_idEmpresa:"",
    proveedor_clabe: "",
    proveedor_cuenta: "",
    proveedor_idBanco: "",
    proveedor_correo: "",
    proveedor_cp: "",
    proveedor_idTipoCaptacion: ""
}

export const proveedorValidations = {
    proveedor_idPais: "required",
    proveedor_idEstado: "required",
    proveedor_nombrecomercial: "required",
    proveedor_razonsocial: "required",
    proveedor_rfc: "required",
    proveedor_calle: "required",
    proveedor_numero: "required",
    proveedor_idColonia: "required",
    proveedor_telefono: "required",
    proveedor_estatus: "required",
    // proveedor_idEmpresa:"required",
    proveedor_clabe: ["min:18", "max:18"],
    proveedor_cuenta: ["min:12", "max:12"],
    proveedor_idBanco: "",
    proveedor_correo: "",
    proveedor_cp: "",
    proveedor_idTipoCaptacion: ""

};

export const proveedorFields = {
    IdPais: "pais",
    IdEstado: 'estado',
    IdColonia: "colonia",
    IdEmpresa: "empresa",
    IdBanco: "banco",
    NombreComercial: "nombre comercial",
    RazonSocial: "razón social",
    RFC: "rfc",
    Calle: "calle",
    Num: "número",
    Tel: "teléfono",
    Estatus: "estatus",
    Clabe: "clabe",
    ProveedorCuenta: "proveedor cuenta",
    ProveedorCorreo: "proveedor correo",
    proveedor_cp: "",
    TipoCaptacion: ""
};

export default proveedorData


export const intProvSelects = {
    // estados: [],
    // pais: [],
    colonias: [],
    empresas: [],
    bancos: [],
    captacion: []
}
export const intProvState = {
    open: false,
    loading: true,
    loadingModal: true,
}