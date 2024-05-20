import request, { dataCodigoPostal, locationBody } from "@/utils";
import { useEffect } from "react";
import { useState } from "react";
import { FieldDrawer } from "../../../../../components/DialogComp";

export default function InformacionPersonal(data, setData, dataSelects, setDataSelects) {
    const [infoByPostalCode, setInfoByPostalCode] = useState(locationBody)
    const GetMunicipio = async (estadoId) => {
        const response = await request(route("municipio.byEstado", estadoId), 'GET');
        setDataSelects({
            ...dataSelects,
            municipios: response,
        })
        setData({
            ...data,
            IdEstado: estadoId,
            IdMunicipio: '',
            IdColonia: '',
        });
    };

    const GetColonias = async (municipioId) => {
        const response = await request(route("colonia.byMunicipio", municipioId), 'GET');
        setDataSelects({
            ...dataSelects,
            colonias: response,
        })
        setData({
            ...data,
            IdMunicipio: municipioId,
            IdColonia: '',
        });
    };

    const coloniasPorCodigoPostal = async () => {
        const response = await dataCodigoPostal(data.CodigoPostal);
        setInfoByPostalCode(response);
        setData({
            ...data,
            IdEstado: response.estado?.idEstado,
            IdMunicipio: response.municipio?.idMunicipio,
        });
    };

    useEffect(() => {
        if (data.CodigoPostal.length === 5)
            coloniasPorCodigoPostal()
        else
            setInfoByPostalCode(locationBody)
    }, [data.CodigoPostal])

    return [
        {
            label: "Nombres",
            input: true,
            type: 'text',
            style: 'col-span-12',
            fieldKey: 'Nombres',
            value: data.Nombres,
            allowAsci: false,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Nombres: e.target.value,
                });
            },
        },
        {
            label: "Apellido Paterno",
            input: true,
            type: 'text',
            fieldKey: 'ApePat',
            style: 'col-span-6',
            value: data.ApePat,
            allowAsci: false,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    ApePat: e.target.value,
                });
            },
        },
        {
            label: "Apellido Materno",
            input: true,
            type: 'text',
            fieldKey: 'ApeMat',
            style: 'col-span-6',
            value: data.ApeMat,
            allowAsci: false,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    ApeMat: e.target.value,
                });
            },
        },
        {
            label: "Calle",
            input: true,
            type: 'text',
            fieldKey: 'Calle',
            style: 'col-span-6',
            value: data.Calle,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Calle: e.target.value,
                });
            },
        },
        {
            label: "No.  casa",
            input: true,
            type: 'text',
            fieldKey: 'CasaNum',
            style: 'col-span-3',
            value: data.CasaNum,
            onChangeFunc: (e) => setData({
                ...data,
                CasaNum: e.target.value,
            })
        },
        {
            label: "C. Postal",
            input: true,
            type: 'text',
            fieldKey: 'CodigoPostal',
            style: 'col-span-3',
            value: data.CodigoPostal,
            onChangeFunc: (e) => {
                const input = e.target.value.replace(/\D/g, "").slice(0, 5); // Solo se permiten dígitos y se limita a 5 caracteres
                setData({
                    ...data,
                    CodigoPostal: input,
                });
            },
        },
        {
            label: "Estado",
            input: true,
            options: dataSelects.estados,
            style: 'col-span-4',
            fieldKey: "IdEstado",
            value: infoByPostalCode.estado?.descripcionEstado || '',
            disabled: true
        },
        {
            label: "Municipio",
            input: true,
            options: dataSelects.municipios,
            style: 'col-span-4',
            fieldKey: "IdMunicipio",
            value: infoByPostalCode.municipio?.descripcionMunicipio || '',
            disabled: true
        },
        {
            label: "Colonia",
            select: true,
            options: infoByPostalCode.colonias,
            value: data.IdColonia || '',
            style: 'col-span-4',
            fieldKey: "IdColonia",
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    IdColonia: e,
                });
            },
            data: 'Colonia_Nombre',
            valueKey: 'Colonia_Id',
        },
        {
            label: "Nacionalidad",
            input: true,
            type: 'text',
            fieldKey: 'Nacionalidad',
            style: 'col-span-4',
            value: data.Nacionalidad,
            allowAsci: false,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Nacionalidad: e.target.value,
                });
            },
        },
        {
            label: "RFC",
            input: true,
            type: 'text',
            fieldKey: 'RFC',
            maxLength: 18,
            style: 'col-span-4',
            value: data.RFC,
            onChangeFunc: (e) => {
                const inputValue = e.target.value.slice(0, 13); // Limitar a 13 caracteres
                setData({ ...data, RFC: inputValue });
            },
        },
        {
            label: "NSS",
            input: true,
            type: 'text',
            fieldKey: 'NSS',
            style: 'col-span-4',
            maxLength: 11,
            value: data.NSS,
            onChangeFunc: (e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= 11) {
                    setData({
                        ...data,
                        NSS: inputValue,
                    });
                }
            },
        },
        {
            label: "Curp",
            input: true,
            type: 'text',
            fieldKey: 'Curp',
            maxLength: 18,
            style: 'col-span-6 sm:max-md:col-span-12',
            value: data.Curp,
            onChangeFunc: (e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= 18) {
                    setData({
                        ...data,
                        Curp: inputValue,
                    });
                }
            },
        },
        {
            label: "F. Nacimiento",
            input: true,
            type: 'date',
            fieldKey: 'FechaNacimiento',
            value: data.FechaNacimiento,
            style: 'col-span-3 sm:max-md:col-span-6',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    FechaNacimiento: e.target.value,
                });
            },
        },
        {
            label: "Sexo",
            fieldKey: "Sexo",
            select: true,
            options: [
                {
                    id: "M",
                    value: "Masculino"
                },
                {
                    id: "F",
                    value: "Femenino"
                },
            ],
            value: data.Sexo,
            style: 'col-span-3 sm:max-md:col-span-6',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Sexo: e,
                });
            },
            data: 'value',
            valueKey: 'id',
        },
        {
            label: "Estado Civil",
            select: true,
            fieldKey: "EstadoCivil",
            options: [
                { id: "Casado", value: "Casado" },
                { id: "Viudo", value: "Viudo" },
                { id: "Soltero", value: "Soltero" }
            ],
            value: data.EstadoCivil,
            style: 'col-span-6',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    EstadoCivil: e,
                });
            },
            data: 'value',
            valueKey: 'id',
        },
        {
            label: "F. Ingreso",
            input: true,
            type: 'date',
            fieldKey: 'FechaIngreso',
            value: data.FechaIngreso,
            style: 'col-span-6',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    FechaIngreso: e.target.value,
                });
            },
        },



        {
            label: "Referencia 1 *",
            input: true,
            type: 'text',
            fieldKey: 'Tel1Owner',
            value: data.Tel1Owner,
            style: 'col-span-6',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Tel1Owner: e.target.value,
                });
            },
        },
        {
            label: "Teléfono 1 *",
            input: true,
            fieldKey: 'Tel1',
            value: data.Tel1,
            style: 'col-span-6',
            onChangeFunc: (e) => {
                const value = e.target.value.substring(0, 10); // Limitar a 10 dígitos
                setData({ ...data, Tel1: value });
            },
        },
        {
            label: "Referencia 2",
            input: true,
            type: 'text',
            fieldKey: 'Tel2Owner',
            style: 'col-span-6',
            value: data.Tel2Owner != 'null' ? data.Tel2Owner : '',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Tel2Owner: e.target.value,
                });
            },
        },
        {
            label: "Teléfono 2",
            input: true,
            fieldKey: 'Tel2',
            value: data.Tel2 != 'null' ? data.Tel2 : '',
            style: 'col-span-6',
            onChangeFunc: (e) => {
                const value = e.target.value.substring(0, 10); // Limitar a 10 dígitos
                setData({ ...data, Tel2: value });
            },
        },
        {
            label: "Referencia 3",
            input: true,
            type: 'text',
            fieldKey: 'Tel3Owner',
            style: 'col-span-6',
            value: data.Tel3Owner != 'null' ? data.Tel3Owner : '',
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    Tel3Owner: e.target.value,
                });
            },
        },
        {
            label: "Teléfono 3",
            input: true,
            fieldKey: 'Tel3',
            style: 'col-span-6',
            value: data.Tel3 != 'null' ? data.Tel3 : '',
            onChangeFunc: (e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                    // Validar que tenga máximo 10 dígitos
                    setData({ ...data, Tel3: value });
                }
            },
        },
    ];
}
