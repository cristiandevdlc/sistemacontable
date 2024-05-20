import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import ConfClientesDialog from './ConfClientesDialog';
import PersonIcon from '@mui/icons-material/Person';
import React, { useEffect, useState } from 'react';
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import Datatable from '@/components/Datatable';
import { useForm } from '@inertiajs/react';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import request from '@/utils';

// servicios-en-transito
const ConfirmacionClientes = () => {
    const [state, setState] = useState({
        loading: true,
        open: false,
        action: '',
        productos: null,
        preguntas: null,
        clientes: null,
        fecha: new Intl.DateTimeFormat('es-MX').format(new Date)
    })
    const [filters, setFilters] = useState({
        productoId: 0
    })
    const [filteredData, setFilteredData] = useState()
    const { data, setData } = useForm({})


    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchdata = async () => {
        const response = await request(route("encuesta-cliente.index"), "GET");
        setState({ ...state, clientes: response, loading: false });
    };

    const getSelectOptions = async () => {
        const [productoResponse, preguntasResponse] = await Promise.all([
            fetch(route("productos.index")).then(response => response.json()),
            fetch(route("preguntas-encuestas.index")).then(response => response.json())
        ]);
        setState({ ...state, productos: productoResponse, preguntas: preguntasResponse })
    }

    const search = () => {
        if (filters.productoId) {
            const filtered = state.clientes.filter((item) => {
                const filterFechaPedido = !filters.productoId || item.productoId.toString() === filters.productoId.toString();
                return filterFechaPedido;
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(state.clientes);
        }
    };

    const noAnswer = async (item) => {
        await request(route('no-answer'), "POST", item)
            .then(() => fetchdata())
    }

    const handleCloseModal = () => {
        setData({})
        setState({ ...state, open: false })
    }

    useEffect(() => {
        if (!state.productos && !state.preguntas) getSelectOptions()
        if (!state.clientes) fetchdata()
        search()
    }, [state])

    useEffect(() => {
        getMenuName();
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading && <LoadingDiv />}
            {(filteredData && !state.loading) && <>
                <div className='flex content-end gap-x-4 items-end pb-4'>
                    <SelectComp
                        label="Productos"
                        fistrOption={true}
                        firstLabel={"Todos"}
                        options={state.productos}
                        value={filters.productoId || ''}
                        data="producto_nombre"
                        valueKey="producto_idProducto"
                        onChangeFunc={(value) => setFilters({ ...filters, productoId: value })}
                    />

                    <button onClick={() => search()} className='bg-[#1B2654] text-white rounded-lg py-[10px] px-[25px] col-span-1'>Buscar</button>
                </div>
                {data.pedidoId &&
                    <ConfClientesDialog
                        open={state.open}
                        handleCloseModal={handleCloseModal}
                        questions={state.preguntas.sort((a, b) => a.prioridad - b.prioridad)}
                        cliente={data}
                        getData={fetchdata}
                    />
                }
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={filteredData}
                        searcher={false}
                        columns={[
                            { header: "Cliente", accessor: "cliente" },
                            { header: "Teléfono", accessor: "telefono" },
                            { header: "Producto", accessor: "servicio" },
                            {
                                header: "Acciones",
                                custom: eprops => (
                                    <>

                                        <Tooltip title="Realizar encuesta">
                                            <DownloadDoneIcon
                                                className='rounded-full cursor-pointer'
                                                onClick={() => {
                                                    setData({ ...eprops.item })
                                                    setState({ ...state, open: true })
                                                }}
                                            />
                                        </Tooltip>

                                        <Tooltip title="Ir al cliente">
                                            <Link to={'/clientes-pedidos'} state={{ item: eprops.item, showPedido: false }}>
                                                <PersonIcon className='rounded-full cursor-pointer' />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="No responde">
                                            <PhoneDisabledIcon
                                                className='rounded-full cursor-pointer'
                                                onClick={() => {
                                                    noAnswer(eprops.item)
                                                }}
                                            />
                                        </Tooltip>
                                    </>
                                )
                            }
                        ]}
                    />
                </div>
            </>
            }
        </div>
    )
}

export default ConfirmacionClientes