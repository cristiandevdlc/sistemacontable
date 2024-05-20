import React, { useState, useEffect, } from "react";
import { FieldDrawer } from "@/components/DialogComp";
import Datatable from "../../../../components/Datatable";
import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import { Request } from "@/core/Request";
import TextInput from "@/components/TextInput";

import EmailIcon from '@mui/icons-material/Email';
import { Button, Dialog, Checkbox, Chip, Tooltip, Divider } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print';
import { usePDF } from '@react-pdf/renderer'
import LoadingDiv from '@/components/LoadingDiv'
import { intPagoData, intPagoState, intPagoTotales } from './intPagoCartera';
import moment from "moment";

const TimbradoPagos = () => {
    const [loadingState, setLoadingState] = useState({ pdf: false })
    const [state, setState] = useState(intPagoState)
    const [data, setData] = useState(intPagoData)
    const [selected, setSelected] = useState([]);
    const [estadocorreo, setcorreo] = useState(false);
    const [pdfState, setPDFState] = usePDF()
    const [newPdf, setNewPdf] = useState(true)
    const [detalle, setDetalle] = useState(false)
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const minDate = threeDaysAgo.toISOString().split('T')[0];
    const onSelect = ({ selectedRowKeys }) => setSelected(selectedRowKeys)


    const getCatalogs = async () => {
        const [clienteRes,] = await Promise.all([
            Request._get(route('clientes.index')),
        ]);
        setState(prev => ({
            ...prev,
            clientes: clienteRes,
        }))
    }
    const CorreoFactura = async () => {
        setDetalle(false);
        setState({ ...state, loading: true });
        try {
            const response = await fetch(route('CorreoFactura'), { method: "POST", body: JSON.stringify({ Folio: data.folio, Correo: data.correos, Tipo: 'PAGO' }), headers: { "Content-Type": "application/json" } });
            if (response.ok) {
                setState({ ...state, loading: false });

                showNotification("El correo se envió exitosamente.", 'success', 'metroui', 'bottomRight', 2000);
            } else {
                showNotification("Fallo al enviar correo", 'error', 'metroui', 'bottomRight', 2000);
            }
        } catch (error) {
            console.error(error.message);
        }
        setData({ correos: '' });

    };

    async function GenerarYEnviarXML() {
        const response = await fetch(route('PagosXml'), { method: "POST", body: JSON.stringify({ data: selected, cliente: data.pago_idCliente, }), headers: { "Content-Type": "application/json" } });
        if (!response.ok) { throw new Error(`Error: ${response.statusText}`); }
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const isPDF = contentDispositionHeader && contentDispositionHeader.includes('pdf');
        if (isPDF) {
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'),
                { href: url, download: `PagosTimbrado${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            const datosAdicionales = response.headers.get('X-Datos-Adicionales');
            if (datosAdicionales) {
                const datos = JSON.parse(datosAdicionales);
                setData({ ...data, folio: datos.PagoTimbrado_idPagoTimbrado });
            }
            new Noty({ text: "Descargando diario de ventas", type: "success", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        } else {
            const dataMun = await response.json(); new Noty({ text: dataMun.error, type: "error", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        }
        setDetalle(true);
        setSelected([])
    }

    useEffect(() => {
        getCatalogs()
    }, []);

    const handleChangeCliente = async (val) => {
        await getFacturasCliente(val)
    }

    const getFacturasCliente = async (value) => {
        const facturas = (await Request._post(
            route("pagos-timbrados"),
            {
                cliente: value,
                fechaMov: data.fechaMovimiento
            }
        )).map(f => ({ ...f, desc: 0 }))

        setState((prev) => ({ ...prev, facturas: facturas }))
        setData(prev => ({
            ...prev,
            saldoTotal: facturas.map(f => parseFloat(f.saldo)).reduce((a, b) => a + b, 0)
        }))
    }
    return (
        <div className='relative h-[100%] pb-4 px-3 -mt-4'>
            <div className='flex relative gap-3 sm:flex-col md:flex-row h-[90%]'>
                <div className='flex flex-col gap-2 pt-4 min-w-[20%]'>
                    <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                        <h1>Buscar Pago</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Fecha movimiento',
                                    input: true,
                                    type: 'date',
                                    min: moment().subtract(3, 'days').format('YYYY-MM-DD'),
                                    value: data.fechaMovimiento,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        fechaMovimiento: e.target.value,
                                        pago_idCliente: ''
                                    })
                                },

                                {
                                    label: 'Cliente',
                                    select: true,
                                    fieldKey: 'Cliente',
                                    value: data.pago_idCliente,
                                    options: state.clientes.map(c => ({
                                        ...c,
                                        cliente_nombrecomercial: `${c.cliente_idCliente} - ${c.cliente_nombrecomercial}`
                                    })),
                                    data: 'cliente_nombrecomercial',
                                    valueKey: 'cliente_idCliente',
                                    onChangeFunc: (e, o) => {
                                        e && handleChangeCliente(e)
                                        setData(prev => ({
                                            ...prev,
                                            pago_idCliente: e,
                                            pago_idFormasPago: '',
                                            pago_cuentaCliente: '',
                                            pago_idCuentaBancoCliente: '',
                                            clienteObjeto: o,
                                            noCliente: e
                                        }))
                                    }
                                },
                            ]}
                        />
                    </div>
                    <div className='flex flex-col shadow-md bg-[#ffffff] border-2 p-4 rounded-xl text-white gap-2'>
                        {data.pago_idCliente && !newPdf ? (
                            <a
                                href={pdfState.url}
                                className={`grid h-[48px] w-full bg-pdf-color text-white rounded-lg text-center content-center cursor-pointer non-selectable`}
                            > Imprimir PDF</a>
                        ) : (
                            <button
                                className={`h-[48px] w-full ${((data.pago_idCliente && pdfState) || pdfState?.loading) ? `bg-pdf-color` : `bg-disabled-color`} text-white rounded-lg`}
                                disabled={data.pago_idCliente && pdfState ? false : true}
                                onClick={GenerarYEnviarXML}
                            >
                                <PrintIcon />
                                {loadingState.pdf ? (
                                    <div className='h-full rounded-lg bg-[#c0c0c03a]'>
                                        <LoadingDiv size={25} color='inherit' />
                                    </div>
                                ) : "Imprimir PDF"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {data.pago_idCliente ? (
                        <Datatable
                            searcher={false}
                            virtual={true}
                            height={'200%'}
                            data={state.facturas}
                            selection={'multiple'}
                            selectedData={selected}
                            selectionFunc={onSelect}
                            columns={[
                                { header: "Folio Pago", width: '22%', cell: (eprops) => <>{eprops.item.pago_idPago}</> },
                                { header: "Pago Fecha", width: '22%', cell: (eprops) => <>{new Date(eprops.item.pago_fecha).formatMXNoTime()}</> },
                                { header: "Forma de pago", width: '22%', cell: (eprops) => <>{eprops.item.formaPago_descripcion}</> },
                                { header: "Cuenta", width: '22%', cell: (eprops) => <>{eprops.item?.pago_cuentaCliente}</> },
                                { header: "Importe", width: '22%', cell: (eprops) => <>${eprops.item.pago_importe}</> },
                            ]}
                        />
                    ) : (
                        <>
                            <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={detalle} onClose={() => setDetalle(false)} maxWidth="lg">
                <div className="mx-auto max-w-screen-xl px-4 py-10 lg:flex  lg:items-center">
                    <div className="mx-auto max-w-xl text-center">
                        <h1 className="text-3xl font-extrabold sm:text-4xl"> Se ha creado con éxito el <strong className="font-extrabold text-orange-700 sm:block">complemento de pago</strong> </h1>

                        <div className="relative flex" style={{ width: '100%' }}>
                            {estadocorreo == false && (<TextInput label="Correo Electronico" type="text" value={data.correos || ''} onChange={(e) => { setData({ ...data, correos: e.target.value }); }} />)}
                            {estadocorreo == true && (
                                <SelectComp
                                    label="Correos"
                                    options={state.ClientEmail}
                                    value={data.correos || ''}
                                    data="correoCliente_correo"
                                    valueKey="correoCliente_correo"
                                    onChangeFunc={(newValue) => {
                                        setData({ ...data, correos: newValue });
                                    }}
                                />
                            )}
                            {state.ClientEmail.length > 0 && (<Tooltip title={estadocorreo ? "Escribir correo" : "Seleccionar correo"}> <Button className="bg-transparent text-white h-8 w-8 absolute right-18 top-7 mt-1 mr-2" onClick={() => { setcorreo(!estadocorreo); }} > <KeyboardDoubleArrowRightIcon /> </Button> </Tooltip>)}
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button className="block w-full rounded bg-orange-600 px-12 py-3 text-sm font-medium text-white shadow  sm:w-auto" onClick={CorreoFactura}> Enviar correo </button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div >
    )
}

function showNotification(text, type, theme, layout, timeout) {
    new Noty({
        text: text,
        type: type,
        theme: theme,
        layout: layout,
        timeout: timeout
    }).show();

}
export default TimbradoPagos