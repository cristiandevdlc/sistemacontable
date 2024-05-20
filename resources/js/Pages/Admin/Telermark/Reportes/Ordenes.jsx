import { Person, Description, DeleteSweep, Search, SyncAlt } from '@mui/icons-material';
import CheckMenuPermission from '@/core/CheckMenuPermission';
import UserMenusContext from '@/Context/UserMenusContext';
import { noty, numberFormat, camionLogo } from '@/utils';
import { Tooltip, Button, Divider } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { Request } from "@/core/Request";
import { Link } from 'react-router-dom'
import moment from "moment";


const defState = {
    tipoServicios: [],
    operadora: [],
    estados: [],
    rutas: [],
    ordenes: [],
    loading: true
}

const defaultCount = {
    Transito: 0,
    Cancelados: 0,
    Surtidos: 0,
    Total: 0,
    Telemark: 0,
    Ruta: 0,
    App: 0
}

const defData = {
    folio: "",
    fecha: moment().format('YYYY-MM-DD'),
    operadora: "",
    ruta: "",
    estatus: "",
    servicio: ""
}

const estatusColors = [
    "bg-[#FF0000]",
    "bg-[#46DC00]",
    "bg-[#FFE601]"
]

export default function Ordenes() {
    const [conteoServ, setConteoServ] = useState(defaultCount);
    const { userMenus } = useContext(UserMenusContext);
    const [states, setStates] = useState(defState)
    const [data, setData] = useState(defData);
    const [pagesPermission, setPagesPermission] = useState({
        correccionPediido: false,
        clientePedidos: false,
    })

    const fetchdata = async () => {
        const [
            tipoServicios,
            operadora,
            estados,
            rutas
        ] = await Promise.all([
            Request._get(route('tipos-servicios.index')),
            Request._get(route('operadora')),
            Request._get(route("estatus.index")),
            Request._get(route('rutas.index')),
        ]);

        setStates(prev => ({
            ...prev,
            loading: false,
            tipoServicios: tipoServicios,
            operadora: operadora,
            estados: estados,
            rutas: rutas,
        }))
    };


    useEffect(() => {
        const perm = CheckMenuPermission

        setPagesPermission({
            clientePedidos: perm(userMenus, 'clientes-pedidos').read,
            correccionPediido: perm(userMenus, 'correcion_pedidos').read,
        })
    }, [userMenus]);

    const servicio = async (e = []) => {
        const response = await Request._post(route('getOnTransitServiceOrders'), { pedidos: e })
        setConteoServ({
            Transito: response.serviciosEnTransito,
            Surtidos: response.serviciosSurtidos,
            Total: response.totalServicios,
            Telemark: response.origenTelemark,
            Ruta: response.origenRuta,
            App: response.APP
        });
    };

    const getOrdenes = async () => {
        if (data.fecha) {
            const { ordenes } = await Request._post(route('ordenes'), data)
            setStates(prev => ({ ...prev, ordenes: ordenes }))
            servicio(ordenes);
            return
        }
        noty('Selecciona una fecha', 'error')
    };

    const limpiarOrdenes = () => {
        setStates({
            ...states,
            ordenes: [],
            data: defData
        });
    };

    useEffect(() => {
        fetchdata();
        getOrdenes()
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }
            {!states.loading &&
                <div className="flex gap-6 sm:flex-col md:flex-row">
                    <div className="flex flex-col min-w-[300px] gap-4">
                        <div className="border-2 grid grid-cols-2 gap-x-3 w-full shadow-md px-4 pb-3 rounded-xl">
                            <FieldDrawer
                                fields={[
                                    {
                                        input: true,
                                        label: 'Folio',
                                        value: data.folio,
                                        style: 'col-span-2',
                                        onChangeFunc: ({ target }) => setData({ ...data, folio: target.value.replace(/\D/g, "") })
                                    },
                                    {
                                        input: true,
                                        label: 'Fecha',
                                        type: 'date',
                                        value: data.fecha,
                                        style: 'col-span-2',
                                        onChangeFunc: ({ target }) => setData({ ...data, fecha: target.value })
                                    },
                                    {
                                        select: true,
                                        label: 'Operadora',
                                        value: data.operadora,
                                        style: 'col-span-2',
                                        options: states.operadora,
                                        data: "usuario_nombre",
                                        valueKey: "usuarioid",
                                        onChangeFunc: (e) => setData({ ...data, operadora: e })
                                    },
                                    {
                                        select: true,
                                        label: 'Ruta',
                                        value: data.ruta,
                                        style: 'col-span-2',
                                        options: states.rutas,
                                        data: "ruta_nombre",
                                        valueKey: "ruta_idruta",
                                        onChangeFunc: (e) => setData({ ...data, ruta: e })
                                    },
                                    {
                                        select: true,
                                        label: 'Estado',
                                        value: data.estatus,
                                        style: 'col-span-2',
                                        options: states.estados,
                                        data: "descripcionestatus",
                                        valueKey: "estatusid",
                                        onChangeFunc: (e) => setData({ ...data, estatus: e })
                                    },
                                    {
                                        select: true,
                                        label: 'Tipo servicio',
                                        value: data.servicio,
                                        style: 'col-span-2',
                                        options: states.tipoServicios,
                                        data: "tipoServicio_descripcion",
                                        valueKey: "tipoServicio_idTipoServicio",
                                        onChangeFunc: (e) => setData({ ...data, servicio: e })
                                    },
                                    {
                                        custom: true,
                                        style: 'col-span-2',
                                        customItem: () => (<>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <ButtonComp
                                                    label={<><Search /> Buscar</>}
                                                    color='#041768' onClick={getOrdenes}
                                                />
                                                <ButtonComp
                                                    label={<><DeleteSweep /> Limpiar </>}
                                                    color='#036cf5' onClick={limpiarOrdenes}
                                                />
                                            </div>
                                        </>)
                                    },
                                ]}
                            />
                        </div>
                        <div className='flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2'>
                            <Info
                                title="Servicios en tránsito"
                                data={conteoServ.Transito || "0"} />
                            <Divider color='#5F6C91' />
                            <Info
                                title="Servicios surtidos"
                                data={conteoServ.Surtidos || "0"} />
                            <Divider color='#5F6C91' />
                            <Info
                                title="Telemarketing"
                                data={conteoServ.Telemark || "0"} />
                            <Divider color='#5F6C91' />
                            <Info
                                title="Ruta"
                                data={conteoServ.Ruta || "0"} />
                            <Divider color='#5F6C91' />
                            <Info
                                title="APP"
                                data={conteoServ.App || "0"} />
                            <Divider color='#5F6C91' />
                            <Info
                                title="Total de servicios"
                                data={conteoServ.Total || "0"} />
                        </div>
                    </div>
                    <div className="flex-auto md:order-2">
                        <div className="flex flex-wrap">
                            <div className="w-full flex-none text-sm font-medium text-slate-700">
                                {states.ordenes.length > 0 ? (
                                    <div className="w-full h-[90vh] monitor-table">
                                        <Datatable
                                            virtual={true}
                                            searcher={false}
                                            data={states.ordenes}
                                            editing={{
                                                mode: "cell",
                                                allowUpdating: true,
                                                allowDeleting: false
                                            }}
                                            columns={[
                                                {
                                                    header: " ", cell: ({ item }) => (
                                                        <div className='relative w-[90px] h-[20px]'>
                                                            <div className={`${estatusColors[item.estatus - 1]} absolute rounded-full h-[100%] w-[9px] top-0 left-2`} />
                                                        </div>
                                                    ),
                                                    width: '40px'
                                                },
                                                { width: '10%', header: 'Folio', accessor: 'pedidoId' },
                                                { width: '10%', header: "Hora", accessor: "fechaPedido", cell: ({ item }) => (new Date(item.fechaPedido)).formatTime() },
                                                { width: '10%', header: 'Origen', accessor: 'descripcion' },
                                                { width: '10%', header: 'Telefono', accessor: 'telefono' },
                                                { width: '30%', header: 'Nombre del cliente', accessor: 'Nombres', cell: ({ item }) => item.Nombre + " " + item.Apellido1 + " " + item.Apellido2 },
                                                { width: '10%', header: 'Cantidad', accessor: 'Cantidad', cell: ({ item }) => numberFormat(item.Cantidad) },
                                                { width: '10%', header: 'Pedido-Servicio', accessor: 'tipoServicio_descripcion' },
                                                { width: '10%', header: 'Ruta', accessor: 'ruta_nombre' },
                                                { width: '10%', header: 'Remision', accessor: 'remision' },
                                                {
                                                    width: '100px',
                                                    header: "Acciones",
                                                    cell: ({ item }) => (
                                                        <>
                                                            {
                                                                pagesPermission.clientePedidos && (<>
                                                                    <Tooltip title="Ver cliente">
                                                                        <Link to={'/clientes-pedidos'} state={{
                                                                            item: { telefono: item.telefono, direccionPedidosId: item.direccionPedidosId, },
                                                                            showPedido: true
                                                                        }} ><Person /></Link>
                                                                    </Tooltip>
                                                                    <Tooltip title="Ver pedido">
                                                                        <Link to={'/clientes-pedidos'} state={{
                                                                            item: {
                                                                                telefono: item.telefono,
                                                                                direccionPedidosId: item.direccionPedidosId,
                                                                                pedidoId: item.pedidoId
                                                                            }, showPedido: false
                                                                        }} ><Description /></Link>
                                                                    </Tooltip>
                                                                </>)

                                                            }
                                                            {
                                                                pagesPermission.correccionPediido && (
                                                                    <Tooltip title="Correccion de pedido">
                                                                        <Link
                                                                            to={'/correcion_pedidos'}
                                                                            state={{ item: item.pedidoId, showPedido: true }}
                                                                        ><SyncAlt /></Link>
                                                                    </Tooltip>
                                                                )
                                                            }
                                                        </>
                                                    ),
                                                },
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center non-selectable h-[90vh] ">
                                        <div>
                                            <div className="flex justify-center">
                                                <img src={camionLogo} className="non-selectable" />
                                            </div>
                                            <h2 className="text-[20px]" style={{ textAlign: 'center', color: 'gray' }}>
                                                No se ha encontrado información.
                                            </h2>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

const Info = ({ title = '', data = '' }) => {
    return (<>
        <div className='flex justify-between'>
            <span>{title}</span>
            <span>{data}</span>
        </div>
    </>)
}
