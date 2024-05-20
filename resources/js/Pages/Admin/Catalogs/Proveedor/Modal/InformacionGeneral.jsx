import request, { locationBody } from "@/utils";
import { useState, useEffect, useRef } from "react";
import '../../../../../../sass/Empresas/_empresas.scss'
import { Button } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";

export default function InformacionGeneral(data, setData, dataSelects, infoByPostalCode, setInfoByPostalCode, coloniaGetter) {
    const coloniaCpHandler = async (input) => {
        const newColoniaData = await coloniaGetter(input)
        setData({ ...data, ...newColoniaData, proveedor_cp: input })
    }

    return [
        {
            label: "Proveedor Razón Social",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_razonsocial',
            style: 'col-span-2',
            value: data.proveedor_razonsocial,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_razonsocial: e.target.value,
                });
            },
        },
        {
            label: "Proveedor Razón Comercial",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'proveedor_nombrecomercial',
            value: data.proveedor_nombrecomercial,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_nombrecomercial: e.target.value,
                });
            },
        },
        {
            label: "No. Exterior",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'proveedor_numero',
            value: data.proveedor_numero,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_numero: e.target.value,
                });
            },
        },
        {
            label: "Calle",
            input: true,
            type: 'text',
            style: 'col-span-2',
            fieldKey: 'proveedor_calle',
            value: data.proveedor_calle,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_calle: e.target.value,
                });
            },
        },
        {
            label: "Codigo Postal",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_cp',
            style: 'col-span-2',
            value: data.proveedor_cp || '',
            onChangeFunc: (e) => {
                const input = e.target.value.replace(/\D/g, "").slice(0, 5);
                if (input.length === 5) {
                    coloniaCpHandler(input)
                } else {
                    setData({ ...data, proveedor_cp: input })
                    setInfoByPostalCode(locationBody)
                }
            }
        },
        {
            label: "País",
            input: true,
            type: 'text',
            disabled: true,
            fieldKey: 'País',
            style: 'col-span-2',
            value: infoByPostalCode.pais?.descripcionPais || '',
            onChangeFunc: () => { setData({ ...data, proveedor_idPais: infoByPostalCode.pais?.idPais }) }
        },
        {
            label: "Estado",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_idEstado',
            style: 'col-span-2',
            disabled: true,
            value: infoByPostalCode.estado?.descripcionEstado || '',
            onChangeFunc: () => { setData({ ...data, proveedor_idEstado: infoByPostalCode.estado?.idEstado }) }
        },
        {
            label: "Colonia",
            select: true,
            options: infoByPostalCode.colonias || [],
            value: data.proveedor_idColonia,
            // value: data.proveedor_idColonia || '',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, proveedor_idColonia: e }),
            data: 'Colonia_Nombre',
            valueKey: 'Colonia_Id',
            fieldKey: 'proveedor_idColonia',
        },
        // {
        //     label: "Empresa",
        //     select: true,
        //     options: dataSelects.empresas || [],
        //     value: data.proveedor_idEmpresa || '',
        //     style: 'col-span-2',
        //     onChangeFunc: (e) => setData({ ...data, proveedor_idEmpresa: e }),
        //     data: 'empresa_razonComercial',
        //     valueKey: 'empresa_idEmpresa',
        //     fieldKey: 'proveedor_idEmpresa',
        // },
        {
            label: "Giro Comercial",
            select: true,
            options: dataSelects.captacion || [],
            value: data.proveedor_idTipoCaptacion || '',
            style: 'col-span-2',
            onChangeFunc: (e) => setData({ ...data, proveedor_idTipoCaptacion: e }),
            data: 'tipoCaptacion_tipo',
            valueKey: 'tipoCaptacion_idTipoCaptacion',
            fieldKey: 'proveedor_idTipoCaptacion',
        },
        {
            label: "Teléfono",
            input: true,
            type: 'text',
            style: 'col-span-1',
            fieldKey: 'proveedor_telefono',
            value: data.proveedor_telefono,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_telefono: e.target.value,
                });
            },
        },
        {
            label: "Activo",
            check: true,
            fieldKey: 'proveedor_estatus',
            checked: data.proveedor_estatus,
            labelPlacement: 'end',
            style: 'col-span-1',
            onChangeFunc: (e) => setData({
                ...data,
                proveedor_estatus: e.target.checked ? "1" : "0",
            })
        },
    ];
}
