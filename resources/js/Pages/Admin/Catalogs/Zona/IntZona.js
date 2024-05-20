const zonaData = {
    zona_idZona: '',
    zona_idEmpresa: '',
    zona_numero: '',
    zona_descripcion: '',
    zona_idestado:'',
    zona_idmunicipio:'',
    zona_estatus: true,
}

export default zonaData;

export const zonaValidations = {
    // zona_idEmpresa: 'required',
    zona_numero: 'required',
    zona_descripcion: 'required',
    zona_estatus: 'required',
    zona_idmunicipio:'required'
}

export const zonaFields = {
    // zona_idEmpresa: 'emrpesa',
    zona_numero: 'número de zona',
    zona_descripcion: 'descripcion',
    zona_estatus: 'estatus',
    zona_idmunicipio:'Municipio',
    zona_idestado:'estado'
}