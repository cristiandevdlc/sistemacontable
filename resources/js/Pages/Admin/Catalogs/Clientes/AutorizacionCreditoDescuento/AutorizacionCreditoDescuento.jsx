import SolicitudCreditoDescuento from "./DialogsCreditoDescuento/SolicitudCreditoDescuento";
import { requestStates, requestTypes, selectsValues, } from "./IntCreditoDescuento";
import '../../../../../../sass/_detallesDialogSyle.scss'
import SelectComp from "@/components/SelectComp";
import { Divider, Tooltip } from "@mui/material";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";
import { noty } from "../../../../../utils";
import request from "@/utils";
import "@/utils";
import DetalleSolicitudCreditoDescuento from "./DialogsCreditoDescuento/DetalleSolicitudCreditoDescuento";
import LoadingDiv from "@/components/LoadingDiv";

export default function ServiciosGenEnRuta() {
    const [actualTable, setActualTable] = useState()
    const [selects, setSelects] = useState(selectsValues);
    const [data, setData] = useState({});
    const [newData, setNewData] = useState({});
    const [states, setStates] = useState({
        tipo: 1,
        estado: 1,
        open: false,
        details: false
    });


    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo },  {enabled: true });
        } catch (error) { }
    };



    const getData = async (state = states.estado, type = states.tipo) => {
        const req = await request(route('credito-descuento.get'), 'POST', { state: state - 1, type })
        setActualTable(req.solicitud)
    }

    const handleOpenModal = () => setStates({ ...states, open: !states.open })
    const handleDetailsModal = () => setStates({ ...states, details: !states.details })

    const handleCloseDetails = () => {
        setData({})
        handleDetailsModal()
    }

    const handleCloseModal = () => {
        setData({})
        setNewData({})
        handleOpenModal()
    }

    const formatNewData = (item) => {
        if (item.solicituddescuento_descuento) setNewData({ ...item, solicituddescuento_descuentoAutorizado: item.solicituddescuento_descuento })
        if (item.solicituddescuentoportatil_cantidad) setNewData({ ...item, solicituddescuentoportatil_cantidadAutorizada: item.solicituddescuentoportatil_cantidad })
        if (item.solicitudCredito_monto) setNewData({ ...item, solicitudCredito_montoAutorizado: item.solicitudCredito_monto, solicitudCredito_diasAutorizados: item.solicitudCredito_dias })
    }

    const submitRequest = async (action) => {
        const req = await request(
            route('credito-descuento.update', newData.solicituddescuentoportatil_id ?? newData.solicitudCredito_id ?? newData.solicituddescuento_idsolicitud),
            'PUT',
            formatFinalData(action),
            { enabled: true }
        )
        setStates({ ...states, open: !states.open })
        setData({})
        getData()
        noty(req.message, 'success')
    }

    const formatFinalData = (action) => {
        let responseToSend = {}
        if (newData.solicituddescuentoportatil_cantidad) {
            responseToSend = {
                ...newData,
                cliente: {
                    ...newData.cliente,
                    cliente_descuentoTanque: newData.solicituddescuentoportatil_cantidadAutorizada,
                    cliente_dscportanque: newData.solicituddescuentoportatil_tanque,
                },
                solicituddescuentoportatil_estatus: action
            }
        }
        if (newData.solicituddescuento_descuento) {
            responseToSend = {
                ...newData,
                cliente: {
                    ...newData.cliente,
                    cliente_descuento: newData.solicituddescuento_descuentoAutorizado,
                    cliente_cienLitros: newData.solicituddescuento_cienlts,
                },
                solicituddescuento_estatusPeticion: action
            }
        }
        if (newData.solicitudCredito_monto) {
            responseToSend = {
                ...newData,
                cliente: {
                    ...newData.cliente,
                    cliente_limiteCredito: newData.solicitudCredito_montoAutorizado,
                    cliente_diasCredito: newData.solicitudCredito_dias,
                },
                solicitudCredito_estatusPeticion: action
            }
        }
        return { ...responseToSend, action: action }
    }

    useEffect(() => { getData(),getMenuName() }, [states.tipo, states.estado]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {!actualTable &&
                <LoadingDiv />
            }
            {actualTable &&
                <>
                    <div className="grid grid-cols-10 gap-x-8 mt-10">
                        <div className="col-span-2">
                            <div className="mt-12 grid grid-cols-1 border-2 h-[30vh] p-5 w-full shadow-md px-4 pb-3 rounded-xl">
                                <SelectComp
                                    label="Tipo"
                                    value={states.tipo}
                                    onChangeFunc={(e) => setStates({ ...states, tipo: e })}
                                    options={selects.tipos}
                                    data='value'
                                    valueKey='id'
                                />
                                <SelectComp
                                    label="Estado"
                                    value={states.estado}
                                    onChangeFunc={(e) => setStates({ ...states, estado: e })}
                                    options={selects.estados}
                                    data='value'
                                    valueKey='id'
                                    firstLabel="Todos"
                                />

                                <div className='pt-3 mt-2 text-center'>
                                    <button
                                        className="text-white w-full rounded-lg p-3 flex justify-center"
                                        type="button"
                                        onClick={() => getData()}
                                        disabled={states.tipo === null}
                                        style={{ backgroundColor: (states.tipo !== null) ? '#1B2654' : '#b0b0b0' }}
                                    >
                                        <span className="material-icons mx-2">refresh</span> Refrescar
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-col shadow-md mt-12 bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                                <div className='flex justify-between'>
                                    <span>Total pendientes</span>
                                    <span>{actualTable.filter(reg => (reg.solicitudCredito_estatusPeticion | reg.solicituddescuento_estatusPeticion | reg.solicituddescuentoportatil_estatus) === requestStates.PENDIENTE - 1).length}</span>
                                </div>
                                <Divider color='#5F6C91' />
                                {/* <div className='flex justify-between'>
                            <span>Total aceptadas</span>
                        </div>
                        <Divider color='#5F6C91' />
                        <div className='flex justify-between'>
                            <span>Total rechazadas</span>
                        </div>
                        <Divider color='#5F6C91' /> */}
                                {/* <div className='flex justify-between'>
                            <span>Total credito</span>
                            <span>{actualTable.filter(reg => (reg.solicitudCredito_estatusPeticion | reg.solicituddescuento_estatusPeticion | reg.solicituddescuentoportatil_estatus) === requestStates.PENDIENTE - 1).length}</span>
                        </div> */}
                                <div className='flex justify-between'>
                                    <span>Total descuentos</span>
                                    <span>{actualTable.length}</span>
                                    {/* <span>{state.bonificacion}</span> */}
                                </div>
                            </div>

                        </div>
                        <div className="h-[80%] col-span-8">
                            <div className="flex gap-x-5 my-3">
                                <div className="flex"><div className="w-6 h-6 rounded-full bg-[#FFE601] mr-2" />Pendientes</div>
                                <div className="flex"><div className="w-6 h-6 rounded-full bg-[#46DC00] mr-2" />Aceptados</div>
                                <div className="flex"><div className="w-6 h-6 rounded-full bg-[#FF0000] mr-2" />Rechazados</div>
                            </div>
                            <div style={{ zoom: 0.8 }}>
                                <Datatable
                                    searcher={false}
                                    data={actualTable}
                                    columns={[
                                        {
                                            header: "",
                                            cell: (eprops) => {
                                                const item = eprops.item
                                                if ((item.solicitudCredito_estatusPeticion | item.solicituddescuento_estatusPeticion | item.solicituddescuentoportatil_estatus) === requestStates.PENDIENTE - 1)
                                                    return <><div className="w-2 h-8 rounded-full bg-[#FFE601] mr-2" /></>
                                                if ((item.solicitudCredito_estatusPeticion | item.solicituddescuento_estatusPeticion | item.solicituddescuentoportatil_estatus) === requestStates.ACEPTADO - 1)
                                                    return <><div className="w-2 h-8 rounded-full bg-[#46DC00] mr-2" /></>
                                                if ((item.solicitudCredito_estatusPeticion | item.solicituddescuento_estatusPeticion | item.solicituddescuentoportatil_estatus) === requestStates.RECHAZADO - 1)
                                                    return <><div className="w-2 h-8 rounded-full bg-[#FF0000] mr-2" /></>
                                            },
                                        },
                                        { header: "Razón social", cell: (eprops) => <> {eprops.item.cliente?.cliente_razonsocial} </>, },
                                        { header: "Nombre comercial", cell: (eprops) => <> {eprops.item.cliente?.cliente_razonsocial} </>, },
                                        {
                                            header: "Tipo de solicitud",
                                            cell: (eprops) => {
                                                const item = eprops.item
                                                if (item.requestType === requestTypes.creditos) return "CREDITO"
                                                if (item.requestType === requestTypes.portatil) return "DESC. PORTATIL"
                                                if (item.requestType === requestTypes.estacionario) return "DESC. ESTACIONARIO"
                                            },
                                        },
                                        { header: "Quien solicitó", cell: (eprops) => eprops.item.usuario_solicitud?.usuario_nombre, },
                                        {
                                            header: "Fecha de solicitud",
                                            cell: (eprops) => (new Date(eprops.item.solicituddescuento_fechaSolicitud
                                                ?? eprops.item.solicituddescuentoportatil_fechasolicitud
                                                ?? eprops.item.solicitudCredito_fechaSolicitud)).formatMX(),
                                        },
                                        {
                                            header: "Fecha de autorización",
                                            cell: (eprops) =>
                                                (eprops.item.solicituddescuento_fechaConfirmacion ||
                                                    eprops.item.solicituddescuentoportatil_fechaAutorizacion ||
                                                    eprops.item.solicitudCredito_fechaConfirmacion) ?
                                                    (new Date(eprops.item.solicituddescuento_fechaConfirmacion
                                                        ?? eprops.item.solicituddescuentoportatil_fechaAutorizacion
                                                        ?? eprops.item.solicitudCredito_fechaConfirmacion)).formatMX().replaceAll('/', '-') : '-',
                                        },
                                        {
                                            header: "Acciones",
                                            custom: (eprops) => {
                                                const item = eprops.item
                                                return <>
                                                    {
                                                        ((item.solicitudCredito_estatusPeticion | item.solicituddescuento_estatusPeticion | item.solicituddescuentoportatil_estatus) == 0) &&
                                                        <Tooltip title="Aceptar/Rechazar">
                                                            <button
                                                                onClick={() => {
                                                                    setData(eprops.item)
                                                                    formatNewData(eprops.item)
                                                                    handleOpenModal()
                                                                }}
                                                                className="material-icons"
                                                            >rule</button>
                                                        </Tooltip>
                                                    }
                                                </>
                                            },
                                            cell: (eprops) => {
                                                const item = eprops.item
                                                return <>
                                                    {
                                                        ((item.solicitudCredito_estatusPeticion | item.solicituddescuento_estatusPeticion | item.solicituddescuentoportatil_estatus) != 0) &&
                                                        <Tooltip title="Ver detalles">
                                                            <button
                                                                onClick={() => {
                                                                    setData(eprops.item)
                                                                    handleDetailsModal()
                                                                }}
                                                                className="material-icons"
                                                            >visibility</button>
                                                        </Tooltip>
                                                    }
                                                </>
                                            }
                                        },
                                    ]}
                                />
                            </div>

                        </div>
                    </div>
                    <SolicitudCreditoDescuento
                        data={data}
                        states={states}
                        newData={newData}
                        setNewData={setNewData}
                        handleOpenModal={handleOpenModal}
                        handleCloseModal={handleCloseModal}
                        submitRequest={submitRequest}
                    />
                    <DetalleSolicitudCreditoDescuento
                        data={data}
                        states={states}
                        handleOpenModal={handleDetailsModal}
                        handleCloseModal={handleCloseDetails}
                    />
                </>
            }
        </div>
    )
}
