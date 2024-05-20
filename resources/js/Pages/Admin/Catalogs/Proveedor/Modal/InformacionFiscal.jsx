import '../../../../../../sass/Personas/_documentacion.scss'
import { useRef, useState, useEffect } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import { Button } from "@mui/material";

export default function InformacionFiscal(data, setData, dataSelects, setDataSelects) {

    return [
        {
            label: "RFC",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_rfc',
            value: data.proveedor_rfc,
            onChangeFunc: (e) => {
                if (e.target.value.length < 14)
                    setData({
                        ...data,
                        proveedor_rfc: e.target.value,
                    });
            },
        },
        {
            label: "Banco",
            select: true,
            options: dataSelects.bancos,
            value: data.proveedor_idBanco,
            onChangeFunc: (newValue) =>
                setData({
                    ...data,
                    proveedor_idBanco: newValue,
                }),
            data: "banco_nombreBanco",
            valueKey: "banco_idBanco",
        },
        {
            label: "Proveedor Clabe",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_clabe',
            value: data.proveedor_clabe,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_clabe: e.target.value,
                });
            },
        },
        {
            label: "No. Cuenta",
            input: true,
            type: 'text',
            fieldKey: 'proveedor_cuenta',
            value: data.proveedor_cuenta,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_cuenta: e.target.value,
                });
            },
        },
        {
            label: "Correo",
            input: true,
            type: 'text',
            value: data.proveedor_correo,
            onChangeFunc: (e) => {
                setData({
                    ...data,
                    proveedor_correo: e.target.value,
                });
            },
            fieldKey: 'proveedor_correo',
        },

    ];
}
