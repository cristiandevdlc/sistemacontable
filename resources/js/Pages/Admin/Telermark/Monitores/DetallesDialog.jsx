import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import React from 'react'
import '../../../../../sass/_detallesDialogSyle.scss'
import GreenCheckIcon from '../../../../../png/green_check.png'
import GreyCheckIcon from '../../../../../png/grey_check.png'
import CloseIcon from '@mui/icons-material/Close';
import ClienteImg from '../../../../../png/iconos/cliente@4x.png'
import PedidoImg from '../../../../../png/iconos/pedido@4x.png'
import CancelarServImg from '../../../../../png/iconos/cancelar@4x.png'
import SurtirServImg from '../../../../../png/iconos/surtir@4x.png'
import AsignarImg from '../../../../../png/iconos/servicio.png'
import RDGImg from '../../../../../png/iconos/reposición.png'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import MonitoresContext from '@/Context/MonitoresContext'
import { useContext } from 'react'
import ServTransitoForm from './Monitor/ServTransito/ServTransitoForm'
import ServTecnicoForm from './Monitor/ServTecnico/ServTecnicoForm'
import BackIcon from '../../../../../png/LeftArrow.png'
import request, { noty } from '@/utils'

const DetallesDialog = ({
    state,
    setState,
    handleCloseModal,
    RefreshAfterAction,
    pedido,
    setData,
    monitor,
    checkCambioTanque,
    onChangeCheck,
    onChangeVendedor,
    onChangeRemision,
    onChangeServicio,
    onChangeMotivoCanDes,
    onChangeMotivoCanId,
    onChangeSolucion,
    onChangeCantidad,
    onChangeCantidadVenta,
    onChangeTecnico,
    onChangeCheckCambioTanque,
    sendNotification
}) => {
    const { monitores, SetMonitorFunc } = useContext(MonitoresContext);
    const [historial, setHistorial] = useState()
    const [filteredSolutions, setFilteredSolutions] = useState()
    const [loadingForm, setLoadingForm] = useState(false)
    const [prevState, setPrevState] = useState()
    const [actionAux, setActionAux] = useState('')
    const optionsRef = useRef(null)
    const actionBtnRefs = useRef([]);
    const [isActionsActive, setIsActionsActive] = useState(false);

    const handleBackClick = () => {
        setState({ ...state, action: '', obs: '', check: false, checkCambioTanque: false, tecnico: state.tecnico - 1, vendedor: state.vendedor - 1 })
        setData({ ...prevState })
    };

    const handleActionClick = (action) => {
        setPrevState({ ...pedido })
        setLoadingForm(true)
        setActionAux(action)
        // setState({ ...state, action: action })
    };

    const getFormOptions = async () => {
        if (monitor === 2) {
            if (actionAux === "surtir") {
                const response = await fetch(route('vendedor-quienconquien'), {
                    method: "POST",
                    body: JSON.stringify({ tipoServicioId: pedido.IdServicio }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    if (!response.ok) {
                        new Noty({
                            text: "Ocurrió un error al obtener los vendedores.",
                            type: "error",
                            theme: "metroui",
                            layout: "bottomRight",
                            timeout: 2000
                        }).show();
                    }
                    return response.json();
                })
                // console.log('response', response)
                setState({ ...state, vendedoresTransito: response, action: actionAux });
                // console.log('vendedor-quienconquien', response)
            }
            if (actionAux === "cancelar") {
                const [motivosCanResponse, vendedorResponse] = await Promise.all([
                    fetch(route("motivos-cancelacion-habiles")).then(response => response.json()),
                    fetch(route('vendedor-quienconquien'), {
                        method: "POST",
                        body: JSON.stringify({ tipoServicioId: pedido.IdServicio }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(response => response.json()),
                ])
                setState({ ...state, motivoCan: motivosCanResponse, vendedoresTransito: vendedorResponse, action: actionAux })
            }
            if (actionAux === "envio") {
                const response = await fetch(route('vendedor-quienconquien'), {
                    method: "POST",
                    body: JSON.stringify({ tipoServicioId: pedido.IdServicio }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    if (!response.ok) {
                        new Noty({
                            text: "Ocurrió un error al obtener los vendedores.",
                            type: "error",
                            theme: "metroui",
                            layout: "bottomRight",
                            timeout: 2000
                        }).show();
                    }
                    return response.json()
                })
                // console.log('res=========>', response)
                setState({ ...state, vendedoresTransito: response, action: actionAux });
                // setState({ ...state, vendedoresTransito: vendedorResponse, action: actionAux })
            }
        } else if (monitor === 3) {
            const [vendedorResponse, servTecSolResponse, tipoServTecResponse, tecnicosResponse] = await Promise.all([
                fetch(route("persona.vendedores")).then(response => response.json()),
                fetch(route("serv-tec-soluciones.index")).then(response => response.json()),
                fetch(route("tipos-servicios.index")).then(response => response.json()),
                fetch(route("persona.tecnicos")).then(response => response.json())
            ]);
            if (actionAux === "confServ") {
                setState({ ...state, tecnicos: tecnicosResponse, soluciones: servTecSolResponse, tipoServicioTecnico: tipoServTecResponse, action: actionAux })
            }
            if (actionAux === "rdg") {
                if (!historial) {
                    const responseE = await fetch(route("historialpedidos"), {
                        method: "POST",
                        body: JSON.stringify({ id: pedido.IdCliente, limit: 10 }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (responseE.ok) {
                        const dataE = await responseE.json();
                        setHistorial(dataE);
                    } else {
                        console.error("Error en la petición:", responseE.status);
                    }
                } else {
                    setState({ ...state, action: actionAux })
                }
                setState({ ...state, vendedoresRDG: vendedorResponse, soluciones: servTecSolResponse, action: actionAux })
            }
            if (actionAux === "envio") {
                // const [vendedorResponse] = await Promise.all([
                //     fetch(route("persona.vendedores")).then(response => response.json()),
                // ])
                setState({ ...state, tecnicos: tecnicosResponse, action: actionAux })
            }
        } else if (monitor === 4) {
            setState({ ...state, action: actionAux })
        }
    }

    const envioFunc = async () => {
        const response = await request(
            route('pedidos-detalle.update', pedido.detalles.pedidoDetallesId),
            "PUT",
            { ...pedido, detalles: { ...pedido.detalles, enviado: 1, servicio: pedido.detalles.servicio + ' ' + state.obs + ';' }, tipo: 'envio' })
        if (response) {
            sendNotification('Servicio asignado.', 'Selecciona para ver más detalles.', pedido.IdVendedor)
            RefreshAfterAction()
            handleCloseModal()
        } else {
            noty('Ocurrió un error al asignar el servicio.', 'error')
        }
    }

    useEffect(() => {
        if (state.soluciones) {
            const filtered = state.soluciones.filter((sol) => {
                return pedido.detalles.motivoserviciotecnicoid.toString() === sol.idproblema.toString();
            });
            setFilteredSolutions(filtered)
        }
        if (state.action !== '') {
            setLoadingForm(false)
            setIsActionsActive(true);
        }
        else {
            setLoadingForm(false)
            setIsActionsActive(false)
        }
    }, [state]);

    useEffect(() => {
        if (loadingForm) {
            getFormOptions()
        }
    }, [loadingForm])

    return (
        <Dialog open={state.open} onClose={handleCloseModal} maxWidth={'md'}>
            {/* <div className='bg-white rounded-2xl'> */}
            <DialogTitle className='flex justify-between'>
                {/* {pedido &&
                    action === "envio" ? "Telemark" : (action === "confServ" ? `Solucionado ${pedido.pedidoId}` : `Reposición de gas ${pedido.pedidoId}`)
                } */}
                <div>
                    Detalle de la orden
                </div>
                <div onClick={handleCloseModal}>
                    <CloseIcon className='cursor-pointer' />
                </div>
            </DialogTitle>
            <div className='flex justify-center'>
                <Divider className='w-[95%]' />
            </div>
            <DialogContent>
                <div className='sm:grid-cols-1 md:grid md:grid-cols-5 gap-4 h-[550px] max-w-[700px]'>
                    <div className='monitor-dialog-details sm:col-span-5 md:col-span-2 sm:mb-4 md:mb-0 sm:h-[70%] md:h-full'>
                        <div className='grid sm:grid-cols-2 md:grid-cols-1 w-full h-full gap-2 p-3'>
                            <div className='flex flex-col'>
                                <span>Fecha creación</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.fechaCreacion}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Dirección</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.direccion}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Entre calles</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.calle1} y {pedido.detalles.calle2}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Vendedor</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.nombresVendedor}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Ruta</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.nombreRuta}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Unidad</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.numComercialUnidad}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span>Información</span>
                                <span className='text-[14px] text-[#D1D1D1]'>{pedido.detalles.servicio}</span>
                            </div>
                        </div>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="190" height="334" viewBox="0 0 190 334" fill="none">
                            <path d="M0 3.00001C0 1.34315 1.34315 0 3 0H177.216C178.592 0 179.792 0.936861 180.126 2.27233L185.398 23.3566L187.983 43.2098L188.722 56.0559L189.46 68.3182V78.8287V85.8357V92.8427L188.722 98.0979L187.983 103.937L186.506 110.36L183.92 122.038L180.597 131.965L176.903 144.811L172.841 159.409L170.256 167.584L166.562 178.094L163.977 190.941L161.761 204.955L161.023 214.297V224.808V234.15V244.077L161.761 252.252L162.131 260.427L162.5 268.017L163.239 275.608L164.716 284.951L167.596 295.196C167.645 295.373 167.711 295.544 167.792 295.709L172.841 305.972L176.903 314.147L179.558 318.234L181.704 321.738L182.812 323.49L183.92 325.241L185.028 326.993L186.136 329.329L187.244 331.08C187.921 332.418 186.949 334 185.449 334H179.558H2.99999C1.34314 334 0 332.657 0 331V3.00001Z" fill="#1B2654" />
                        </svg> */}
                    </div>
                    <div className='wrapper md:col-span-3 sm:pb-5 md:pb-0'>
                        <div className={`monitor-dialog-options buttons-box ${!isActionsActive ? 'active-box' : ''}`}>
                            {/*-------------- BOTON CLIENTE -------------*/}
                            <Link className='order-button col-span-2 sm:h-[102px] md:h-[20%]' to={'/clientes-pedidos'} state={{ item: pedido, showPedido: false }}>
                                <div className='img-box'>
                                    <img className='non-selectable' style={{ width: '45%'/* , transform: 'translate(-10%, -50%)' */ }} src={ClienteImg} alt="" />
                                    <div className='blur-thing'></div>
                                </div>
                                <span>
                                    Cliente
                                </span>
                            </Link>
                            {/*-------------- BOTON PEDIDO -------------*/}
                            <Link className='order-button col-span-2 sm:h-[102px] md:h-[20%]' to={'/clientes-pedidos'} state={{ item: pedido, showPedido: true }}>
                                <div className='img-box'>
                                    <img className='non-selectable' style={{ width: '45%'/* , transform: 'translate(-15%, -50%)' */ }} src={PedidoImg} alt="" />
                                    <div className='blur-thing'></div>
                                </div>
                                <span>
                                    Pedido
                                </span>
                            </Link>
                            {/*-------------- BOTON ASIGNAR SERVICIO -------------*/}
                            {pedido.detalles.enviado.toString() === '0' && monitor !== 4 &&
                                <button className='asignar-button-grey col-span-2 sm:h-[102px] md:h-[20%]' onClick={envioFunc}>
                                    {/* <img className='non-selectable' src={GreyCheckIcon} alt="" /> */}
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%'/* , transform: 'translate(-15%, -50%)' */ }} src={AsignarImg} alt="" />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>Asignar servicio</span>
                                </button>
                            }
                            {pedido.detalles.enviado.toString() === '1' && monitor !== 4 &&
                                <button className='asignar-button-green col-span-2 sm:h-[102px] md:h-[20%]' onClick={() => handleActionClick('envio')}>
                                    {/* <img className='non-selectable' src={GreenCheckIcon} alt="" /> */}
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%'/* , transform: 'translate(-15%, -50%)' */ }} src={AsignarImg} alt="" />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>Reasignar servicio</span>
                                </button>
                            }
                            {/*-------------- BOTON CANCELAR Y CONFIRMAR SERVICIO (MONITOR SERVICIOS EN TRANSITO) -------------*/}
                            {(monitor === 2 || monitor === 4) &&
                                <button className='order-button col-span-2 sm:h-[102px] md:h-[20%]' onClick={() => handleActionClick('cancelar')} ref={optionsRef}>
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%' /* transform: 'translate(-10%, -50%)' */ }} src={CancelarServImg} alt={pedido.detalles.enviado.toString() === '0' ? 'No enviado' : 'Enviado'} />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>
                                        Cancelar servicio
                                    </span>
                                </button>
                            }
                            {(monitor === 2 || monitor === 4) &&
                                <button className='order-button col-span-2 sm:h-[102px] md:h-[20%]' onClick={() => handleActionClick('surtir')} ref={optionsRef}>
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%' /* transform: 'translate(-10%, -70%)' */ }} src={SurtirServImg} alt="" />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>
                                        Confirmar servicio
                                    </span>
                                </button>
                            }
                            {/*-------------- BOTON CANCELAR Y CONFIRMAR SERVICIO (MONITOR SERVICIO TECNICO) -------------*/}
                            {monitor === 3 &&
                                <button className='order-button col-span-2 sm:h-[102px] md:h-[20%]' onClick={() => handleActionClick('rdg')} ref={optionsRef}>
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%' /* transform: 'translate(-10%, -70%)' */ }} src={RDGImg} alt={pedido.detalles.enviado.toString() === '0' ? 'No enviado' : 'Enviado'} />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>
                                        Reposición de gas
                                    </span>
                                </button>
                            }
                            {monitor === 3 &&
                                <button className='order-button col-span-2 sm:h-[102px] md:h-[20%]' onClick={() => handleActionClick('confServ')} ref={optionsRef}>
                                    <div className='img-box'>
                                        <img className='non-selectable' style={{ width: '45%' /* transform: 'translate(-10%, -70%)' */ }} src={SurtirServImg} alt="" />
                                        <div className='blur-thing'></div>
                                    </div>
                                    <span>
                                        Confirmar servicio
                                    </span>
                                </button>
                            }
                        </div>
                        {loadingForm &&
                            <div className='absolute w-full h-full bg-[#c0c0c03a]'></div>
                        }
                        {
                            <div className={`monitor-dialog-options action ${isActionsActive ? 'active-box' : ''}`}>
                                <div className='flex flex-col w-full h-full gap-3'>
                                    <div>
                                        <button ref={actionBtnRefs} onClick={handleBackClick}>
                                            <img
                                                className="non-selectable"
                                                src={BackIcon}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                    <div className=' h-full'>
                                        {
                                            pedido.pedidoId && (monitor === 2 || monitor === 4) ? (
                                                <ServTransitoForm
                                                    monitor={monitor}
                                                    estado={state}
                                                    pedido={pedido}
                                                    action={state.action}
                                                    check={state.check}
                                                    onChangeCheck={onChangeCheck}
                                                    vendedores={state.vendedoresTransito}
                                                    onChangeVendedor={onChangeVendedor}
                                                    onChangeRemision={onChangeRemision}
                                                    motivosCancelacion={state.motivoCan}
                                                    onChangeMotivoCanId={onChangeMotivoCanId}
                                                    onChangeCantidadVenta={onChangeCantidadVenta}
                                                    onChangeMotivoCanDes={onChangeMotivoCanDes}
                                                    onChangeServicio={onChangeServicio}
                                                    RefreshAfterAction={RefreshAfterAction}
                                                    handleCloseModal={handleCloseModal}
                                                />
                                            ) : (pedido.pedidoId && monitor === 3 ? (
                                                <ServTecnicoForm
                                                    estado={state}
                                                    pedido={pedido}
                                                    action={state.action}
                                                    check={state.check}
                                                    historial={historial}
                                                    soluciones={filteredSolutions}
                                                    vendedores={state.vendedoresRDG}
                                                    onChangeCheck={onChangeCheck}
                                                    onChangeSolucion={onChangeSolucion}
                                                    checkCambioTanque={state.checkTanque}
                                                    onChangeCheckCambioTanque={onChangeCheckCambioTanque}
                                                    onChangeCantidad={onChangeCantidad}
                                                    onChangeServicio={onChangeServicio}
                                                    onChangeTecnico={onChangeTecnico}
                                                    RefreshAfterAction={RefreshAfterAction}
                                                    handleCloseModal={handleCloseModal}
                                                />
                                            ) : (
                                                <></>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </DialogContent>
            {/* </div> */}
        </Dialog>
    )
}

export default DetallesDialog