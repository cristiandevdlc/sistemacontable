import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import { useEffect, useState } from "react";
import request, { noty } from "@/utils";
import { Divider } from "@mui/material";

export default function CreditosDescuentosFormulario({ data, setData }) {
    const [dataChanged, setDataChanged] = useState({})


    const submitCreditDiscount = async (e) => {
        e.preventDefault();
        const response = await request(route('credito-descuento.store'), "POST", {
            cliente_idCliente: data.cliente_idCliente,
            dataChanged: dataChanged,
            data: data,
        }, { enabled: true })

        if (response.discountRequest) noty('Solicitud de descuento realizada exitosamente')
        else if (response.creditRequest) noty('Solicitud de credito realizada exitosamente')
        else noty('No se ralizaron cambios en los campos', 'warning')
    };

    useEffect(() => {
        setDataChanged({})
    }, []);

    return <div className="grid grid-cols-6 gap-x-4">
        <FieldDrawer
            fields={[
                {
                    label: "Descuentos",
                    custom: true,
                    style: 'col-span-full',
                    customItem: ({ label }) => <Divider textAlign="left">{label}</Divider>
                },
                {
                    label: "Descuento litros",
                    input: true,
                    type: 'decimal',
                    style: 'col-span-4',
                    customIcon: 'attach_money',
                    fieldKey: 'cliente_descuento',
                    value: data.cliente_descuento || '',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_descuento: e.target.value })
                        setDataChanged({ ...dataChanged, cliente_descuento: e.target.value })

                    }
                },
                {
                    label: "100 Litros",
                    check: true,
                    fieldKey: 'cliente_cienLitros',
                    checked: data.cliente_cienLitros,
                    style: 'justify-start col-span-2 mt-4',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_cienLitros: e.target.checked ? "1" : "0" })
                        setDataChanged({ ...dataChanged, cliente_cienLitros: e.target.checked ? "1" : "0" })
                    }
                },
                {
                    label: "Descuento Kilos",
                    input: true,
                    type: 'decimal',
                    style: 'col-span-4',
                    customIcon: 'attach_money',
                    fieldKey: 'cliente_descuentoTanque',
                    value: data.cliente_descuentoTanque || '',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_descuentoTanque: e.target.value })
                        setDataChanged({ ...dataChanged, cliente_descuentoTanque: e.target.value })
                    }
                },
                {
                    label: "Por Tanque",
                    check: true,
                    fieldKey: 'cliente_dscportanque',
                    checked: data.cliente_dscportanque,
                    style: 'justify-start col-span-2 mt-4',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_dscportanque: e.target.checked ? "1" : "0" })
                        setDataChanged({ ...dataChanged, cliente_dscportanque: e.target.checked ? "1" : "0" })
                    }
                },
                {
                    label: "Descuentos activos",
                    check: true,
                    labelPlacement: "",
                    fieldKey: 'cliente_tieneDescuento',
                    checked: data.cliente_tieneDescuento,
                    style: 'justify-center col-span-full mt-3',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_tieneDescuento: e.target.checked ? "1" : "0" })
                        setDataChanged({ ...dataChanged, cliente_tieneDescuento: e.target.checked ? "1" : "0" })
                    }
                },
                {
                    label: "Credito",
                    custom: true,
                    style: 'col-span-full mt-5',
                    customItem: ({ label }) => <Divider textAlign="left">{label}</Divider>
                },
                {
                    label: "Limite del credito",
                    input: true,
                    type: 'decimal',
                    style: 'col-span-4',
                    customIcon: 'attach_money',
                    fieldKey: 'cliente_limiteCredito',
                    value: data.cliente_limiteCredito || '',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_limiteCredito: e.target.value })
                        setDataChanged({ ...dataChanged, cliente_limiteCredito: e.target.value })

                    }
                },
                {
                    label: "Dias de credito",
                    input: true,
                    type: 'number',
                    style: 'col-span-2',
                    fieldKey: 'cliente_diasCredito',
                    value: data.cliente_diasCredito || '',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_diasCredito: e.target.value })
                        setDataChanged({ ...dataChanged, cliente_diasCredito: e.target.value })

                    }
                },
                {
                    label: "Credito activo",
                    check: true,
                    labelPlacement: "",
                    fieldKey: 'cliente_tieneCredito',
                    checked: data.cliente_tieneCredito,
                    style: 'justify-center col-span-full mt-3',
                    onChangeFunc: (e) => {
                        setData({ ...data, cliente_tieneCredito: e.target.checked ? "1" : "0" })
                        setDataChanged({ ...dataChanged, cliente_tieneCredito: e.target.checked ? "1" : "0" })
                    }
                },
                {
                    custom: true,
                    style: "col-span-full",
                    label: "Realizar solicitud",
                    customItem: ({ label }) => {
                        return <>
                            <ButtonComp onClick={(e) => submitCreditDiscount(e)} label={label} />
                        </>
                    }
                }
            ]}
        />
    </div>;
}
