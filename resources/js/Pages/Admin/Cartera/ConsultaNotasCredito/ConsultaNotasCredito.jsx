import { useState } from "react"
import { intConsultaNotasCredito, intStateConsultasNCR } from './intConsultaNotasCredito';
import { FieldDrawer } from "@/components/DialogComp";
import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import { ButtonComp } from "@/components/ButtonComp";
import { Link } from 'react-router-dom';
import { Request } from "@/core/Request";
import Datatable from "@/components/Datatable";
import Checkbox from '@mui/material/Checkbox';
import { Chip } from "@mui/material";
import { Dialog } from "@mui/material";
import { useEffect } from "react";
import TextInput from "@/components/TextInput";


export default function ConsultaNotasCredito() {
    const [state, setState] = useState(intStateConsultasNCR)
    const [data, setData] = useState(intConsultaNotasCredito)
    const [selected, setSelected] = useState([]);
    const [detalle, setDetalle] = useState(false)
    const [ClientEmail, setClientEmails] = useState([]);
    const [estadocorreo, setcorreo] = useState(false);

    const onSelect = ({ selectedRowKeys }) => setSelected(selectedRowKeys)

    const getNotasCredito = async () => setState({
        ...state,
        NCR: await Request._post(route('facturas-ncr'), { FechaInicio: data.FechaInicio, FechaFinal: data.FechaFinal })
    })
    const areButtonsEnabled = selected.length > 0;
    const Abrirmodalcorreo = async () => { setDetalle(true); }
    const CorreoFactura = async () => {
        setState({ ...state, loading: true });
        // console.log({ Folio: selected[0].idNCR, })
        const response = await fetch(route('CorreoFactura'), { method: "POST", body: JSON.stringify({ Folio: selected[0].idNCR, correo: data.correo, Tipo: "NotasCredito" }), headers: { "Content-Type": "application/json" } });
        if (response.ok) {
            setState({ ...state, loading: false });
            showNotification("El correo se envió exitosamente.", 'success', 'metroui', 'bottomRight', 2000);
            setDetalle(false);
        } else {
            showNotification("Fallo al enviar correo", 'error', 'metroui', 'bottomRight', 2000);
        }
    };

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {state.comp && <LoadingDiv />}
            {!state.comp &&
                <>
                    <section className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'FECHA INICIO',
                                    input: true,
                                    type: 'date',
                                    value: data.FechaInicio,
                                    onChangeFunc: (e, o) => {
                                        setData({
                                            ...data,
                                            FechaInicio: e.target.value
                                        })
                                        getNotasCredito(e)
                                    }
                                },
                                {
                                    label: 'FECHA FINAL',
                                    input: true,
                                    type: 'date',
                                    value: data.FechaFinal,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        FechaFinal: e.target.value
                                    })
                                },
                                {
                                    custom: true,
                                    customItem: () => {
                                        return (
                                            <div className='flex flex-col gap-4 pt-3'>
                                                <Link to="/datos-cliente-ncr" state={{ item: selected }}>

                                                    <button className={`h-[48px] w-full !mt-[0] !text-[14px] ${areButtonsEnabled ? 'bg-excel-color' : 'bg-gray-600'} text-white rounded-lg`} disabled={!areButtonsEnabled}>
                                                        Consultar Nota de Crédito
                                                    </button>
                                                </Link>
                                                <button className={`h-[48px] w-full !mt-[0] !text-[14px] ${areButtonsEnabled ? 'bg-primary-color' : 'bg-gray-600'} text-white rounded-lg`} onClick={Abrirmodalcorreo} disabled={!areButtonsEnabled}>
                                                    Enviar Nota de Crédito
                                                </button>
                                            </div>
                                        )
                                    }
                                }
                            ]}
                        />

                    </section>
                    <section className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4'>
                        {state.info ? (
                            <LoadingDiv />
                        ) : (state.NCR ? (
                            <>
                                <div className="w-full h-[90vh] monitor-table">
                                    <Datatable

                                        searcher={false}
                                        height={'200%'}
                                        selection='single'
                                        selectedData={selected}
                                        selectionFunc={onSelect}
                                        virtual={true}
                                        data={state.NCR}
                                        columns={[
                                            { header: "Fecha", cell: (eprops) => <>{new Date(eprops.item.Fecha).formatMXNoTime()}</> },
                                            { header: "Folio", cell: (eprops) => <>{eprops.item.Folio}</> },
                                            { header: "Cliente", cell: (eprops) => <>{eprops.item.ClienteNombre}</> },
                                            { header: "Impresa", cell: (eprops) => <Checkbox checked={eprops.item.Impreso === '1'} /> },
                                            { header: "Enviada", cell: (eprops) => <Checkbox checked={eprops.item.Enviado === '1'} /> },
                                            { header: "Timbrada", cell: (eprops) => <Checkbox checked={eprops.item.Timbrado === '1'} /> },
                                            {
                                                header: 'Estatus',
                                                accessor: 'Estatus',
                                                cell: eprops => eprops.item.Estatus === '1' ?
                                                    (<Checkbox checked={true} />) :
                                                    (<Checkbox checked={false} />)
                                            },
                                            { header: "Observaciones", cell: (eprops) => <>{eprops.item.Observaciones}</> },
                                            { header: "Tipo", cell: (eprops) => <>{eprops.item.FormaPago}</> },
                                            { header: "Importe", cell: (eprops) => <>{'$' + parseFloat(eprops.item.Subtotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</> },
                                            { header: "Iva", cell: (eprops) => <>{'$' + parseFloat(eprops.item.Iva).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</> },
                                            { header: "Total", cell: (eprops) => <>{'$' + parseFloat(eprops.item.Total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</> },
                                            { header: "Correo", cell: (eprops) => <>{eprops.item.CorreosCliente}</> },
                                            { header: "Usuario", cell: (eprops) => <>{eprops.item.NombreUsuario}</> },
                                        ]}

                                    />
                                </div>

                            </>
                        ) : (
                            <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        ))
                        }
                    </section>

                    <Dialog open={detalle} style={{ height: '100%' }} onClose={() => { setDetalle(false); }} maxWidth="lg" >

                        <div class="mx-auto max-w-screen-xl px-4 py-10 lg:flex  lg:items-center">
                            <div class="mx-auto max-w-xl text-center">
                                <h1 class="text-3xl font-extrabold sm:text-4xl">Se ha creado la Nota de Credito Correctamente</h1>

                                <div className="relative flex" style={{ width: '100%' }}>
                                    {estadocorreo == false && (<TextInput label="Correo Electronico" type="text" value={data.correo} onChange={(e) => { setData({ ...data, correo: e.target.value }); }} />)}
                                    {estadocorreo == true && (
                                        <SelectComp
                                            label="Correos"
                                            options={ClientEmail}
                                            value={facturacion.correos || ''}
                                            data="correoCliente_correo"
                                            valueKey="correoCliente_correo"
                                            onChangeFunc={(newValue) => {
                                                setData({ ...data, correo: newValue });
                                            }}
                                        />
                                    )}
                                    {ClientEmail.length > 0 && (<Tooltip title={estadocorreo ? "Escribir correo" : "Seleccionar correo"}> <Button className="bg-transparent text-white h-8 w-8 absolute right-18 top-7 mt-1 mr-2" onClick={() => { setcorreo(!estadocorreo); }} > <KeyboardDoubleArrowRightIcon /> </Button> </Tooltip>)}
                                </div>
                                <div class="mt-8 flex flex-wrap justify-center gap-4">
                                    <button class="block w-full rounded bg-[#1B2654] px-12 py-3 text-sm font-medium text-white shadow  sm:w-auto" onClick={CorreoFactura}> Enviar correo </button>
                                </div>
                            </div>
                        </div>
                    </Dialog >
                </>
            }
        </div>
    )
    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };

}