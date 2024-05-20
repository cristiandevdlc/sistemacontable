import React, { useEffect, useState, useContext } from "react";
import CheckMenuPermission from '@/core/CheckMenuPermission';
import UserMenusContext from '@/Context/UserMenusContext';
import { camionLogo, noty, numberFormat } from '@/utils';
import { FieldDrawer } from '@/components/DialogComp';
import { ButtonComp } from '@/components/ButtonComp';
import LoadingDiv from '@/components/LoadingDiv';
import LocalizacionMap from './LocalizacionMap';
import Datatable from '@/components/Datatable';
import { Search } from '@mui/icons-material';
import { Request } from '@/core/Request';
import { Divider } from "@mui/material";
import Imagen from './img/camion.png';
import moment from 'moment';

export default function Localizacion_gps() {
    const { userMenus, selectedMenu, SetSelectedMenuFunc } = useContext(UserMenusContext);
    const [state, setState] = useState({
        hasPermission: false,
        loading: true,
        tiposServ: [],
        unidades: [],
        rutas: [],
        open: false,
        services: [],

        withGps: [],
        withoutGps: [],
    })
    const [localizar, setLocalizar] = useState(0);
    const [data, setData] = useState({ servicio: null, ruta: null, unidad: null,vendedor:null});

    const getAllData = async () => {
        const [ rutas, unidades, tiposServ ] = await Promise.all([
            Request._get(route("rutas.index")),
            Request._get(route("getUnidadesConRuta")),
            Request._get(route("tipos-servicios.index")),
        ])
        setState({
            ...state,
            tiposServ: tiposServ,
            unidades: unidades,
            rutas: rutas,
            loading: false,
            hasPermission: CheckMenuPermission(userMenus)?.special
        })

        await getPendingOrders()
    }

    const getPendingOrders = async () => {
        const [
            resPendientes,
            resUnidades
        ] = await Promise.all([
            Request._post(route('servicespendient'), data),
            Request._post(route('Localizacion_servicio'), data)
        ])

        if (!resPendientes.length) noty('No hay servicios pendientes')

        setState(prev => ({ ...prev, ...resUnidades, services: resPendientes }))
    };


    useEffect(() => {
        if (userMenus) getAllData()
    }, [userMenus]);

    useEffect(() => {
        if (data.refresh) getPendingOrders()
    }, [data]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }

            {(!state.loading && !state.hasPermission) && (
                <div className="h-full w-full">
                    <div className="flex w-full h-[75%] mt-7 justify-center">
                        <img src={camionLogo} />
                    </div>
                    <div className="flex w-full h-[75%] justify-center text-center">
                        <p>No tienes autrización para ver este recurso</p>
                    </div>
                </div>
            )}

            {(!state.loading && state.hasPermission) && <>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 ">
                    <div className="rounded-lg bg-white-200">
                        <div className='grid grid-cols-2 gap-x-2 border-2 w-full shadow-md px-4 py-3 rounded-xl'>
                            <div className='text-[20px] col-span-full'>Servicios pendientes {state.services?.length}</div>
                            <FieldDrawer
                                fields={[
                                   
                                    {
                                        select: true,
                                        label: 'Tipo de servicio',
                                        options: state.tiposServ,
                                        value: data.servicio,
                                        data: "tipoServicio_descripcion",
                                        style: 'col-span-full',
                                        valueKey: "tipoServicio_idTipoServicio",
                                        onChangeFunc: (e) => setData({ ...data, unidad: null, ruta: null, servicio: e })
                                    },
                                    
                                    {
                                        select: true,
                                        style: 'col-span-full',
                                        label: 'Ruta',
                                        options: data.servicio ? state.rutas.filter(r => r.ruta_idTipoServicio == data.servicio) : state.rutas,
                                        data: "ruta_nombre",
                                        valueKey: "ruta_idruta",
                                        value: data.ruta,
                                        onChangeFunc: (e) => setData({ ...data, unidad: null, ruta: e })
                                    },
                                    {
                                        select: true,
                                        style: 'col-span-full',
                                        label: 'Unidad',
                                        options: data.ruta ? state.unidades.filter(r => r.quienConQuien_idRuta == data.ruta) : state.unidades,
                                        data: "unidad_numeroComercial",
                                        valueKey: "unidad_idUnidad",
                                        value: data.unidad,
                                        onChangeFunc: (e) => setData({ ...data, unidad: e })
                                    },
                                ]}

                                
                            />
                            <div className='col-span-full  pb-4 gap-2'>
                                <ButtonComp
                                    label={<><Search className='mr-1' />Buscar</>}
                                    onClick={getPendingOrders}
                                />
                            </div>
                        </div>
                        <div>
                            {state.services?.length === 0 ? (
                                <div className="mt-12" >
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={Imagen} />
                                    </div>
                                    <h2 style={{ textAlign: 'center', fontSize: '20px', color: 'white' }}>
                                        Sin servicios pendientes.
                                    </h2>
                                </div>
                            ) : (
                                state.services && (
                                    <div className=' my-5 relative h-[50vh]' >
                                        <div className="w-full  pt-4 monitor-table">
                                            <Datatable
                                                tableClass={'h-[50vh]'}
                                                className={'h-[50vh]'}
                                                searcher={false}
                                                data={state.services}
                                                rowClass={(eprops) =>
                                                    eprops.item.pedidoId === localizar
                                                        ? 'bg-[green] text-[#E5E5E5]'
                                                        : 'bg-[white] text-black'
                                                }
                                                columns={[
                                                    { header: 'Fecha', accessor: 'fechaPedido', cell: eprops => <span>{moment(eprops.item.fechaPedido).format('DD/MM/YYYY hh:mm:ss A')}</span> },
                                                    { header: 'Cliente', accessor: 'Nombre', cell: eprops => <span>{eprops.item.Nombre} {eprops.item.Apellido1} {eprops.item.Apellido2}</span> },
                                                    { header: 'Direccion', accessor: 'calle', cell: eprops => <span>{eprops.item.calle} {eprops.item.numeroExterior}</span> },
                                                    { header: 'Colonia', accessor: 'Colonia_Nombre' },
                                                    { header: 'Cantidad ', cell: ({ item }) => numberFormat(item.Cantidad) },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="h-32  sm:h-[10vh] rounded-lg bg-white-200 lg:col-span-2">
                        <LocalizacionMap state={state} setData={setData} getPendingOrders={getPendingOrders} />
                    </div>
                </div>
            </>
            }
        </div>
    );
}
