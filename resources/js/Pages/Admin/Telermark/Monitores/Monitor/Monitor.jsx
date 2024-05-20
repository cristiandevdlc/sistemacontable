import LoadingDiv from '@/components/LoadingDiv';
import request, { noty } from '@/utils';
import React, { useEffect, useState } from 'react'
import { Divider } from '@mui/material';
import SelectComp from '@/components/SelectComp';
import { useForm } from '@inertiajs/react';
import TextInput from '@/components/TextInput';
import DetallesDialog from '../DetallesDialog';
import { useReducer } from 'react';
import MonitoresContext from '@/Context/MonitoresContext';
import MonitorTable from './MonitorTable';
import ServTransitoTable from './ServTransito/ServTransitoTable';
import ServTecnicoTable from './ServTecnico/ServTecnicoTable';
import ServProgramadosTable from './ServProgramados/ServProgramadosTable';
import DatePicker from "react-datepicker";
import "../../../../../../sass/FormsComponent/_datepicker.scss"
import es from 'date-fns/locale/es'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { add, formatISO } from 'date-fns';
import { forwardRef } from 'react';
// import esLocale from 'date-fns/locale/es';

// const fechaFormateada = format(new Date('Thu Apr 25 2024 18:00:00 GMT-0600'), 'yyyy-MM-dd', { locale: es });

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_MONITOR':
            return { monitor: action.payload }
        case 'SET_SELECTED_MENU':
            return { selectedMenu: action.payload }
        default:
            return state
    }
}

const initialState = {
    permisos: [],
    monitor: 2
}

// servicios-en-transito
const Monitor = () => {
    const [storeState, dispatch] = useReducer(reducer, initialState)
    const [state, setState] = useState({
        loading: true,
        open: false,
        loadingMonitor: false,
        action: '',
        pedidos: null,
        check: false,
        checkCambioTanque: false,
        vendedor: null,
        vendedores: null,
        vendedoresTransito: null,
        vendedoresRDG: null,
        tecnico: null,
        tecnicos: null,
        tipoServicio: null,
        tipoServicioTecnico: null,
        motivoCan: null,
        operadora: null,
        selectedMonitor: 2,
        fecha: new Intl.DateTimeFormat('es-MX').format(new Date),
        obs: '',
        soluciones: null,
        diasConPedidos: null,
        nuevosClientes: 0,
        serviciosDelDia: 0,
        serviciosEnTransito: 0,
        serviciosPorVencer: 0,
        serviciosVencidos: 0,
        serviciosActivos: 0
    })
    const [refresh, setRefresh] = useState(false)
    const { data, setData } = useForm({})
    const [filters, setFilters] = useState({
        fechaPedido: new Date().toISOString().split("T")[0],
        IdPersona: 0,
        IdServicio: 0,
        IdOperadora: 0,
        estatusid: 0
    })
    const [filteredData, setFilteredData] = useState()
    const estatus = [
        { id: 1, estatus: "Normal" },
        { id: 2, estatus: "Por vencer" },
        { id: 3, estatus: "Vencido" },
    ]
    const monitores = [
        { id: 1, nombre: "Monitor" },
        { id: 2, nombre: "Servicios en tránsito" },
        { id: 3, nombre: "Servicio técnico" },
        { id: 4, nombre: "Servicios programados" }
    ]

    // const [notification, setNotification] = useState({ title: '', body: '' });
    const sendNotification = async (title, body, id) => {
        try {
            await request(route('send.web-notification', { title: title, body: body, IdVendedor: id }), "POST")
        } catch {
            noty('Ocurrió un error al notificar al vendedor.', 'error')
        }
    };

    const fetchdata = async () => {
        if (state.selectedMonitor === 1) {
            const response = await request(route("servicios-en-transito", { estatus: [1, 4], fecha: filters.fechaPedido }), "GET");
            // setState({ ...state, pedidos: response.pedidos, loading: false, loadingMonitor: false });
            return response
        }
        if (state.selectedMonitor === 2) {
            const response = await request(route("servicios-en-transito", { estatus: [1, 4], fecha: filters.fechaPedido, type: 1 }), "GET");
            // setState({ ...state, pedidos: response.pedidos, loading: false, loadingMonitor: false });
            return response
        }
        if (state.selectedMonitor === 3) {
            const response = await request(route("servicios-en-transito", { estatus: [1, 4], type: 3 }), "GET");
            // setState({ ...state, pedidos: response.pedidos, loading: false, loadingMonitor: false });
            return response
        }
        if (state.selectedMonitor === 4) {
            const response = await request(route("servicios-en-transito", { estatus: [4], fecha: filters.fechaPedido }), "GET");
            // setState({ ...state, pedidos: response.pedidos, loadingMonitor: false });
            return response
        }
    };

    const getData = async () => {
        const dias = await fetch(route("dias-con-pedidos", { monitor: state.selectedMonitor })).then(response => response.json())
        // console.log(dias)
        fetchdata().then((res) => {
            setState({
                ...state,
                pedidos: res.pedidos,
                diasConPedidos: dias,
                nuevosClientes: res.nuevosClientes,
                serviciosDelDia: res.serviciosDelDia,
                serviciosEnTransito: res.serviciosEnTransito,
                serviciosPorVencer: res.serviciosPorVencer,
                serviciosVencidos: res.serviciosVencidos,
                serviciosActivos: res.serviciosActivos,
                loadingMonitor: false
            })
        })
    }

    const getSelectOptions = async () => {
        const [vendedoresResponse, tipoServicioResponse, operadoraResponse, diasPedidosResponse, pedidosResponse] = await Promise.all([
            fetch(route("persona.vendedoresruta")).then(response => response.json()),
            fetch(route("tipos-servicios.index")).then(response => response.json()),
            fetch(route("usuarios.index")).then(response => response.json()),
            fetch(route("dias-con-pedidos")).then(response => response.json()),
            fetchdata().then((response) => { return response })
        ])
        return { vendedoresResponse, tipoServicioResponse, operadoraResponse, diasPedidosResponse, pedidosResponse }
    }

    const SetMonitorFunc = (monitor) => {
        dispatch({ type: 'SET_MONITOR', payload: monitor })
        setState({ ...state, selectedMonitor: monitor, loadingMonitor: true })
    }

    const formatoDDMMYY = (date) => {
        const fechaOriginal = date;
        const [año, mes, dia] = fechaOriginal.split('-');
        const fechaFormateada = `${dia}-${mes}-${año.slice(-2)}`;
        return fechaFormateada
    }

    const search = () => {
        // if (state.selectedMonitor === 1 || state.selectedMonitor === 2 || state.selectedMonitor === 4) {
        // console.log(filters.fechaPedido)
        if (state.selectedMonitor !== 3 && (filters.fechaPedido || filters.IdPersona || filters.IdServicio || filters.IdOperadora || filters.estatusid)) {
            const filtered = state.pedidos.filter((item) => {
                const filterFechaPedido = !filters.fechaPedido || item.fecha.split(" ")[0] === formatoDDMMYY(filters.fechaPedido.toString());
                const filterIdPersona = !filters.IdPersona || item.IdVendedor.toString() === filters.IdPersona.toString();
                const filterTipoServicio = !filters.IdServicio || item.IdServicio.toString() === filters.IdServicio.toString();
                const filterUsuarioId = !filters.IdOperadora || item.IdOperadora.toString() === filters.IdOperadora.toString();
                const filterEstatusId = !filters.estatusid || item.estatusTiempos.toString() === filters.estatusid.toString();
                return filterFechaPedido && filterIdPersona && filterTipoServicio && filterUsuarioId && filterEstatusId;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(state.pedidos);
        }
        // } else {
        // 	setFilteredData(state.pedidos)
        // }
    };

    const RefreshAfterAction = () => {
        setRefresh(true)
    }

    const handleCloseModal = () => {
        setState({ ...state, open: false, action: '', check: false, checkCambioTanque: false });
        setData({})
    }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="datepicker_notification" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    useEffect(() => {
        // if (!filteredData) {
        // search()
        // }
        if (state.loadingMonitor) {
            // fetchdata().then((res) => {
            //     setState({
            //         ...state,
            //         pedidos: res.pedidos,
            //         nuevosClientes: res.nuevosClientes,
            //         serviciosDelDia: res.serviciosDelDia,
            //         serviciosEnTransito: res.serviciosEnTransito,
            //         serviciosPorVencer: res.serviciosPorVencer,
            //         serviciosVencidos: res.serviciosVencidos,
            //         loadingMonitor: false
            //     })
            // })
            getData()
        }
        if (state.vendedores && state.tipoServicio && state.operadora && state.pedidos && state.loading) {
            setState({ ...state, loading: false })
        }
        // search()
    }, [state])

    useEffect(() => {
        if (state.pedidos) search()
    }, [state.pedidos])

    useEffect(() => {
        getSelectOptions()
            .then((res) => {
                setState({
                    ...state,
                    vendedores: res.vendedoresResponse,
                    tipoServicio: res.tipoServicioResponse,
                    operadora: res.operadoraResponse,
                    diasConPedidos: res.diasPedidosResponse,
                    pedidos: res.pedidosResponse.pedidos,
                    nuevosClientes: res.pedidosResponse.nuevosClientes,
                    serviciosDelDia: res.pedidosResponse.serviciosDelDia,
                    serviciosEnTransito: res.pedidosResponse.serviciosEnTransito,
                    serviciosPorVencer: res.pedidosResponse.serviciosPorVencer,
                    serviciosVencidos: res.pedidosResponse.serviciosVencidos,
                    serviciosActivos: res.pedidosResponse.serviciosActivos
                })
            })
    }, [])

    useEffect(() => {
        if (data.pedidoId) setState({ ...state, open: true })
        if (!data.pedidoId && refresh) {
            fetchdata().then((res) => {
                setState({
                    ...state,
                    pedidos: res.pedidos,
                    nuevosClientes: res.nuevosClientes,
                    serviciosDelDia: res.serviciosDelDia,
                    serviciosEnTransito: res.serviciosEnTransito,
                    serviciosPorVencer: res.serviciosPorVencer,
                    serviciosVencidos: res.serviciosVencidos,
                    serviciosActivos: res.serviciosActivos
                })
                setRefresh(false)
            })
        }
    }, [data, refresh])

    useEffect(() => {
        const intervalo = setInterval(RefreshAfterAction, 120000);
        return () => clearInterval(intervalo);
    }, [])

    // useEffect(() => {
    //     if (notification?.title) {
    //         noty(notification?.title, 'success')
    //     }
    // }, [notification]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {(filteredData && !state.loading) &&
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className='border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                            <SelectComp
                                label="Monitor"
                                options={monitores}
                                value={state.selectedMonitor || 2}
                                data="nombre"
                                valueKey="id"
                                onChangeFunc={(monitor) => {
                                    if (monitor !== state.selectedMonitor) SetMonitorFunc(monitor)
                                }}
                            />
                            {/* <TextInput
                                type="date"
                                disabled={state.selectedMonitor === 3 ? true : false}
                                className="block w-full"
                                min="1800-01-01"
                                max={new Date().toISOString().split("T")[0]}
                                value={filters.fechaPedido || new Date().toISOString().split("T")[0]}
                                onChange={(event) =>
                                    setFilters({
                                        ...filters,
                                        fechaPedido: event.target.value,
                                    })
                                }
                                style={{
                                    borderRadius: "12px",
                                    padding: "15px",
                                }} // Añade el border-radius
                            /> */}

                            <DatePicker
                                locale={es}
                                showIcon
                                icon={<CalendarTodayIcon fontSize='12px' />}
                                toggleCalendarOnIconClick
                                dateFormat="dd/MM/yyyy"
                                title='titulo'
                                selected={add(new Date(filters.fechaPedido), { days: 1 }) || new Date().toISOString().split("T")[0]}
                                onChange={(event) => {
                                    // const formattedDate = format(new Date(event), 'yyyy-MM-dd', { locale: es })
                                    // const formato = format(new Date(event), 'yyyy-MM-dd', { timeZone: "America/Mexico_City" })
                                    const formato = formatISO(new Date(event), { representation: 'date' })
                                    setFilters({
                                        ...filters,
                                        fechaPedido: formato
                                    })
                                }}
                                calendarStartDay={0}
                                // className="datepicker_notification"
                                dayClassName={(date) => {
                                    const fechaFormateada = formatISO(new Date(date), { representation: 'date' });
                                    const diaConPedidosEncontrado = state.diasConPedidos.find((diaConPedidos) => diaConPedidos.fecha === fechaFormateada);
                                    return diaConPedidosEncontrado ? "day-notification" : undefined;
                                }}
                                customInput={<ExampleCustomInput />}
                            />
                            <SelectComp
                                label="Vendedor"
                                firstOption={true}
                                firstLabel={"Todos"}
                                options={state.vendedores}
                                value={filters.IdPersona || ''}
                                data="Nombres"
                                valueKey="IdPersona"
                                onChangeFunc={(value) => setFilters({ ...filters, IdPersona: value })}
                            />
                            <SelectComp
                                label="Tipo"
                                firstOption={true}
                                firstLabel={"Todos"}
                                options={state.tipoServicio}
                                value={filters.IdServicio || ''}
                                data="tipoServicio_descripcion"
                                valueKey="tipoServicio_idTipoServicio"
                                onChangeFunc={(value) => setFilters({ ...filters, IdServicio: value })}
                            />
                            <SelectComp
                                label="Operadora"
                                firstOption={true}
                                firstLabel={"Todos"}
                                options={state.operadora}
                                value={filters.IdOperadora || ''}
                                data="usuario_nombre"
                                valueKey="usuario_idUsuario"
                                onChangeFunc={(value) => setFilters({ ...filters, IdOperadora: value })}
                            />
                            <SelectComp
                                label="Activo"
                                firstOption={true}
                                firstLabel={"Todos"}
                                options={estatus}
                                value={filters.estatusid || ''}
                                data="estatus"
                                valueKey="id"
                                onChangeFunc={(value) => setFilters({ ...filters, estatusid: value })}
                            />
                            <div className='pt-4'>
                                <button className='bg-[#1B2654] rounded-lg text-white w-full h-[48px]' onClick={getData}>Buscar</button>
                            </div>
                        </div>
                        <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                            <div className='flex gap-4'>
                                <div className='relative flex w-full gap-2'>
                                    {/* <div className='relative w-[15px] h-[20px]'> */}
                                    <div className='bg-[#46DC00] absolute rounded-full h-[100%] w-[9px] top-0 left-0'></div>
                                    {/* </div> */}
                                    <span className='ml-4'>Servicios en tránsito</span>
                                </div>
                                <span>{state.serviciosEnTransito}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <div className='relative w-full gap-2'>
                                    <div className='bg-[#FFE601] absolute rounded-full h-[100%] w-[9px] top-0 left-0'></div>
                                    <span className='ml-4'>Servicios por vencer</span>
                                </div>
                                <span>{state.serviciosPorVencer}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <div className='relative w-full gap-2'>
                                    <div className='bg-[#FF0000] absolute rounded-full h-[100%] w-[9px] top-0 left-0'></div>
                                    <span className='ml-4'>Servicios vencidos</span>
                                </div>
                                <span>{state.serviciosVencidos}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Total servicios activos</span>
                                <span>{state.serviciosActivos}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Total servicios del día</span>
                                <span>{state.serviciosDelDia}</span>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Nuevos clientes</span>
                                <span>{state.nuevosClientes}</span>
                            </div>
                        </div>
                    </div>
                    {state.loadingMonitor ? (
                        <div className='w-full'>
                            <LoadingDiv />
                        </div>
                    ) : (
                        <MonitoresContext.Provider value={{ storeState, SetMonitorFunc }}>
                            {state.selectedMonitor === 1 ? (
                                <div className='w-full monitor-table'>
                                    <MonitorTable
                                        filteredData={filteredData}
                                        setData={setData}
                                        setState={setState}
                                        state={state}
                                    />
                                </div>
                            ) : (state.selectedMonitor === 2 ? (
                                <div className='w-full monitor-table'>
                                    <ServTransitoTable
                                        filteredData={filteredData}
                                        setData={setData}
                                        setState={setState}
                                        state={state}
                                    />
                                </div>
                            ) : (state.selectedMonitor === 3 ? (
                                <div className='w-full monitor-table'>
                                    <ServTecnicoTable
                                        pedidos={filteredData}
                                        setData={setData}
                                        setState={setState}
                                        state={state}
                                    />
                                </div>
                            ) : (
                                <div className='w-full monitor-table'>
                                    <ServProgramadosTable
                                        filteredData={filteredData}
                                        setData={setData}
                                        setState={setState}
                                        state={state}
                                    />
                                </div>
                            )))
                            }
                            {data.pedidoId &&
                                <DetallesDialog
                                    handleCloseModal={handleCloseModal}
                                    RefreshAfterAction={RefreshAfterAction}
                                    pedido={data}
                                    monitor={storeState.monitor}
                                    state={state}
                                    setState={setState}
                                    setData={setData}
                                    onChangeVendedor={(value) => setData({ ...data, IdVendedor: value/* detalles: { ...data.detalles, quienconquienId: value } */ })}
                                    onChangeTecnico={(value) => setData({ ...data, IdVendedor: value/* detalles: { ...data.detalles, quienconquienId: value } */ })}
                                    onChangeCheck={(e) => {
                                        setData({ ...data, check: e.target.checked })
                                        setState({ ...state, check: e.target.checked })
                                    }}
                                    onChangeRemision={(e) => setData({ ...data, detalles: { ...data.detalles, remision: e.target.value } })}
                                    onChangeCantidad={(e) => setData({ ...data, detalles: { ...data.detalles, rdg: e.target.value } })}
                                    onChangeCantidadVenta={(e) => setData({ ...data, detalles: { ...data.detalles, Cantidad: e.target.value } })}
                                    onChangeMotivoCanId={(value) => setData({ ...data, detalles: { ...data.detalles, motivocancelacionid: value } })}
                                    onChangeMotivoCanDes={(e) => setData({ ...data, detalles: { ...data.detalles, descripcionCancelacion: e.target.value } })}
                                    onChangeClaveSup={(e) => setData({ ...data, claveSupervisor: e.target.value })}
                                    onChangeServicio={(e) => setState({ ...state, obs: e.target.value })}
                                    onChangeCheckCambioTanque={(e) => {
                                        setData({ ...data, checkTanque: e.target.checked })
                                        setState({ ...state, checkTanque: e.target.checked })
                                    }}
                                    onChangeSolucion={(value) => setData({ ...data, detalles: { ...data.detalles, solucionserviciotecnicoid: value } })}
                                    sendNotification={sendNotification}
                                />
                            }
                        </MonitoresContext.Provider>
                    )}
                    {/* <button
                        onClick={() => {
                            sendNotification('', 'Frontend title', 'Frontend body')
                        }}
                    >
                        Enviar notificacion
                    </button> */}
                </div>
            }
        </div>
    )
}

export default Monitor