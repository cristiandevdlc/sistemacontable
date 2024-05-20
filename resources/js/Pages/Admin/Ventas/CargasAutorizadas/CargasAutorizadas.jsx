import SelectComp from '@/components/SelectComp';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { useEffect, useState } from 'react'
import request from "@/utils";
import Imagen from './../VentasPortatil/camion.png'
import LoadingDiv from '@/components/LoadingDiv';

//CAPACIDADÑ

const CargasAutorizadas = () => {
    const [loading, setLoading] = useState(true)
    const [units, setUnits] = useState([])
    const [servicesTypes, setServicesTypes] = useState()
    const [products, setProducts] = useState([])
    const [authLoads, setAuthLoads] = useState()
    const [selectedItemKeys, setSelectedItemKeys] = useState();
    const [data, setData] = useState({
        CargaAutorizada_id: '', CargaAutorizada_unidad: '', CargaAutorizada_idTipoServicio: '',
        CargaAutorizada_idProducto: '', CargaAutorizada_cantidad: '',
    })

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const dataSource = new DataSource({ store: new ArrayStore({ data: products, key: 'producto_idProducto' }) });

    const fetchUnidades = async () => {
        const response = await request(route('unidades-por-tiposervicio', data.CargaAutorizada_idTipoServicio))
        setUnits(response)
    }

    const fetchTiposServicios = async () => {
        const response = await request(route('tipos-servicios.index'))
        setServicesTypes(response)
    }
    const fetchAuthLoads = async () => {
        const response = await request(route('carga-autorizada.index'))
        setAuthLoads(response)
    }

    const fetchProducts = async () => {
        const response = await request(route('productos-por-tiposervicio', data.CargaAutorizada_unidad));
        setProducts(response);
    }

    const saveChanges = async (e) => {
        if (!e.oldData.CargaAutorizada_id) {
            const response = await request(route('carga-autorizada.store'), 'POST', { ...data, CargaAutorizada_idProducto: e.key, CargaAutorizada_cantidad: e.newData.valor })
        } else {
            const response = await request(route('carga-autorizada.update', e.oldData.CargaAutorizada_id), 'PUT', { ...data, CargaAutorizada_idProducto: e.key, CargaAutorizada_cantidad: e.newData.valor })
        }
        setData({ ...data, CargaAutorizada_idProducto: '', CargaAutorizada_cantidad: '' })
        fetchAuthLoads()
    }

    const selectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
        setSelectedItemKeys(selectedRowKeys);
    };

    const rowClickSetProduct = ({ row }) => {
        setData({ ...data, CargaAutorizada_idProducto: row.data.producto_idProducto })
    }

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    useEffect(() => {
        fetchAuthLoads()
        fetchTiposServicios()
        getMenuName()
    }, [])

    useEffect(() => {
        if (authLoads && servicesTypes) setLoading(false)
    }, [authLoads, servicesTypes])

    useEffect(() => {
        if (data.CargaAutorizada_idTipoServicio !== '') {
            fetchUnidades()
        }
    }, [data.CargaAutorizada_idTipoServicio])

    useEffect(() => {
        if (data.CargaAutorizada_unidad !== '') {
            fetchProducts()
        }
    }, [data.CargaAutorizada_unidad])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className='flex flex-col gap-6'>
                    <div className="grid grid-cols-2 gap-3 border-2 shadow-md px-4 pb-3 rounded-xl">
                        <SelectComp
                            label="Tipo de servicio"
                            options={servicesTypes}
                            value={data.CargaAutorizada_idTipoServicio || ''}
                            onChangeFunc={(newValue) =>
                                setData(prev => ({ ...prev, CargaAutorizada_idTipoServicio: newValue, CargaAutorizada_unidad: '' }))
                            }
                            data="tipoServicio_descripcion"
                            valueKey="tipoServicio_idTipoServicio"
                        />
                        <SelectComp
                            label="Unidades"
                            options={units}
                            value={data.CargaAutorizada_unidad || ''}
                            onChangeFunc={(newValue) =>
                                setData(prev => ({ ...prev, CargaAutorizada_unidad: newValue }))
                            }
                            data="unidad_numeroComercial"
                            valueKey="unidad_idUnidad"
                        />
                    </div>
                    {data.CargaAutorizada_unidad ? (
                        <div>
                            <div className='virtualTable blue-scroll max-h-[92%] monitor-table'>
                                <DataGrid
                                    dataSource={dataSource}

                                    selectedRowKeys={selectedItemKeys}
                                    selectionChanged={selectionChanged}
                                    showBorders={true}
                                    showRowLines={true}
                                    showColumnLines={true}
                                    onRowUpdating={saveChanges}
                                    onCellDblClick={rowClickSetProduct}
                                >
                                    <Editing
                                        mode="cell"
                                        allowUpdating={true}
                                    />
                                    <Column alignment='center' dataField="producto_nombre" caption='Nombre del producto' allowEditing={false} />
                                    <Column alignment='center' dataField="valor" caption='Valor' allowEditing={true} />
                                </DataGrid>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '50px' }}>
                                <img src={Imagen} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
                                <p style={{ fontSize: '1rem', marginTop: '10px' }}>Selecciona un Tipo de servicio y una Unidad.</p>
                            </div>
                        </>
                    )}

                </div>
            }
        </div>
    )
}

export default CargasAutorizadas