import React, { useEffect, useRef, useState } from 'react';
import SelectComp from '@/components/SelectComp';
import request from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import selectOptImg from '../../../../../png/camion.png'

export default function Vespxmat() {
    const [state, setState] = useState({ loading: true, loadingTables: false })
    const [servicios, setServicios] = useState([]);
    const [rutasMatutinas, setRutasMatutinas] = useState()
    const [rutasVespertinas, setRutasVespertinas] = useState([])
    const [rutasVespertinasSelect, setRutasVespertinasSelect] = useState()
    const [selectedMatutineRoutes, setSelectedMatutineRoutes] = useState()
    const [selectedVespertineRoutes, setSelectedVespertineRoutes] = useState()
    const dataRoutesVespGrid = useRef([])
    const dataRoutesMatGrid = useRef([])
    const tableMat = useRef()
    const tableVesp = useRef()
    const [requestData, setRequestData] = useState({
        serviceSelected: null,
        vespRouteSelected: null,
    });

    // #region GET de Servicios
    const fetchServicios = async () => {
        try {
            const response = await request(route('vespxmat.index'))
            setServicios(response)
        } catch (error) {
            console.error('Error al obtener los datos de servicios:', error)
        }
    }
    // #endregion

    // #region GET de rutas vespertinas al seleccionar un tipo de servicio (SELECT)
    const fetchVespRouteByServices = async () => {
        try {
            const response = await request(route('vespxmat-rutas-vespertinas-por-servicio', requestData.serviceSelected))
            setRutasVespertinasSelect(response)
        } catch (error) {
            console.error('Error al obtener los datos de servicios:', error)
        }
    }
    // #endregion

    // #region GET de rutas matutinas al seleccionar un tipo de servicio (TABLA)
    const fetchAvRoutesByService = async () => {
        setState({ ...state, loadingTables: true })
        try {
            const response = await request(route('vespxmat-rutas-matutitnas-disponibles-por-servicio'), 'POST',
                { service: requestData.serviceSelected, vesel: requestData.vespRouteSelected })
            setRutasMatutinas(response)
            setState({ ...state, loadingTables: false })
        } catch (error) {
            console.error('Error al obtener los datos de rutas:', error);
        }
    }
    // #endregion

    // #region GET de rutas matutinas al seleccionar una ruta vespertinas
    const fetchCurrentSyncVespRoute = async () => {
        try {
            const response = await request(route(`vespxmat-rutas-matutinas-con-vespertinas`, requestData.vespRouteSelected))
            setRutasVespertinas(response)
        } catch (error) {
            console.error('Error al obtener los datos de rutas:', error);
        }
    }
    // #endregion

    // #region POST de turno de las rutas
    const changeRoutes = async (action) => {
        let response = null
        if (action === 'MatToVes') {
            response = await request(route('vespxmax-cambiar-rutas'), 'POST',
                { action: action, selectedRoutesToMove: selectedMatutineRoutes, vespRouteSelectedInSelect: requestData.vespRouteSelected })
        } else {
            response = await request(route('vespxmax-cambiar-rutas'), 'POST',
                { action: action, selectedRoutesToMove: selectedVespertineRoutes, vespRouteSelectedInSelect: requestData.vespRouteSelected })

        }
        fetchCurrentSyncVespRoute()
        fetchAvRoutesByService()
    }
    // #endregion

    const onChangeMat = ({ selectedRowKeys, selectedRowsData }) => {
        dataRoutesMatGrid.current = selectedRowsData
        setSelectedMatutineRoutes(selectedRowKeys)
    }

    const onChangeVesp = ({ selectedRowKeys, selectedRowsData }) => {
        dataRoutesVespGrid.current = selectedRowsData
        setSelectedVespertineRoutes(selectedRowKeys)
    }

    useEffect(() => {
        fetchServicios()
    }, [])

    useEffect(() => {
        if (servicios) setState({ ...state, loading: false })
    }, [servicios])

    useEffect(() => {
        if (requestData.serviceSelected && requestData.vespRouteSelected != null) {
            fetchAvRoutesByService()
        }
    }, [requestData.serviceSelected, requestData.vespRouteSelected])

    useEffect(() => {
        if (requestData.serviceSelected) {
            fetchVespRouteByServices()
        }
    }, [requestData.serviceSelected])

    useEffect(() => {
        if (requestData.vespRouteSelected && requestData.serviceSelected) {
            fetchCurrentSyncVespRoute()
            fetchAvRoutesByService()
        }
    }, [requestData.vespRouteSelected])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className="grid grid-cols-1 gap-3">
                    <div className='flex sm:flex-col md:flex-row gap-x-10 border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                        <SelectComp
                            label="Tipo de servicio"
                            options={servicios}
                            value={requestData.serviceSelected}
                            onChangeFunc={(newValue) => {
                                setRequestData({ ...requestData, serviceSelected: newValue });
                            }}
                            data="tipoServicio_descripcion"//Sale en el select
                            valueKey="tipoServicio_idTipoServicio"//El id del row
                        />
                        <SelectComp
                            label="Rutas Vespertinas del servicio seleccionado"
                            options={rutasVespertinasSelect}
                            value={requestData.vespRouteSelected}
                            onChangeFunc={(newValue) => {
                                setRequestData({ ...requestData, vespRouteSelected: newValue });
                            }}
                            data="ruta_nombre"
                            valueKey="ruta_idruta"
                        />
                    </div>
                    {!state.loadingTables && (requestData.serviceSelected && requestData.vespRouteSelected !== null) ? (
                        <div className="mt-5 h-screen">
                            {/* Left table */}
                            {
                                rutasMatutinas && (
                                    <div className="grid h-full mb-5 grid-cols-11 gap-2 sm:overflow-y-auto md:overflow-y-hidden blue-scroll">
                                        <div className="relative sm:col-span-11 md:col-span-5 text-center">
                                            <h4>Rutas Matutinas</h4>
                                            <Datatable
                                                tableId="DataGridRutasMatutinas"//TABLE KEY
                                                rowId="ruta_idruta"//REGUSTRO KEY
                                                data={rutasMatutinas}
                                                height="520px"
                                                selection={'multiple'}
                                                virtual={true}
                                                selectedData={selectedMatutineRoutes}
                                                selectionFunc={onChangeMat}
                                                tableRef={tableMat}
                                                columns={[
                                                    { header: "Nombre", accessor: "ruta_nombre" }
                                                ]}
                                            />
                                        </div>
                                        {/* Mid Buttons */}
                                        <div className="flex items-center justify-center sm:col-span-11 md:col-span-1 row-span-1">
                                            <div className="grid col-span-1 gap-12">
                                                <div>
                                                    <button disabled={dataRoutesMatGrid.current.length != 0 ? false : true} onClick={() => changeRoutes('MatToVes')}><KeyboardDoubleArrowRightIcon /></button>
                                                </div>
                                                <div>
                                                    <button disabled={dataRoutesVespGrid.current.length != 0 ? false : true} onClick={() => changeRoutes('VesToMat')}><KeyboardDoubleArrowLeftIcon /></button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Rigth table */}
                                        <div className="sm:col-span-11 md:col-span-5 text-center">
                                            <h4>Rutas Vespertinas</h4>
                                            <Datatable
                                                tableId="dataGridRutasVespertinas"
                                                rowId="mat"
                                                height="520px"
                                                data={rutasVespertinas}
                                                selection={'multiple'}
                                                virtual={true}
                                                selectedData={selectedVespertineRoutes}
                                                selectionFunc={onChangeVesp}
                                                tableRef={tableVesp}
                                                columns={[
                                                    { header: "Nombre", accessor: "matName" },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    ) : ((requestData.serviceSelected && requestData.vespRouteSelected) ? (
                        <div className='flex items-center justify-center h-[80vh]'>
                            <LoadingDiv />
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-[80vh] '>
                            <img className='scale-60 non-selectable' src={selectOptImg} alt="" />
                            <h2>Selecciona un tipo de servicio y una ruta.</h2>
                        </div>
                    ))
                    }
                </div>
            }
        </div>
    );
}
