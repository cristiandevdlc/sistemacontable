import { Request } from "@/core/Request";
import React, { useState, useEffect } from "react";
import { intNotaCredito, intPagoState, intPagoTotales } from './intNotasCredito';
import { FieldDrawer } from "@/components/DialogComp";
import moment from "moment";
import { ButtonComp } from "@/components/ButtonComp";
import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import Datatable from "@/components/Datatable";
import { Dialog, Divider } from '@mui/material';
import { moneyFormat, noty } from "@/utils";
import { usePDF } from '@react-pdf/renderer'
import TextInput from "@/components/TextInput";

const NotasCredito = () => {
    const [totales, setTotales] = useState(intPagoTotales)
    const [state, setState] = useState(intPagoState)
    const [data, setData] = useState(intNotaCredito)
    const [changedTax, setChangedTax] = useState([])
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
    const [facturasSinTimbrarCheck, setFacturasSinTimbrarCheck] = useState(false);
    const [clienteInfo, setClienteInfo] = useState([]);
    const [detalle, setDetalle] = useState(false)
    const [estadocorreo, setcorreo] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [pdfState, setPDFState] = usePDF()
    const [newPdf, setNewPdf] = useState(true)

    const resetData = () => {
        setTotales(intPagoTotales)
        setChangedTax([])
        setState(intPagoState)
        setData(intNotaCredito)
        getCatalogs()
    }

    const getCatalogs = async () => {
        const [clienteRes, tipoRelacionesRes, foliosRes, usoCFDIRes] = await Promise.all([
            Request._get(route('clientes.index')),
            Request._get(route('sat/tipo-relaciones.index')),
            Request._get(route('folios.index')),
            Request._get(route('uso-cfdi.index')),
        ]);
        setState(prev => ({
            ...prev,
            TipoRelacion: tipoRelacionesRes,
            folios: foliosRes,
            clientes: clienteRes,
            UsoCFDI: usoCFDIRes
        }))
    }

    const handleChangeCliente = async (val) => {
        await getFacturasCliente(val)
        await getFacturasSinTimbrar(val)
        await getFacturasTimbradas(val)

    }
    const getFacturasCliente = async (value) => {
        const response = await Request._post(route("factura-cliente"), { numeroCliente: value });
        setClienteInfo(response);
    }
    const getFacturasSinTimbrar = async (value) => {
        const facts = await Request._post(route("factura-sin-timbrar"), { numeroCliente: value })
        setData((prev) => ({
            ...prev,
            facturasNoTimbradas: facts
        }))
        return facts
    }
    const getFacturasTimbradas = async (value) => {
        const factsTimb = await Request._post(route("facturas-timbradas"), { numeroCliente: value })
        setData((prev) => ({
            ...prev,
            facturasTimbradas: factsTimb
        }))
        return factsTimb
    }

    useEffect(() => {
        getCatalogs()
    }, []);



    const updateTable = (e) => {
        if (e.newData) {
            const newData = { ...e.oldData, ...e.newData };
            const currentTotal = totales.acreditados[newData.factura_idFactura] ?? 0;
            const importe = parseFloat(newData.importe.replace(/,/g, ''));
            const saldo = parseFloat(newData.saldo.replace(/,/g, ''));
            if (importe > saldo) {
                noty('El valor excede el saldo disponible.', 'error');
                handleResetTabe(e);
                return
            }
            if (Number.isNaN(importe)) {
                noty('El valor tiene que ser un numero', 'error')
                handleResetTabe(e);
                return
            }
            const newTotales = {
                ...totales.acreditados,
                [newData.factura_idFactura]: importe
            }
            const sumTutales = Object.values(newTotales).reduce((total, valor) => total + valor, 0);
            const resto = (saldo - importe).toFixed(2);


            if (importe < 0) {
                noty('Monto por acreditar superado.', 'error');
                handleResetTabe(e);
                return
            }
            setFacturas(prevFacturas => {
                const existingIndex = prevFacturas.findIndex(item => item.factura_idFactura === newData.factura_idFactura);
                if (existingIndex !== -1) {
                    const updatedClientInfo = [...prevFacturas];
                    updatedClientInfo[existingIndex] = {
                        ...updatedClientInfo[existingIndex],
                        ...newData,
                        resto: resto,
                    };
                    return updatedClientInfo;
                } else {
                    return [...prevFacturas, { ...newData, resto: resto }];
                }
            });
            return <>{moneyFormat(resto)}</>;
        }
    }

    const handleChangeFacturasSinTimbrar = (e) => {
        const isChecked = e.target.checked;
        setFacturasSinTimbrarCheck(isChecked);
        getFacturasCliente()
        setFacturasSeleccionadas([]);
        if (isChecked) {
            setFacturas([]);
            noty('Se han eliminado las facturas timbradas de la tabla.', 'muted');
        } else {
            setFacturas([]);
            noty('Se han eliminado las facturas sin timbrar de la tabla.', 'muted');
        }
    };
    const agregarFactura = () => {
        if (facturasSeleccionadas.length === 0) {
            noty('Por favor selecciona al menos una factura para agregar.', 'warning');
            return;
        }
        let algunaFacturaAgregada = false;
        facturasSeleccionadas.forEach(factura => {
            if (facturas.some(item => item.FolioSerie === factura)) {
                noty(`La factura ${factura} ya está en la tabla.`, 'warning');
                return;
            }
            const facturaSeleccionada = facturasSinTimbrarCheck ?
                data.facturasNoTimbradas.find(item => item.FolioSerie === factura) :
                data.facturasTimbradas.find(item => item.FolioSerie === factura);

            if (facturaSeleccionada) {
                setFacturas(prevClienteInfo => [...prevClienteInfo, facturaSeleccionada]);
                algunaFacturaAgregada = true;
            }
        });
        if (algunaFacturaAgregada) {
            noty('Se han agregado las facturas a la tabla.', 'info');
        }
        setFacturasSeleccionadas([]);
    };

    const CorreoFactura = async () => {
        setDetalle(false);
        setState({ ...state, loading: true });
        try {
            const response = await fetch(route('CorreoFactura'), { method: "POST", body: JSON.stringify({ Folio: data.folio, Correo: data.correos, Tipo: 'NotasCredito' }), headers: { "Content-Type": "application/json" } });
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
        const response = await fetch(route('NotasCreditoXml'), { method: "POST", body: JSON.stringify({ data: facturas, cliente: data.noCliente, tipo: "NotasCredito", timbradas: facturasSinTimbrarCheck, fechaMovimiento: data.fechaMovimiento, observaciones: data.observaciones, tipoRelacion: data.tipoRelacion }), headers: { "Content-Type": "application/json" } });
        if (!response.ok) { throw new Error(`Error: ${response.statusText}`); }
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const isPDF = contentDispositionHeader && contentDispositionHeader.includes('pdf');
        if (isPDF) {
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'),
                { href: url, download: `NotasCredito${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            const datosAdicionales = response.headers.get('X-Datos-Adicionales');
            if (datosAdicionales) {
                const datos = JSON.parse(datosAdicionales);
                setData({
                    saldoTotal: 0,
                    fechaMovimiento: '',
                    noCliente: '',
                    serie: '',
                    folio: datos.notasCredito_idNotasCredito,
                    tipoRelacion: '',
                    facts: '',
                    facturasNoTimbradas: '',
                    facturasTimbradas: '',
                    UsoCFDISAT: '',
                    observaciones: '',
                });
                setFacturas([])
                getCatalogs()
            }

            new Noty({ text: "Descargando diario de ventas", type: "success", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        } else {
            const dataMun = await response.json(); new Noty({ text: dataMun.error, type: "error", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        }
        setDetalle(true);
    }

    return (
        <div className='relative h-[100%] pb-4 px-3 -mt-4'>
            <div className='flex relative gap-3 sm:flex-col md:flex-row h-[90%]'>
                <div className='flex flex-col gap-2 pt-4 min-w-[300px]'>
                    {/* inputs */}
                    <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                        <h1>Buscar cliente</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Cliente',
                                    select: true,
                                    fieldKey: 'Cliente',
                                    value: data?.noCliente,
                                    options: state.clientes.map(c => ({
                                        ...c,
                                        cliente_nombrecomercial: `${c.cliente_idCliente} - ${c.cliente_nombrecomercial}`
                                    })),
                                    data: 'cliente_nombrecomercial',
                                    valueKey: 'cliente_idCliente',
                                    onChangeFunc: (e) => {
                                        e && handleChangeCliente(e)
                                        setData(prev => ({
                                            ...prev,
                                            noCliente: e
                                        }))
                                    }
                                },
                            ]}
                        />
                    </div>
                    <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                        <h1>CFDI, Serie y Folio</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: "Uso de CFDI",
                                    input: false,
                                    select: true,
                                    options: Array.isArray(state?.UsoCFDI) ? state?.UsoCFDI.filter(option => option.usoCfdiSAT_clave === "G02") : [],
                                    value: data?.UsoCFDISAT,
                                    onChangeFunc: (newValue) =>
                                        setData({
                                            ...data,
                                            UsoCFDISAT: newValue,
                                        }),
                                    data: "usoCfdiSAT_descripcion",
                                    valueKey: "usoCfdiSAT_id",
                                },

                                {
                                    label: "Tipo Relación",
                                    input: false,
                                    select: true,
                                    options: state?.TipoRelacion,
                                    value: data?.tipoRelacion,
                                    onChangeFunc: (newValue) =>
                                        setData({
                                            ...data,
                                            tipoRelacion: newValue,
                                        }),
                                    data: "catalogoTipoRelacionSAT_descripcion",
                                    valueKey: "catalogoTipoRelacionSAT_id",
                                },
                                {
                                    label: 'Serie y Folio',
                                    select: true,
                                    fieldKey: 'Cliente',
                                    value: data?.serie,
                                    options: state.folios.filter(c => ['NCR', 'ncr', 'Ncr'].includes(c.folios_serie)).map(c => ({
                                        ...c,
                                        folios_serie: `${c.folios_serie} - ${parseInt(c.folios_numeroFolio) + 1}`
                                    })),
                                    data: 'folios_serie',
                                    valueKey: 'folios_idFolios',
                                    onChangeFunc: (e) => {
                                        setData({
                                            ...data,
                                            serie: e,
                                            folio: e
                                        })
                                    }
                                },

                                {
                                    label: 'Fecha',
                                    input: true,
                                    type: 'date',
                                    min: moment().subtract(3, 'days').format('YYYY-MM-DD'),
                                    value: data?.fechaMovimiento,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        fechaMovimiento: e.target.value,
                                        pago_idCliente: ''
                                    })
                                },
                                {
                                    label: "Facturas sin timbrar",
                                    check: true,
                                    fieldKey: 'facturasSinTimbrar',
                                    checked: facturasSinTimbrarCheck,
                                    onChangeFunc: handleChangeFacturasSinTimbrar
                                }
                            ]}
                        />
                    </div>

                    <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                        <h1>Facturas</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Facturas',
                                    select: true,
                                    fieldKey: 'facturas',
                                    value: data?.facts,
                                    options: facturasSinTimbrarCheck ? data.facturasNoTimbradas : data.facturasTimbradas,
                                    data: 'FolioSerie',
                                    valueKey: 'FolioSerie',
                                    onChangeFunc: (e) => {
                                        const folioFiscalSeleccionado = e;
                                        if (facturasSeleccionadas.includes(folioFiscalSeleccionado)) {
                                            setFacturasSeleccionadas(facturasSeleccionadas.filter(folio => folio !== folioFiscalSeleccionado));
                                        } else {
                                            setFacturasSeleccionadas([...facturasSeleccionadas, folioFiscalSeleccionado]);
                                        }
                                        setData({
                                            ...data,
                                            facts: e,
                                            facturas: e,
                                            folioFiscalSeleccionado: e
                                        });
                                    },
                                }
                            ]}
                        />
                        <br />
                        <ButtonComp
                            color="#1B2654"

                            onClick={agregarFactura}
                            label="Agregar Factura"
                            className="!mt-[0] !text-[14px]"
                        />
                        <br />
                        <ButtonComp
                            color="#FF0000"
                            onClick={() => {

                                setData({ ...data, noCliente: '', facts: '', facturasNoTimbradas: '', facturasTimbradas: '' })
                                setFacturas([]);
                                noty('Todas las facturas han sido eliminadas.', 'muted');
                            }}
                            label="Limpiar Facturas"
                            className="!mt-[0] !text-[14px]"
                        />
                    </div>
                </div>

                {/* información clientes */}
                <div className='flex flex-col gap-2 pt-4 min-w-[300px]'>
                    <div className='grid grid-cols gap-4'>
                        <div className='flex !text-[12px] flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                            <div className='flex justify-between'>
                                <span>Nombre:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_nombrecomercial}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Calle:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_calle}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Colonia:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].colonia}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>No Exterior:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_numeroExterior}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>País:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].pais}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>RFC:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_rfc}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Teléfono:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_telefono}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Ciudad:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_ciudad}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>CP:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].cliente_codigoPostal}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Forma de Pago:</span>
                                <span>{clienteInfo && clienteInfo.length > 0 && clienteInfo[0].formaPagoSAT}</span>
                            </div>
                        </div>
                        <textarea
                            id="OrderNotes"
                            className="mt-4 w-full rounded-lg border-gray-300 align-top shadow-sm sm:text-sm max-h-[70px]"
                            rows="4"
                            maxLength="250"
                            placeholder="Observaciones"
                            value={data.observaciones}
                            onChange={(e) => setData({ ...data, observaciones: e.target.value })}>
                        </textarea>
                        <div className='flex flex-col shadow-md bg-[#ffffff] border-2 p-4 rounded-xl text-white gap-2'>


                            {data.noCliente && !newPdf ? (
                                <a
                                    href={pdfState.url}
                                    className={`grid h-[48px] w-full bg-pdf-color text-white rounded-lg text-center content-center cursor-pointer non-selectable`}
                                > Imprimir PDF</a>
                            ) : (
                                <button
                                    className={`h-[48px] w-full ${((data.noCliente && pdfState) || pdfState?.loading) ? `bg-pdf-color` : `bg-disabled-color`} text-white rounded-lg`}
                                    disabled={data.noCliente && pdfState ? false : true}
                                    onClick={GenerarYEnviarXML}
                                >
                                    Imprimir PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative col-span-10 mx-5  mt-4">
                    {facturas ? (
                        <Datatable
                            searcher={false}
                            virtual={true}
                            height={'200%'}
                            data={facturas}
                            handleRowUpdating={updateTable}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={[
                                { header: "Factura", width: '80%', cell: (eprops) => <>{eprops.item.FolioSerie}</> },
                                { header: "Saldo", width: '50%', cell: (eprops) => `$${moneyFormat(eprops.item.saldo)}` },
                                { header: "Importe", width: '50%', accessor: 'importe' },
                                { header: "Resto", width: '50%', accessor: 'resto' },
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
                        <h1 className="text-3xl font-extrabold sm:text-4xl"> Se ha creado con éxito la <strong className="font-extrabold text-orange-700 sm:block">Nota de Crédito</strong> </h1>

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

export default NotasCredito